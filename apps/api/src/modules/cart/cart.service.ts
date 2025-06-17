import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { FileService } from "../file/file.service";
import { CartCreateRequestDto } from "./dto/request/cart.create.request.dto";
import { CartUpdateRequestDto } from "./dto/request/cart.update.request.dto";
import { CartListResponseDto } from "./dto/response/cart.list.response.dto";
import { ENUM_PRODUCT_FILE_TYPE } from "../product/product.enum";
import {
	CART_CREATE_ERROR,
	CART_REMOVE_ERROR,
	CART_FIND_ERROR,
	CART_ITEM_NOT_FOUND_ERROR,
	CART_UPDATE_ERROR,
} from "./cart.error";

@Injectable()
export class CartService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async create(userId: number, cartCreateDto: CartCreateRequestDto) {
		try {
			// 이미 장바구니에 있는지 확인
			const existingItem = await this.prisma.cart
				.findFirst({
					where: {
						userId,
						productId: cartCreateDto.productId,
						deletedAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			if (existingItem) {
				// 기존 항목이 있으면 라이센스만 업데이트 (silent update)
				return await this.prisma.cart
					.update({
						where: { id: existingItem.id },
						data: {
							licenseId: cartCreateDto.licenseId,
							updatedAt: new Date(),
						},
					})
					.then((data) => this.prisma.serializeBigInt(data));
			}

			// 새로운 항목 생성
			return await this.prisma.cart
				.create({
					data: {
						userId,
						productId: cartCreateDto.productId,
						licenseId: cartCreateDto.licenseId,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e: any) {
			if (e?.response) {
				throw new BadRequestException(e.response);
			}
			throw new BadRequestException({
				...CART_CREATE_ERROR,
				detail: e.message,
			});
		}
	}

	async remove(userId: number, cartId: number) {
		try {
			const cartItem = await this.prisma.cart
				.findFirst({
					where: {
						id: cartId,
						userId,
						deletedAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			if (!cartItem) {
				throw new NotFoundException(CART_ITEM_NOT_FOUND_ERROR);
			}

			return await this.prisma.cart
				.update({
					where: { id: cartId },
					data: {
						deletedAt: new Date(),
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e: any) {
			throw new BadRequestException({
				...CART_REMOVE_ERROR,
				detail: e.message,
			});
		}
	}

	async findAll(userId: number): Promise<CartListResponseDto[]> {
		try {
			const cartItems = await this.prisma.cart
				.findMany({
					where: {
						userId,
						deletedAt: null,
					},
					include: {
						product: {
							select: {
								id: true,
								productName: true,
								price: true,
								category: true,
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
							},
						},
						license: true,
					},
					orderBy: { createdAt: "desc" },
				})
				.then((data) => this.prisma.serializeBigInt(data));

			const formattedItems = await Promise.all(cartItems.map((item) => this.formatCartItem(item)));

			return formattedItems;
		} catch (e: any) {
			throw new BadRequestException({
				...CART_FIND_ERROR,
				detail: e.message,
			});
		}
	}

	async update(userId: number, cartId: number, cartUpdateDto: CartUpdateRequestDto) {
		try {
			// 기존 장바구니 아이템 확인
			const cartItem = await this.prisma.cart
				.findFirst({
					where: {
						id: cartId,
						userId,
						deletedAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			if (!cartItem) {
				throw new NotFoundException(CART_ITEM_NOT_FOUND_ERROR);
			}

			// 라이센스 업데이트
			return await this.prisma.cart
				.update({
					where: { id: cartId },
					data: {
						licenseId: cartUpdateDto.licenseId,
						updatedAt: new Date(),
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e: any) {
			if (e?.response) {
				throw new BadRequestException(e.response);
			}
			throw new BadRequestException({
				...CART_UPDATE_ERROR,
				detail: e.message,
			});
		}
	}

	private async formatCartItem(cartItem: any) {
		// 상품 이미지 파일 조회
		const productFiles = await this.fileService.findFilesByTargetIds({
			targetIds: [cartItem.product.id],
			targetTable: "product",
		});

		const coverImage = productFiles.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE);
		const audioFile = productFiles.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE);
		const zipFile = productFiles.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_ZIP_FILE);

		const seller = cartItem.product.artistSellerIdToArtist
			? {
					id: cartItem.product.artistSellerIdToArtist.id,
					stageName: cartItem.product.artistSellerIdToArtist.stageName,
					profileImageUrl: cartItem.product.artistSellerIdToArtist.profileImageUrl,
					isVerified: cartItem.product.artistSellerIdToArtist.isVerified,
				}
			: null;

		return {
			id: cartItem.id,
			userId: cartItem.userId,
			selectedLicense: {
				id: cartItem.license.id,
				type: cartItem.license.type,
				price: cartItem.product.productLicense.find((license) => license.licenseId === cartItem.license.id)?.price,
			},
			product: {
				id: cartItem.product.id,
				productName: cartItem.product.productName,
				price: cartItem.product.price,
				category: cartItem.product.category,
				seller,
				licenseInfo: cartItem.product.productLicense.map((license) => ({
					id: license.licenseId,
					type: license.license.type,
					price: license.price,
				})),
				coverImage: coverImage
					? {
							id: Number(coverImage.id),
							url: coverImage.url,
							originName: coverImage.originName,
						}
					: null,
				audioFile: audioFile
					? {
							id: Number(audioFile.id),
							url: audioFile.url,
							originName: audioFile.originName,
						}
					: null,
				zipFile: zipFile
					? {
							id: Number(zipFile.id),
							url: zipFile.url,
							originName: zipFile.originName,
						}
					: null,
			},
			createdAt: cartItem.createdAt,
			updatedAt: cartItem.updatedAt,
		};
	}
}
