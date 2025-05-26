import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Product } from "@prisma/client";
import { ENUM_PRODUCT_FILE_TYPE, ENUM_PRODUCT_SORT } from "./product.enum";
import { ProductUpdateDto } from "./dto/request/product.update.dto";
import { FileService } from "../file/file.service";
import { ProductListQueryRequestDto } from "./dto/request/project.list.request.dto";

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll({ page, limit, type, sort }: ProductListQueryRequestDto) {
		try {
			const products = await this.prisma.product
				.findMany({
					where: { deletedAt: null, ...(type === "null" ? {} : { type }) },
					orderBy: { createdAt: sort === ENUM_PRODUCT_SORT.RECENT ? "desc" : "asc" },
					skip: (page - 1) * limit,
					take: limit,
				})
				.then((data) => this.prisma.serializeBigInt(data));

			return products;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findOne(id: number) {
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
							},
						},
					},
				})
				.then((data) => this.prisma.serializeBigInt(data) as Product);

			const seller = (product as any).artistSellerIdToArtist;
			delete (product as any).artistSellerIdToArtist;

			return {
				...product,
				seller,
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async create(userId: number, createProductDto) {
		const product = await this.prisma.product
			.create({
				data: {
					...createProductDto,
					sellerId: userId,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return product;
	}

	async update(id: number, updateProductDto: ProductUpdateDto) {
		try {
			return await this.prisma.product
				.update({
					where: { id },
					data: updateProductDto,
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (error) {
			throw new BadRequestException(error);
		}
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
		if (fileIds?.audioFileFileId) {
			await this.fileService.updateFileEnabledAndDelete({
				uploaderId,
				newFileId: fileIds.audioFileFileId,
				targetTable: "product",
				targetId: productId,
				type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE,
			});
		}

		if (fileIds?.coverImageFileId) {
			await this.fileService.updateFileEnabledAndDelete({
				uploaderId,
				newFileId: fileIds.coverImageFileId,
				targetTable: "product",
				targetId: productId,
				type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE,
			});
		}

		if (fileIds?.zipFileId) {
			await this.fileService.updateFileEnabledAndDelete({
				uploaderId,
				newFileId: fileIds.zipFileId,
				targetTable: "product",
				targetId: productId,
				type: ENUM_PRODUCT_FILE_TYPE.PRODUCT_ZIP_FILE,
			});
		}
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
					}
				: null,
			coverImage: coverImageFile
				? {
						id: coverImageFile?.id,
						url: coverImageFile?.url,
					}
				: null,
			zipFile: zipFile
				? {
						id: zipFile?.id,
						url: zipFile?.url,
					}
				: null,
		};
	}

	async getTotal({ page, limit, type }: ProductListQueryRequestDto) {
		const total = await this.prisma.product.count({
			where: { deletedAt: null, ...(type === "null" ? {} : { type }) },
		});
		return total;
	}
}
