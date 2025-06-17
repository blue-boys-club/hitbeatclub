import { Controller, Get, Post, Delete, Param, Body, Req, ParseIntPipe } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse, DocResponseList } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import cartMessage from "./cart.message";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { CartCreateRequestDto } from "./dto/request/cart.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { CartListResponseDto } from "./dto/response/cart.list.response.dto";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";

@Controller("carts")
@ApiTags("cart")
@ApiBearerAuth()
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	@ApiOperation({ summary: "장바구니 목록 조회" })
	@AuthenticationDoc()
	@DocResponseList<CartListResponseDto>(cartMessage.find.success, {
		dto: CartListResponseDto,
	})
	async findAll(@Req() req: AuthenticatedRequest): Promise<IResponse<CartListResponseDto[]>> {
		const cartItems = await this.cartService.findAll(req.user.id);

		return {
			statusCode: 200,
			message: cartMessage.find.success,
			data: cartItems,
		};
	}

	@Post()
	@ApiOperation({ summary: "장바구니 아이템 추가" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(cartMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() cartCreateDto: CartCreateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const cartItem = await this.cartService.create(req.user.id, cartCreateDto);

		return {
			statusCode: 201,
			message: cartMessage.create.success,
			data: {
				id: Number(cartItem.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "장바구니 아이템 제거" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(cartMessage.remove.success, {
		dto: DatabaseIdResponseDto,
	})
	async remove(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
	): Promise<DatabaseIdResponseDto> {
		await this.cartService.remove(req.user.id, id);

		return {
			statusCode: 200,
			message: cartMessage.remove.success,
			data: {
				id,
			},
		};
	}
}
