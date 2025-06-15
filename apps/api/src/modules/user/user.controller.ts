import { Controller, Get, Patch, Delete, Param, Body, Req, Post, NotFoundException, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse, DocResponseList, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { UserUpdateDto } from "./dto/request/user.update.request.dto";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";
import userMessage from "./user.message";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { UserFindMeResponseDto } from "./dto/response/user.find-me.response.dto";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { ProductService } from "../product/product.service";
import { ProductLikeResponseDto } from "../product/dto/response/product.like.response.dto";
import { UserLikeProductListRequestDto } from "./dto/request/user.like-product-list.request.dto";
import { CartListResponseDto } from "../cart/dto/response/cart.list.response.dto";
import { CartService } from "../cart/cart.service";
import cartMessage from "../cart/cart.message";
import { CartCreateRequestDto } from "../cart/dto/request/cart.create.request.dto";

@Controller("users")
@ApiTags("user")
@ApiBearerAuth()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly productService: ProductService,
		private readonly cartService: CartService,
	) {}

	@Get("me")
	@ApiOperation({ summary: "내 정보 조회" })
	@AuthenticationDoc()
	@DocResponse<UserFindMeResponseDto>(userMessage.find.success, {
		dto: UserFindMeResponseDto,
	})
	async getMe(@Req() req: AuthenticatedRequest): Promise<IResponse<UserFindMeResponseDto>> {
		const user = await this.userService.findMe(req.user.id);

		return {
			statusCode: 200,
			message: userMessage.find.success,
			data: user,
		};
	}

	@Patch(":id/social-join")
	@ApiOperation({ summary: "소셜 사용자 회원가입" })
	@AuthenticationDoc()
	@ApiBody({
		type: UserUpdateDto,
	})
	@DocResponse<DatabaseIdResponseDto>(userMessage.joinSocial.success, {
		dto: DatabaseIdResponseDto,
	})
	async joinSocial(@Param("id") id: number, @Body() userUpdatePayload: UserUpdateDto): Promise<DatabaseIdResponseDto> {
		const { isAgreedTerms, isAgreedPrivacyPolicy, isAgreedEmail } = userUpdatePayload;
		const agreedTermsAt = isAgreedTerms ? new Date() : null;
		const agreedPrivacyPolicyAt = isAgreedPrivacyPolicy ? new Date() : null;
		const agreedEmailAt = isAgreedEmail ? new Date() : null;

		delete userUpdatePayload.isAgreedTerms;
		delete userUpdatePayload.isAgreedPrivacyPolicy;
		delete userUpdatePayload.isAgreedEmail;

		const user = await this.userService.update(id, {
			...userUpdatePayload,
			agreedTermsAt,
			agreedPrivacyPolicyAt,
			agreedEmailAt,
		});

		return {
			statusCode: 200,
			message: userMessage.joinSocial.success,
			data: {
				id: Number(user.id),
			},
		};
	}

	@ApiOperation({ summary: "회원 탈퇴" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(userMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	@Delete(":id")
	async softDelete(@Param("id") id: number): Promise<DatabaseIdResponseDto> {
		await this.userService.softDelete(id);

		return {
			statusCode: 200,
			message: userMessage.delete.success,
			data: {
				id,
			},
		};
	}

	@Get(":userId/liked-products")
	@ApiOperation({ summary: "유저 좋아요 상품 조회" })
	@AuthenticationDoc()
	@DocResponsePaging<ProductLikeResponseDto>(userMessage.likedProducts.success, {
		dto: ProductLikeResponseDto,
	})
	async getLikedProducts(
		@Param("userId") userId: number,
		@Query() userLikeProductListRequestDto: UserLikeProductListRequestDto,
	): Promise<IResponsePaging<any>> {
		const result = await this.productService.findLikedProducts(userId, userLikeProductListRequestDto);

		return {
			statusCode: 200,
			message: userMessage.likedProducts.success,
			data: result.data,
			_pagination: result.pagination,
		};
	}

	@Get(":userId/cart")
	@ApiOperation({ summary: "장바구니 조회" })
	@AuthenticationDoc()
	@DocResponseList<CartListResponseDto>(cartMessage.find.success, {
		dto: CartListResponseDto,
	})
	async findCart(@Param("userId") userId: number): Promise<IResponse<CartListResponseDto[]>> {
		const result = await this.cartService.findAll(userId);

		return {
			statusCode: 200,
			message: cartMessage.find.success,
			data: result,
		};
	}

	@Post(":userId/cart")
	@ApiOperation({ summary: "장바구니 추가" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(cartMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async createCart(
		@Req() req: AuthenticatedRequest,
		@Body() cartCreateRequestDto: CartCreateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const result = await this.cartService.create(req.user.id, cartCreateRequestDto);

		return {
			statusCode: 200,
			message: cartMessage.create.success,
			data: { id: result.id },
		};
	}

	@Delete(":userId/cart/:cartId")
	@ApiOperation({ summary: "장바구니 삭제" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(cartMessage.remove.success, {
		dto: DatabaseIdResponseDto,
	})
	async removeCart(
		@Req() req: AuthenticatedRequest,
		@Param("userId") userId: number,
		@Param("cartId") cartId: number,
	): Promise<DatabaseIdResponseDto> {
		const cart = await this.cartService.remove(userId, cartId);

		return {
			statusCode: 200,
			message: cartMessage.remove.success,
			data: { id: cart.id },
		};
	}
}
