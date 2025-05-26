import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Product } from "@prisma/client";
import { ENUM_PRODUCT_FILE_TYPE } from "./product.enum";
import { ProductUpdateDto } from "./dto/request/product.update.dto";
import { FileService } from "../file/file.service";

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll(): Promise<Product[]> {
		try {
			return await this.prisma.product
				.findMany({
					where: { deletedAt: null },
					orderBy: { createdAt: "desc" },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Product[]);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findOne(id: number): Promise<Product> {
		try {
			const product = await this.prisma.product
				.findFirst({
					where: { id, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Product);

			if (!product) {
				throw new NotFoundException("Product not found");
			}

			return product;
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

	async softDelete(id: number): Promise<Product> {
		try {
			return await this.prisma.product
				.update({
					where: { id },
					data: { deletedAt: new Date() },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Product);
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
}
