import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthGoogleLoginResponse } from "@hitbeatclub/shared-types/auth";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { UserService } from "../user/user.service";
import { AuthSocialGoogleProtected } from "./decorators/auth.social.decorator";
import { AuthenticatedRequest } from "./dto/request/auth.dto.request";
import { AuthLoginResponseDto } from "./dto/response/auth.login.response.dto";
import { AuthJwtAccessProtected } from "./decorators/auth.jwt.decorator";
import userMessage from "../user/user.message";
import { UserUpdateDto } from "../user/dto/request/user.update.request.dto";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { AuthLoginDto } from "./dto/request/auth.login.reqeust.dto";
import { USER_INVALID_PASSWORD_ERROR, USER_NOT_FOUND_ERROR } from "../user/user.error";
import { AuthResetPasswordRequestDto } from "./dto/request/auth.reset-password.request.dto";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { AuthFindIdDto } from "./dto/request/auth.find-id.request.dto";
import { AuthFindIdResponseDto } from "./dto/response/auth.find-response.dto";

@ApiTags("auth.public")
@Controller("auth")
@ApiBearerAuth()
export class AuthPublicController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly helperHashService: HelperHashService,
	) {}

	@Post("login")
	@ApiOperation({ summary: "로그인" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@ApiBody({
		type: AuthLoginDto,
	})
	@DocResponse<AuthLoginResponseDto>(userMessage.login.success, {
		dto: AuthLoginResponseDto,
	})
	async login(@Body() userUpdatePayload: AuthLoginDto): Promise<IResponse<AuthLoginResponseDto>> {
		const user = await this.userService.findByEmail(userUpdatePayload.email);

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		const isPasswordValid = this.helperHashService.comparePassword(userUpdatePayload.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException(USER_INVALID_PASSWORD_ERROR);
		}

		const auth = await this.authService.loginOrSignUp(user);
		await this.userService.updateToken(user.id, auth.accessToken, auth.refreshToken);
		await this.userService.updateLastLoginAt(auth.userId);

		return {
			statusCode: 200,
			message: userMessage.login.success,
			data: {
				userId: auth.userId,
				accessToken: auth.accessToken,
				refreshToken: auth.refreshToken,
				email: auth.email,
				phoneNumber: auth.phoneNumber,
			},
		};
	}

	@Post("google")
	@ApiOperation({ summary: "Google login" })
	@DocAuth({ google: true })
	@AuthSocialGoogleProtected()
	@ApiResponse({
		status: 200,
		description: "Google login successful",
		type: AuthLoginResponseDto,
	})
	async loginWithGoogle(@Req() req: AuthenticatedRequest): Promise<IResponse<AuthGoogleLoginResponse>> {
		const user = req.user;

		const auth = await this.authService.loginOrSignUp(user);

		await this.userService.updateToken(auth.userId, auth.accessToken, auth.refreshToken);
		await this.userService.updateLastLoginAt(auth.userId);

		return {
			statusCode: 200,
			message: "success google login",
			data: {
				userId: auth.userId,
				accessToken: auth.accessToken,
				refreshToken: auth.refreshToken,
				email: auth.email,
				phoneNumber: auth.phoneNumber,
			},
		};
	}

	@Post("join")
	@ApiOperation({ summary: "회원가입" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@ApiBody({
		type: UserUpdateDto,
	})
	@DocResponse<DatabaseIdResponseDto>(userMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async join(@Body() userUpdatePayload: UserUpdateDto): Promise<DatabaseIdResponseDto> {
		const { isAgreedTerms, isAgreedPrivacyPolicy, isAgreedEmail } = userUpdatePayload;
		const agreedTermsAt = isAgreedTerms ? new Date() : null;
		const agreedPrivacyPolicyAt = isAgreedPrivacyPolicy ? new Date() : null;
		const agreedEmailAt = isAgreedEmail ? new Date() : null;

		delete userUpdatePayload.isAgreedTerms;
		delete userUpdatePayload.isAgreedPrivacyPolicy;
		delete userUpdatePayload.isAgreedEmail;

		const user = await this.userService.create({
			...userUpdatePayload,
			agreedTermsAt,
			agreedPrivacyPolicyAt,
			agreedEmailAt,
		});

		return {
			statusCode: 200,
			message: userMessage.update.success,
			data: {
				id: Number(user.id),
			},
		};
	}

	@Get("find-email")
	@ApiOperation({ summary: "이메일 찾기" })
	@ApiQuery({
		name: "name",
		type: String,
		required: true,
		description: "이름",
	})
	@ApiQuery({
		name: "phoneNumber",
		type: String,
		required: true,
		description: "연락처",
	})
	@ApiResponse({
		status: 200,
		description: userMessage.findEmail.success,
		type: AuthFindIdResponseDto,
	})
	async findId(@Query() findIdDto: AuthFindIdDto): Promise<IResponse<AuthFindIdResponseDto>> {
		const user = await this.userService.findByNameAndPhoneNumber(findIdDto.name, findIdDto.phoneNumber);

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		return {
			statusCode: 200,
			message: userMessage.findEmail.success,
			data: {
				email: user.email,
			},
		};
	}

	// @Post("change-password")
	// @ApiOperation({ summary: "비밀번호 변경" })
	// @DocAuth({ jwtAccessToken: true })
	// @AuthJwtAccessProtected()
	// @ApiBody({
	// 	type: AuthChangePasswordRequestDto,
	// })
	// @DocResponse<{ success: boolean }>("비밀번호 변경 성공", {})
	// async changePassword(
	// 	@Req() req: AuthenticatedRequest,
	// 	@Body() changePasswordDto: AuthChangePasswordRequestDto,
	// ): Promise<IResponse<{ success: boolean }>> {
	// 	const success = await this.authService.changePassword(
	// 		req.user.id,
	// 		changePasswordDto.currentPassword,
	// 		changePasswordDto.newPassword,
	// 	);

	// 	return {
	// 		statusCode: 200,
	// 		message: "비밀번호가 성공적으로 변경되었습니다.",
	// 		data: { success },
	// 	};
	// }

	@Post("reset-password")
	@ApiOperation({ summary: "비밀번호 재설정" })
	@ApiBody({
		type: AuthResetPasswordRequestDto,
	})
	@DocResponse<{ success: boolean }>("비밀번호 재설정 성공", {})
	async resetPassword(@Body() resetPasswordDto: AuthResetPasswordRequestDto): Promise<IResponse<{ success: boolean }>> {
		const success = await this.authService.resetPassword(
			resetPasswordDto.email,
			resetPasswordDto.salt,
			resetPasswordDto.newPassword,
		);

		return {
			statusCode: 200,
			message: "비밀번호가 성공적으로 재설정되었습니다.",
			data: { success },
		};
	}
}
