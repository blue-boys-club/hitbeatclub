import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { Prisma, Product } from "@prisma/client";
import { ENUM_PRODUCT_FILE_TYPE, ENUM_PRODUCT_SORT } from "./product.enum";
import { ProductUpdateDto } from "./dto/request/product.update.dto";
import { FileService } from "../file/file.service";
import { ProductCreateRequest, ProductListQueryRequest } from "@hitbeatclub/shared-types/product";
import {
	PRODUCT_ALREADY_LIKED_ERROR,
	PRODUCT_CREATE_ERROR,
	PRODUCT_LICENSE_NOT_FOUND_ERROR,
	PRODUCT_UPDATE_ERROR,
	PRODUCT_UPDATE_LICENSE_ERROR,
} from "./product.error";
import { Logger } from "@nestjs/common";
import { UserLikeProductListRequest } from "@hitbeatclub/shared-types/user";

@Injectable()
export class ProductService {
	private readonly logger = new Logger(ProductService.name);
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll(
		where: any,
		{ page, limit, sort, genreIds, tagIds }: ProductListQueryRequest,
		select: string[] = [],
		userId?: number,
	) {
		try {
			const products = await this.prisma.product
				.findMany({
					where: {
						deletedAt: null,
						...where,
					},
					include: {
						artistSellerIdToArtist: {
							select: {
								id: true,
								stageName: true,
								slug: true,
								profileImageUrl: true,
								isVerified: true,
							},
						},
						productLicense: {
							select: {
								licenseId: true,
								price: true,
								license: {
									select: {
										type: true,
									},
								},
							},
						},
						...(genreIds
							? {
									productGenre: {
										where: {
											deletedAt: null,
											genreId: { in: genreIds },
										},
									},
								}
							: {}),
						...(tagIds
							? {
									productTag: {
										where: {
											deletedAt: null,
											tagId: { in: tagIds },
										},
									},
								}
							: {}),
						...(userId
							? {
									productLike: {
										where: {
											userId: BigInt(userId),
											deletedAt: null,
										},
									},
								}
							: {}),
					} as any,
					orderBy: { createdAt: sort === ENUM_PRODUCT_SORT.RECENT ? "desc" : "asc" },
					skip: (page - 1) * limit,
					take: limit,
				})
				.then((data) => this.prisma.serializeBigIntTyped(data))
				.catch((error) => {
					throw new BadRequestException(error);
				});

			// Batch load files for all products to avoid N+1 queries
			const productIds = products.map((p) => p.id);
			const allFiles = await this.fileService.findFilesByTargetIds({
				targetIds: productIds,
				targetTable: "product",
			});

			// Map files by productId for quick lookup
			const filesByProductId: Record<string, any[]> = {};
			for (const file of allFiles) {
				if (!filesByProductId[file.targetId.toString()]) {
					filesByProductId[file.targetId.toString()] = [];
				}
				filesByProductId[file.targetId.toString()].push(file);
			}

			const result = [];
			for (const product of products) {
				const seller = product.artistSellerIdToArtist;
				delete product.artistSellerIdToArtist;

				const files = filesByProductId[product.id.toString()] ?? [];
				const audioFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE);
				const coverImage = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE);

				let isLiked = null;
				if (userId) {
					isLiked = product.productLike?.some((like) => BigInt(like.userId) === BigInt(userId));
				}

				const selectedFields = {
					licenseInfo: product.productLicense
						.sort((a, b) => a.price - b.price)
						.map((l) => ({
							label: l.license.type,
							price: l.price,
						})),
				};
				if (select.length) {
					for (const field of select) {
						if (field === "seller") {
							selectedFields[field] = seller;
						} else if (field === "audioFile") {
							selectedFields[field] = audioFile
								? {
										id: audioFile?.id,
										url: audioFile?.url,
										originName: audioFile?.originName,
									}
								: null;
						} else if (field === "coverImage") {
							selectedFields[field] = {
								id: coverImage?.id,
								url: coverImage?.url,
								originName: coverImage?.originName,
							};
						} else if (field === "genres" && product?.productGenre?.length) {
							selectedFields[field] = await this.findProductGenresByIds(
								product.id,
								product.productGenre.map((pg) => pg.genreId),
							);
						} else if (field === "tags" && product?.productTag?.length) {
							selectedFields[field] = await this.findProductTagsByIds(
								product.id,
								product.productTag.map((pt) => pt.tagId),
							);
						} else if (field in product) {
							selectedFields[field] = product[field];
						}
					}
				} else {
					Object.assign(selectedFields, {
						id: product.id,
						type: product.type,
						productName: product.productName,
						description: product.description,
						price: product.price,
						category: product.category,
						isActive: product.isActive,
						createdAt: product.createdAt,
						minBpm: product.minBpm,
						maxBpm: product.maxBpm,
						musicKey: product.musicKey,
						scaleType: product.scaleType,
						genres: product?.productGenre?.length
							? await this.findProductGenresByIds(
									product.id,
									product.productGenre.map((pg) => pg.genreId),
								)
							: [],
						tags: product?.productTag?.length
							? await this.findProductTagsByIds(
									product.id,
									product.productTag.map((pt) => pt.tagId),
								)
							: [],
						seller,
						audioFile: audioFile || null,
						coverImage: coverImage || null,
						isPublic: product.isPublic,
						isLiked,
					});
				}

				result.push(selectedFields);
			}

