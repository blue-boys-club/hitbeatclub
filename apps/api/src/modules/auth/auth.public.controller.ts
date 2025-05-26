import { Controller, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthGoogleLoginResponse, AuthGoogleLoginResponseSchema } from "@hitbeatclub/shared-types/auth";
import { DocAuth } from "src/common/doc/decorators/doc.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { UserService } from "../user/user.service";
import { AuthSocialGoogleProtected } from "./decorators/auth.social.decorator";
import { AuthenticatedRequest } from "./dto/request/auth.dto";
import { AuthLoginResponseDto } from "./dto/response/auth.login.response.dto";

@ApiTags("auth.public")
@Controller("auth")
@ApiBearerAuth()
export class AuthPublicController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

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
			},
		};
	}
}
