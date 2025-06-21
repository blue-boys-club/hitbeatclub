import { Body, Controller, Get, NotFoundException, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { DocAuth, DocResponse } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { UserService } from "../user/user.service";
import {
	AuthSocialGoogleProtected,
	AuthSocialKakaoProtected,
	AuthSocialNaverProtected,
} from "./decorators/auth.social.decorator";
import { AuthenticatedRequest } from "./dto/request/auth.dto.request";
import { AuthLoginResponseDto } from "./dto/response/auth.login.response.dto";
import userMessage from "../user/user.message";
import { UserUpdateDto } from "../user/dto/request/user.update.request.dto";
import { AuthLoginDto } from "./dto/request/auth.login.reqeust.dto";
import { USER_INVALID_PASSWORD_ERROR, USER_NOT_FOUND_ERROR } from "../user/user.error";
import { AuthResetPasswordRequestDto } from "./dto/request/auth.reset-password.request.dto";
import { HelperHashService } from "~/common/helper/services/helper.hash.service";
import { AuthFindIdDto } from "./dto/request/auth.find-id.request.dto";
import { AuthFindIdResponseDto } from "./dto/response/auth.find-response.dto";
import { AuthCheckEmailResponseDto } from "./dto/response/auth.check-email.response.dto";
import { AuthCheckEmailRequestDto } from "./dto/request/auth.check-email.request.dto";
import { CreateAccessTokenDto } from "./dto/request/auth.create-token.dto.request";
import { AccountTokenService } from "../account-token/account-token.service";
import { AuthVerifyEmailRequestDto } from "./dto/request/auth.verify-token.request.dto";
import { TokenPurpose } from "@prisma/client";

@ApiTags("auth.public")
@Controller("auth")
@ApiBearerAuth()
export class AuthPublicController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly helperHashService: HelperHashService,
		private readonly accountTokenService: AccountTokenService,
	) {}

	@Post("login")
	@ApiOperation({ summary: "로그인" })
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
	async loginWithGoogle(@Req() req: AuthenticatedRequest): Promise<IResponse<AuthLoginResponseDto>> {
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

	@Post("kakao")
	@ApiOperation({ summary: "kakao login" })
	@DocAuth({ kakao: true })
	@AuthSocialKakaoProtected()
	@ApiResponse({
		status: 200,
		description: "Kakao login successful",
		type: AuthLoginResponseDto,
	})
	async loginWithKakao(@Req() req: AuthenticatedRequest): Promise<IResponse<AuthLoginResponseDto>> {
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

	@Post("naver")
	@ApiOperation({ summary: "naver login" })
	@DocAuth({ naver: true })
	@AuthSocialNaverProtected()
	@ApiResponse({
		status: 200,
		description: "Naver login successful",
		type: AuthLoginResponseDto,
	})
	async loginWithNaver(@Req() req: AuthenticatedRequest): Promise<IResponse<AuthLoginResponseDto>> {
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
	@ApiBody({
		type: UserUpdateDto,
	})
	@DocResponse<AuthLoginResponseDto>(userMessage.update.success, {
		dto: AuthLoginResponseDto,
	})
	async join(@Body() userUpdatePayload: UserUpdateDto): Promise<IResponse<AuthLoginResponseDto>> {
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

		const { accessToken, refreshToken } = this.authService.createToken({
			email: user.email,
			id: user.id,
		});

		await this.userService.updateToken(user.id, accessToken, refreshToken);
		await this.userService.updateLastLoginAt(user.id);

		return {
			statusCode: 200,
			message: userMessage.update.success,
			data: {
				userId: user.id,
				accessToken,
				refreshToken,
				email: user.email,
				phoneNumber: user.phoneNumber,
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

	// 이메일 중복 확인
	@Get("check-email")
	@ApiOperation({ summary: "이메일 중복 확인" })
	@ApiQuery({
		name: "email",
		type: String,
		required: true,
		description: "이메일",
	})
	@ApiResponse({
		status: 200,
		description: userMessage.checkEmail.success,
		type: AuthCheckEmailResponseDto,
	})
	async checkEmail(@Query() checkEmailDto: AuthCheckEmailRequestDto): Promise<IResponse<AuthCheckEmailResponseDto>> {
		const user = await this.userService.findByEmail(checkEmailDto.email);

		return {
			statusCode: 200,
			message: userMessage.checkEmail.success,
			data: { success: user ? false : true },
		};
	}

	@Post("access-token")
	@ApiOperation({ summary: "Access token 발급" })
	async createAccessToken(
		@Body() createAccessTokenDto: CreateAccessTokenDto,
	): Promise<IResponse<{ id: number; accessToken: string; refreshToken: string }>> {
		const user = await this.userService.findByEmail(createAccessTokenDto.email);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		const { accessToken, refreshToken } = this.authService.createToken({
			email: user.email,
			id: user.id,
		});

		return {
			statusCode: 200,
			message: "success create access token",
			data: {
				id: user.id,
				accessToken,
				refreshToken,
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

	// @Post("verify-token")
	// @ApiOperation({ summary: "토큰 검증 (범용)" })
	// @ApiBody({ type: AuthVerifyTokenRequestDto })
	// @DocResponse<{ success: boolean }>("토큰 검증 성공", {})
	// async verifyToken(@Body() verifyTokenDto: AuthVerifyTokenRequestDto): Promise<IResponse<{ success: boolean }>> {
	// 	try {
	// 		// 토큰 검증 및 소모 (목적과 이메일 모두 검증)
	// 		const tokenData = await this.accountTokenService.consumeTokenByPurpose(
	// 			verifyTokenDto.token,
	// 			verifyTokenDto.purpose,
	// 			verifyTokenDto.email,
	// 		);

	// 		return {
	// 			statusCode: 200,
	// 			message: "토큰이 성공적으로 검증되었습니다.",
	// 			data: { success: true },
	// 		};
	// 	} catch (error) {
	// 		throw new UnauthorizedException("유효하지 않거나 만료된 토큰입니다.");
	// 	}
	// }

	@Post("reset-password")
	@ApiOperation({ summary: "비밀번호 재설정" })
	@ApiBody({ type: AuthResetPasswordRequestDto })
	@DocResponse<{ success: boolean }>("비밀번호 재설정 성공", {})
	async resetPassword(@Body() resetPasswordDto: AuthResetPasswordRequestDto): Promise<IResponse<{ success: boolean }>> {
		try {
			// 비밀번호 확인 검증은 Zod 스키마에서 이미 처리됨 (newPassword === confirmPassword)

			// 토큰 검증 및 소모 (PASSWORD_RESET 목적의 토큰만 허용)
			const tokenData = await this.accountTokenService.consumeTokenByPurpose(
				resetPasswordDto.token,
				TokenPurpose.PASSWORD_RESET,
				resetPasswordDto.email,
			);

			// 새 비밀번호 해시화
			const hashedPassword = this.helperHashService.hashPassword(resetPasswordDto.newPassword);

			// 비밀번호 업데이트
			await this.userService.updatePassword(Number(tokenData.user.id), hashedPassword);

			return {
				statusCode: 200,
				message: "비밀번호가 성공적으로 재설정되었습니다.",
				data: { success: true },
			};
		} catch (error) {
			throw new UnauthorizedException("유효하지 않거나 만료된 토큰입니다.");
		}
	}

	@Post("verify-email")
	@ApiOperation({ summary: "이메일 인증 토큰 검증" })
	@ApiBody({ type: AuthVerifyEmailRequestDto })
	@DocResponse<{ success: boolean }>("이메일 인증 성공", {})
	async verifyEmail(@Body() verifyEmailDto: AuthVerifyEmailRequestDto): Promise<IResponse<{ success: boolean }>> {
		try {
			// 토큰 검증 및 소모 (EMAIL_VERIFICATION 목적의 토큰만 허용)
			const tokenData = await this.accountTokenService.consumeTokenByPurpose(
				verifyEmailDto.token,
				TokenPurpose.EMAIL_VERIFICATION,
				verifyEmailDto.email,
			);

			// 이메일 인증 완료 처리 (필요한 경우 사용자 상태 업데이트)
			// await this.userService.markEmailAsVerified(Number(tokenData.user.id));

			return {
				statusCode: 200,
				message: "이메일이 성공적으로 인증되었습니다.",
				data: { success: true },
			};
		} catch (error) {
			throw new UnauthorizedException("유효하지 않거나 만료된 토큰입니다.");
		}
	}
}