			return !result.length ? [] : result;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findOne(id: number, userId?: number) {
		try {
			const product = await this.prisma.product
				.findFirst({
					where: { id, deletedAt: null },
					include: {
						artistSellerIdToArtist: {
							select: {
								id: true,
								stageName: true,
								profileImageUrl: true,
								isVerified: true,
							},
						},
						productLicense: {
							select: {
								licenseId: true,
								price: true,
								license: {
									select: {
										type: true,
									},
								},
							},
						},
						...(userId
							? {
									productLike: {
										where: { userId: BigInt(userId), deletedAt: null },
									},
								}
							: {}),
						productGenre: {
							where: {
								deletedAt: null,
							},
							select: {
								genre: {
									select: {
										id: true,
										name: true,
									},
								},
							},
						},
						productTag: {
							where: {
								deletedAt: null,
							},
							select: {
								tag: {
									select: {
										id: true,
										name: true,
									},
								},
							},
						},
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			const seller = product.artistSellerIdToArtist;
			const license = product.productLicense;
			const genres = product.productGenre;
			const tags = product.productTag;

			delete product.artistSellerIdToArtist;
			delete product.productLicense;
			delete product.productGenre;
			delete product.productTag;

			return {
				...product,
				seller,
				licenseInfo: license.map((l) => ({
					id: l.licenseId,
					type: l.license.type,
					price: l.price,
				})),
				genres: genres.map((pg) => {
					return {
						id: pg.genre.id,
						name: pg.genre.name,
					};
				}),
				tags: tags.map((pt) => {
					return {
						id: pt.tag.id,
						name: pt.tag.name,
					};
				}),
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	/**
	 * Create a new product
	 * @param userId - The ID of the user creating the product
	 * @param createProductDto - The data for the new product
	 * @returns The created product
	 */
	async create(userId: number, createProductDto: ProductCreateRequest) {
		return await this.prisma.$transaction(async (tx) => {
			try {
				const genres = createProductDto?.genres;
				const tags = createProductDto?.tags;
				const licenseInfo = createProductDto?.licenseInfo;
				delete createProductDto.genres;
				delete createProductDto.tags;
				delete createProductDto.licenseInfo;

				const product = await tx.product
					.create({
						data: {
							...createProductDto,
							sellerId: userId,
						},
					})
					.then((data) => this.prisma.serializeBigInt(data));

				if (genres?.length) {
					for (const genreName of genres) {
						await this.createProductGenre(
							{
								productId: product.id,
								genreName,
							},
							tx,
						);
					}
				}

				if (tags?.length) {
					for (const tagName of tags) {
						await this.createProductTag(
							{
								productId: product.id,
								tagName,
							},
							tx,
						);
					}
				}

				if (licenseInfo?.length) {
					for (const license of licenseInfo) {
						await this.createProductLicense({ productId: product.id, license }, tx);
					}
				}

				return product;
			} catch (e: any) {
				throw new BadRequestException({
					...PRODUCT_CREATE_ERROR,
					detail: e?.message,
				});
			}
		});
	}

	async update(id: number, updateProductDto: ProductUpdateDto) {
		return await this.prisma.$transaction(async (tx) => {
			try {
				const genres = updateProductDto?.genres;
				const tags = updateProductDto?.tags;
				const licenseInfo = updateProductDto?.licenseInfo;
				delete updateProductDto.genres;
				delete updateProductDto.tags;
				delete updateProductDto.licenseInfo;

				if (genres?.length) {
					const genreIds = [];
					// 새로운 장르 추가
					for (const genreName of genres) {
						const genre = await this.createProductGenre({ productId: id, genreName }, tx);
						if (genre?.genreId) {
							genreIds.push(genre.genreId);
						}
					}

					await this.updateProductGenres({ productId: id, genreIds }, tx);
				}

				if (tags?.length) {
					const tagIds = [];
					// 새로운 태그 추가
					for (const tagName of tags) {
						const tag = await this.createProductTag({ productId: id, tagName }, tx);
						tagIds.push(tag.tagId);
					}

					await this.updateProductTags({ productId: id, tagIds }, tx);
				}

				if (licenseInfo?.length) {
					// 라이센스 업데이트
					for (const license of licenseInfo) {
						await this.updateProductLicense({ productId: id, license }, tx);
					}
				}

				return await tx.product
					.update({
						where: { id },
						data: updateProductDto,
					})
					.then((data) => this.prisma.serializeBigInt(data));
			} catch (e: any) {
				if (e?.response) {
					throw new BadRequestException(e?.response);
				}
				throw new BadRequestException({
					...PRODUCT_UPDATE_ERROR,
					detail: e?.message,
				});
			}
		});
	}

	async softDelete(id: number) {
		try {
			return await this.prisma.product
				.update({
					where: { id },
					data: { deletedAt: new Date() },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async uploadProductFile({
		uploaderId,
		productId,
		fileIds,
	}: {
		uploaderId: number;
		productId: number;
		fileIds: {
			audioFileFileId: number;
			coverImageFileId: number;
			zipFileId: number;
		};
	}) {
		await this.fileService.updateFileEnabledAndDelete({
			uploaderId,
			newFileIds: fileIds.audioFileFileId ? [fileIds.audioFileFileId] : [],
			targetTable: "product",
			targetId: productId,
			type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE,
		});

		await this.fileService.updateFileEnabledAndDelete({
			uploaderId,
			newFileIds: fileIds.coverImageFileId ? [fileIds.coverImageFileId] : [],
			targetTable: "product",
			targetId: productId,
			type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE,
		});

		await this.fileService.updateFileEnabledAndDelete({
			uploaderId,
			newFileIds: fileIds.zipFileId ? [fileIds.zipFileId] : [],
			targetTable: "product",
			targetId: productId,
			type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_ZIP_FILE,
		});
	}

	async findProductFiles(id: number) {
		const files = await this.fileService.findFilesByTargetId({
			targetId: id,
			targetTable: "product",
		});

		const audioFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE);
		const coverImageFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE);
		const zipFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_ZIP_FILE);

		return {
			audioFile: audioFile
				? {
						id: audioFile?.id,
						url: audioFile?.url,
						originName: audioFile?.originName,
					}
				: null,
			coverImage: coverImageFile
				? {
						id: coverImageFile?.id,
						url: coverImageFile?.url,
						originName: coverImageFile?.originName,
					}
				: null,
			zipFile: zipFile
				? {
						id: zipFile?.id,
						url: zipFile?.url,
						originName: zipFile?.originName,
					}
				: null,
		};
	}

	async getTotal(where) {
		const total = await this.prisma.product.count({
			where: { deletedAt: null, ...where },
		});
		return total;
	}

	async createProductGenre(
		{ productId, genreName }: { productId: number; genreName: string },
		tx?: Prisma.TransactionClient,
	) {
		const transaction = tx || this.prisma;

		let genre = await transaction.genre
			.findFirst({
				where: { name: genreName },
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (!genre) {
			genre = await transaction.genre
				.create({
					data: { name: genreName },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		}
		const existingGenre = await transaction.productGenre
			.findFirst({
				where: { productId, genreId: genre.id },
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (existingGenre) {
			return existingGenre;
		}

		return await transaction.productGenre
			.create({
				data: {
					productId,
					genreId: genre.id,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findProductGenresByIds(productId: number | bigint, genreIds: number[] | bigint[]) {
		const genres = await this.prisma.productGenre
			.findMany({
				where: { AND: [{ genreId: { in: genreIds } }, { deletedAt: null }, { productId }] },
				select: {
					genre: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			})
			.then((data) => this.prisma.serializeBigIntTyped(data))
			.then((data) => data.map((item) => item.genre));

		return genres;
	}

	async findProductTagsByIds(productId: number | bigint, tagIds: number[] | bigint[]) {
		const tags = await this.prisma.productTag
			.findMany({
				where: { AND: [{ tagId: { in: tagIds } }, { deletedAt: null }, { productId }] },
				select: {
					tag: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			})
			.then((data) => this.prisma.serializeBigInt(data))
			.then((data) => data.map((item) => item.tag));

		return tags;
	}

	async createProductTag(
		{ productId, tagName }: { productId: number; tagName: string },
		tx?: Prisma.TransactionClient,
	) {
		const transaction = tx || this.prisma;

		let tag = await transaction.tag
			.findFirst({
				where: { name: tagName },
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (!tag) {
			tag = await transaction.tag
				.create({
					data: { name: tagName },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		}

		const existingTag = await transaction.productTag
			.findFirst({
				where: { productId, tagId: tag.id },
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (existingTag) {
			return existingTag;
		}

		return await transaction.productTag
			.create({
				data: {
					productId,
					tagId: tag.id,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async updateProductLicense(
		{ productId, license }: { productId: number; license: { type: string; price: number } },
		tx?: Prisma.TransactionClient,
	) {
		try {
			const transaction = tx || this.prisma;

			const licenseRow = await transaction.license
				.findFirst({
					where: { type: license?.type },
				})
				.then((data) => this.prisma.serializeBigInt(data));

			if (!licenseRow?.id) {
				throw new BadRequestException(PRODUCT_LICENSE_NOT_FOUND_ERROR);
			}

			await transaction.productLicense.update({
				where: { productId_licenseId: { productId, licenseId: licenseRow?.id } },
				data: {
					price: license?.price,
				},
			});

			return licenseRow;
		} catch (e: any) {
			throw new BadRequestException({
				...PRODUCT_UPDATE_LICENSE_ERROR,
				detail: e?.message,
			});
		}
	}

	async createProductLicense(
		{ productId, license }: { productId: number; license: { type: string; price: number } },
		tx?: Prisma.TransactionClient,
	) {
		const transaction = tx || this.prisma;

		const licenseRow = await transaction.license.findFirst({
			where: { type: license?.type },
		});

		await transaction.productLicense.create({
			data: {
				productId,
				licenseId: licenseRow?.id,
				price: license?.price,
			},
		});
	}

	/**
	 * productGenre 이미 존재하면 두고 없으면 삭제, 기존에 없는 것만 생성
	 * @param param0
	 * @param tx
	 * @returns
	 */
	async updateProductGenres(
		{ productId, genreIds }: { productId: number; genreIds: number[] },
		tx?: Prisma.TransactionClient,
	) {
		const transaction = tx || this.prisma;

		// genreIds에 없는 것만 deletedAt 설정
		await transaction.productGenre.updateMany({
			where: {
				productId,
				genreId: {
					notIn: genreIds,
				},
				deletedAt: null,
			},
			data: {
				deletedAt: new Date(),
			},
		});

		// 기존에 없는 것만 생성
		const existingGenres = await transaction.productGenre
			.findMany({
				where: {
					productId,
					genreId: {
						in: genreIds,
					},
					deletedAt: null,
				},
				select: {
					genreId: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		const existingGenreIds = existingGenres.map((genre) => genre.genreId);
		const newGenreIds = genreIds.filter((id) => !existingGenreIds.includes(id));

		for (const genreId of newGenreIds) {
			await transaction.productGenre.upsert({
				where: {
					productId_genreId: {
						productId,
						genreId,
					},
				},
				create: {
					productId,
					genreId,
				},
				update: {
					deletedAt: null,
				},
			});
		}
	}

	/**
	 * productTag 이미 존재하면 두고 없으면 삭제, 기존에 없는 것만 생성
	 * @param param0
	 * @param tx
	 * @returns
	 */
	async updateProductTags(
		{ productId, tagIds }: { productId: number; tagIds: number[] },
		tx?: Prisma.TransactionClient,
	) {
		const transaction = tx || this.prisma;
		// tagIds에 없는 것만 deletedAt 설정
		await transaction.productTag.updateMany({
			where: {
				productId,
				tagId: {
					notIn: tagIds,
				},
				deletedAt: null,
			},
			data: {
				deletedAt: new Date(),
			},
		});

		// 기존에 없는 것만 생성
		const existingTags = await transaction.productTag
			.findMany({
				where: {
					productId,
					tagId: {
						in: tagIds,
					},
					deletedAt: null,
				},
				select: {
					tagId: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		const existingTagIds = existingTags.map((tag) => tag.tagId);
		const newTagIds = tagIds.filter((id) => !existingTagIds.includes(id));

		for (const tagId of newTagIds) {
			await transaction.productTag.upsert({
				where: {
					productId_tagId: {
						productId,
						tagId,
					},
				},
				create: {
					productId,
					tagId,
				},
				update: {
					deletedAt: null,
				},
			});
		}
	}

	async findGenreAll() {
		return await this.prisma.genre
			.findMany({
				where: {
					deletedAt: null,
				},
				select: {
					id: true,
					name: true,
					_count: {
						select: {
							productGenre: true,
						},
					},
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async like(userId: number, productId: number) {
		// 이미 좋아요 눌렀는지 체크
		const existingLike = await this.prisma.productLike
			.findFirst({
				where: {
					userId: userId,
					productId: productId,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (existingLike) {
			throw new BadRequestException(PRODUCT_ALREADY_LIKED_ERROR);
		}

		return await this.prisma.productLike
			.create({
				data: {
					userId: BigInt(userId),
					productId: BigInt(productId),
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async unlike(userId: number, productId: number) {
		return await this.prisma.productLike
			.updateMany({
				where: {
					userId: BigInt(userId),
					productId: BigInt(productId),
					deletedAt: null,
				},
				data: { deletedAt: new Date() },
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findLikedProducts(userId: number, payload: UserLikeProductListRequest) {
		// 기본값 설정
		const page = payload.page || 1;
		const limit = payload.limit || 10;

		// 복합 조건을 위한 where 조건 구성
		const productWhereConditions: Prisma.ProductWhereInput = {};

		// 검색어 조건
		if (payload.search) {
			productWhereConditions.productName = { contains: payload.search };
		}

		// 카테고리 조건
		if (payload.category) {
			productWhereConditions.category = payload.category;
		}

		// 장르 조건
		if (payload.genreIds?.length) {
			productWhereConditions.productGenre = {
				some: {
					genreId: { in: payload.genreIds.map((id) => BigInt(id)) },
					deletedAt: null,
				},
			};
		}

		// 태그 조건
		if (payload.tagIds?.length) {
			productWhereConditions.productTag = {
				some: {
					tagId: { in: payload.tagIds.map((id) => BigInt(id)) },
					deletedAt: null,
				},
			};
		}

		// 음악키 조건
		if (payload.musicKey) {
			productWhereConditions.musicKey = payload.musicKey;
		}

		// BPM 조건
		if (payload.minBpm || payload.maxBpm) {
			productWhereConditions.AND = [];
			if (payload.minBpm) {
				productWhereConditions.AND.push({
					OR: [
						{ minBpm: { gte: payload.minBpm } },
						{ AND: [{ minBpm: { lte: payload.minBpm } }, { maxBpm: { gte: payload.minBpm } }] },
					],
				});
			}
			if (payload.maxBpm) {
				productWhereConditions.AND.push({
					OR: [
						{ maxBpm: { lte: payload.maxBpm } },
						{ AND: [{ minBpm: { lte: payload.maxBpm } }, { maxBpm: { gte: payload.maxBpm } }] },
					],
				});
			}
		}

		// 스케일 타입 조건
		if (payload.scaleType) {
			productWhereConditions.scaleType = payload.scaleType;
		}

		// 삭제되지 않은 제품만
		productWhereConditions.deletedAt = null;

		const orderBy: Prisma.ProductLikeOrderByWithRelationInput = {};
		if (payload.sort === "RECENT") {
			orderBy.createdAt = "desc";
		} else if (payload.sort === "NAME") {
			orderBy.product = { productName: "asc" };
		} else if (payload.sort === "POPULAR") {
			orderBy.product = {
				productLike: {
					_count: "desc",
				},
			};
		}

		const where: Prisma.ProductLikeWhereInput = {
			userId: BigInt(userId),
			deletedAt: null,
			product: productWhereConditions,
		};

		const likedProducts = await this.prisma.productLike
			.findMany({
				where,
				select: {
					product: {
						select: {
							id: true,
							productName: true,
							category: true,
							minBpm: true,
							maxBpm: true,
							musicKey: true,
							scaleType: true,
							artistSellerIdToArtist: {
								select: {
									id: true,
									stageName: true,
									profileImageUrl: true,
								},
							},
							createdAt: true,

							productGenre: {
								select: {
									genre: {
										select: {
											id: true,
											name: true,
										},
									},
								},
							},
							productTag: {
								select: {
									tag: {
										select: {
											id: true,
											name: true,
										},
									},
								},
							},
							productLicense: {
								select: {
									licenseId: true,
									price: true,
									license: {
										select: {
											type: true,
										},
									},
								},
							},
						},
					},
					createdAt: true,
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: orderBy,
			})
			.then((data) => this.prisma.serializeBigInt(data));

		const result = [];
		const productIds = likedProducts.map((like) => like.product.id);

		// 파일 정보 일괄 조회
		const productFiles = await this.fileService.findFilesByTargetIds({
			targetIds: productIds,
			targetTable: "product",
		});

		// 파일을 productId별로 그룹화
		const filesByProductId: Record<string, any[]> = {};
		for (const file of productFiles) {
			if (!filesByProductId[file.targetId.toString()]) {
				filesByProductId[file.targetId.toString()] = [];
			}
			filesByProductId[file.targetId.toString()].push(file);
		}

		for (const like of likedProducts) {
			const seller = {
				id: like.product.artistSellerIdToArtist.id,
				stageName: like.product.artistSellerIdToArtist.stageName,
				profileImageUrl: like.product.artistSellerIdToArtist.profileImageUrl,
			};

			const files = filesByProductId[like.product.id.toString()] ?? [];
			const audioFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE);
			const coverImage = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE);

			result.push({
				id: like.product.id,
				productName: like.product.productName,
				category: like.product.category,
				minBpm: like.product.minBpm,
				maxBpm: like.product.maxBpm,
				musicKey: like.product.musicKey,
				scaleType: like.product.scaleType,
				createdAt: like.product.createdAt,
				likedAt: like.createdAt,
				seller,
				genres: like.product.productGenre.map((pg) => pg.genre.name),
				tags: like.product.productTag.map((pt) => pt.tag.name),
				licenseInfo: like.product.productLicense
					.sort((a, b) => a.price - b.price)
					.map((l) => ({
						label: l.license.type,
						price: l.price,
					})),
				audioFile: audioFile
					? {
							id: audioFile.id,
							url: audioFile.url,
							originName: audioFile.originName,
						}
					: null,
				coverImage: coverImage
					? {
							id: coverImage.id,
							url: coverImage.url,
							originName: coverImage.originName,
						}
					: null,
			});
		}

		// 총 개수 조회 (동일한 조건 사용)
		const total = await this.prisma.productLike.count({
			where,
		});

		return {
			data: result,
			pagination: {
				page,
				limit,
				total,
				totalPage: Math.ceil(total / limit),
			},
		};
	}
}
