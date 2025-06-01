import { Controller, Get, Patch, Delete, Param, Body, Req, Post, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { UserUpdateDto } from "./dto/request/user.update.request.dto";
import { IResponse } from "src/common/response/interfaces/response.interface";
import userMessage from "./user.message";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { UserFindMeResponseDto } from "./dto/response/user.find-me.response.dto";

@Controller("users")
@ApiTags("user")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("me")
	@ApiOperation({ summary: "내 정보 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
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
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
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
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
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

	// TODO: FIXME: Temporary function
	@ApiOperation({ summary: "[TEMP] 유저 구독 정보 삽입" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(userMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	@Post("/subscribe")
	async insertSubscribe(@Req() req: AuthenticatedRequest): Promise<DatabaseIdResponseDto> {
		const { id } = req.user;

		const user = await this.userService.findMe(id);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		const subscribe = await this.userService.makeSubscribe(id);

		return {
			statusCode: 200,
			message: subscribe.subscribedAt ? userMessage.update.success : userMessage.delete.success,
			data: { id: Number(subscribe.id) },
		};
	}
}
