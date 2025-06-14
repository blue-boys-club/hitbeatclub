import { Controller, Get, Patch, Delete, Param, Body, Req, Post, NotFoundException, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
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

@Controller("users")
@ApiTags("user")
@ApiBearerAuth()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly productService: ProductService,
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
	@ApiOperation({ summary: "특정 유저 좋아요 상품 조회" })
	@AuthenticationDoc()
	@DocResponsePaging<ProductLikeResponseDto>(userMessage.likedProducts.success, {
		dto: ProductLikeResponseDto,
	})
	async getLikedProducts(
		@Param("userId") userId: number,
		@Query() userLikeProductListRequestDto: UserLikeProductListRequestDto,
	): Promise<IResponsePaging<any>> {
		const result = await this.productService.findLikedProducts(
			userId,
			userLikeProductListRequestDto.page,
			userLikeProductListRequestDto.limit,
			userLikeProductListRequestDto.sort,
			userLikeProductListRequestDto.search,
		);

		return {
			statusCode: 200,
			message: userMessage.likedProducts.success,
			data: result.data,
			_pagination: result.pagination,
		};
	}
}
