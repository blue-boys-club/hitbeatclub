import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Product } from "@prisma/client";
import { ProductCreateRequest } from "@hitbeatclub/shared-types/product";
import { ProductCreateDto } from "./dto/request/product.create.request.dto";

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

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

		console.log("product", product);
		return product;
	}

	async update(id: number, updateProductDto: any): Promise<Product> {
		try {
			return await this.prisma.product
				.update({
					where: { id },
					data: updateProductDto,
				})
				.then((data) => this.prisma.serializeBigInt(data) as Product);
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
}
