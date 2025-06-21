import {
	Controller,
	Get,
	Patch,
	Delete,
	Param,
	Body,
	Req,
	Post,
	NotFoundException,
	Query,
	BadRequestException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags, ApiBody, ApiQuery } from "@nestjs/swagger";
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
import { UserFollowArtistListResponseDto } from "./dto/response/user.follow-artist-list.response.dto";
import { UserFollowArtistListRequestDto } from "./dto/request/user.follow-artist-list.request.dto";
import { UserFollowArtistResponseDto } from "./dto/response/user.follow-artist.response.dto";
import { CartUpdateRequestDto } from "../cart/dto/request/cart.update.request.dto";
import { UserProfileUpdateDto } from "./dto/request/user.profile-update.request.dto";
import { UserDeleteDto } from "./dto/request/user.delete.request.dto";
import { UserPasswordResetDto } from "./dto/request/user.password-reset.request.dto";
import { USER_RESET_PASSWORD_ID_MISMATCH_ERROR } from "./user.error";

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
	async softDelete(@Param("id") id: number, @Body() userDeletePayload: UserDeleteDto): Promise<DatabaseIdResponseDto> {
		const user = await this.userService.softDelete(id, userDeletePayload);

		return {
			statusCode: 200,
			message: userMessage.delete.success,
			data: {
				id: user.id,
			},
		};
	}

	@Patch(":id/password")
	@ApiOperation({ summary: "비밀번호 재설정" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(userMessage.resetPassword.success, {
		dto: DatabaseIdResponseDto,
	})
	async resetPassword(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Body() userPasswordResetDto: UserPasswordResetDto,
	): Promise<DatabaseIdResponseDto> {
		if (Number(id) !== req.user.id) {
			throw new BadRequestException(USER_RESET_PASSWORD_ID_MISMATCH_ERROR);
		}

		const user = await this.userService.resetPassword(id, userPasswordResetDto);

		return {
			statusCode: 200,
			message: userMessage.resetPassword.success,
			data: { id: user.id },
		};
	}

	@Get(":userId/liked-products")
	@ApiOperation({ summary: "좋아요 상품 조회" })
	@AuthenticationDoc()
	@DocResponsePaging<ProductLikeResponseDto>(userMessage.likedProducts.success, {
		dto: ProductLikeResponseDto,
	})
	async findLikedProducts(
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
		@Param("userId") userId: number,
		@Body() cartCreateRequestDto: CartCreateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const result = await this.cartService.create(userId, cartCreateRequestDto);

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

	@Patch(":userId/cart/:cartId")
	@ApiOperation({ summary: "장바구니 수정" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(cartMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async updateCart(
		@Param("userId") userId: number,
		@Param("cartId") cartId: number,
		@Body() cartUpdateRequestDto: CartUpdateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const result = await this.cartService.update(userId, cartId, cartUpdateRequestDto);

		return {
			statusCode: 200,
			message: cartMessage.update.success,
			data: { id: result.id },
		};
	}

	@Get(":userId/followed-artists")
	@ApiOperation({ summary: "팔로우한 아티스트 목록 조회" })
	@AuthenticationDoc()
	@ApiQuery({
		name: "sort",
		required: false,
		enum: ["RECENT", "POPULAR", "NAME"],
		description: "정렬 방식 (기본값: RECENT)",
		example: "RECENT",
	})
	@ApiQuery({
		name: "search",
		required: false,
		type: String,
		description: "아티스트 이름 검색",
		example: "아티스트명",
	})
	@DocResponsePaging<UserFollowArtistListResponseDto>(userMessage.followedArtists.success, {
		dto: UserFollowArtistListResponseDto,
	})
	async findFollowedArtists(
		@Param("userId") userId: number,
		@Query() query: UserFollowArtistListRequestDto,
	): Promise<IResponsePaging<UserFollowArtistListResponseDto>> {
		const result = await this.userService.findFollowedArtists(userId, query);

		return {
			statusCode: 200,
			message: userMessage.followedArtists.success,
			data: result.data,
			_pagination: result.pagination,
		};
	}

	@Post(":userId/followed-artists/:artistId")
	@ApiOperation({ summary: "아티스트 팔로우" })
	@AuthenticationDoc()
	@DocResponse<UserFollowArtistResponseDto>(userMessage.followArtist.success, {
		dto: UserFollowArtistResponseDto,
	})
	async followArtist(
		@Req() req: AuthenticatedRequest,
		@Param("userId") userId: number,
		@Param("artistId") artistId: number,
	): Promise<IResponse<UserFollowArtistResponseDto>> {
		const result = await this.userService.followArtist(userId, artistId);

		return {
			statusCode: 200,
			message: userMessage.followArtist.success,
			data: result,
		};
	}

	@Delete(":userId/followed-artists/:artistId")
	@ApiOperation({ summary: "아티스트 언팔로우" })
	@AuthenticationDoc()
	@DocResponse<UserFollowArtistResponseDto>(userMessage.unfollowArtist.success, {
		dto: UserFollowArtistResponseDto,
	})
	async unfollowArtist(
		@Req() req: AuthenticatedRequest,
		@Param("userId") userId: number,
		@Param("artistId") artistId: number,
	): Promise<IResponse<UserFollowArtistResponseDto>> {
		const result = await this.userService.unfollowArtist(userId, artistId);

		return {
			statusCode: 200,
			message: userMessage.unfollowArtist.success,
			data: result,
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "사용자 프로필 수정" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(userMessage.updateProfile.success, {
		dto: DatabaseIdResponseDto,
	})
	async updateProfile(
		@Param("id") id: number,
		@Body() userProfileUpdateDto: UserProfileUpdateDto,
	): Promise<DatabaseIdResponseDto> {
		const { isAgreedEmail } = userProfileUpdateDto;
		const oldUser = await this.userService.findMe(id);

		let agreedEmailAt: Date | null;

		if (isAgreedEmail === undefined) {
			// undefined이면 기존값 유지
			agreedEmailAt = oldUser.agreedEmailAt;
		} else if (isAgreedEmail) {
			// 동의(true)인 경우: 기존에 동의가 있으면 기존 시간 유지, 없으면 새로 생성
			agreedEmailAt = oldUser.agreedEmailAt ? oldUser.agreedEmailAt : new Date();
		} else {
			// 동의 안함(false)인 경우: null 설정
			agreedEmailAt = null;
		}

		delete userProfileUpdateDto.isAgreedEmail;

		const user = await this.userService.updateProfile(id, {
			...userProfileUpdateDto,
			agreedEmailAt,
		});

		return {
			statusCode: 200,
			message: userMessage.updateProfile.success,
			data: {
				id: user.id,
			},
		};
	}
}
