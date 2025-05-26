import { Controller, Get, Post, Patch, Delete, Param, Body, Req } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { productMessage } from "./product.message";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { ProductCreateDto } from "./dto/request/product.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto";

@Controller("product")
@ApiTags("product")
@ApiBearerAuth()
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@ApiOperation({ summary: "상품 목록 조회" })
	async findAll() {
		return this.productService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "상품 상세 조회" })
	async findOne(@Param("id") id: number) {
		return this.productService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "상품 생성" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createProductDto: ProductCreateDto,
	): Promise<IResponse<{ id: number }>> {
		delete createProductDto?.imageFileId;
		delete createProductDto?.audioFileFileId;
		delete createProductDto?.coverImageFileId;
		delete createProductDto?.zipFileId;

		const product = await this.productService.create(req.user.id, createProductDto);

		return {
			statusCode: 201,
			message: productMessage.create.success,
			data: {
				id: product.id,
			},
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "상품 정보 수정" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async update(@Param("id") id: number, @Body() updateProductDto: any): Promise<IResponse<{ id: number }>> {
		const product = await this.productService.update(id, updateProductDto);

		return {
			statusCode: 200,
			message: productMessage.update.success,
			data: {
				id: Number(product.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "상품 삭제" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	async softDelete(@Param("id") id: number): Promise<IResponse<{ id: number }>> {
		await this.productService.softDelete(id);

		return {
			statusCode: 200,
			message: productMessage.delete.success,
			data: {
				id,
			},
		};
	}
}
