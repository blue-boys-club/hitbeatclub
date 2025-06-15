import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { IRequestApp } from "~/common/request/interfaces/request.interface";
import { TokenPayload } from "google-auth-library";
import { AUTH_SOCIAL_NAVER_ERROR } from "~/modules/auth/auth.error";
import { AuthService } from "~/modules/auth/auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthSocialNaverGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<IRequestApp<TokenPayload>>();
		const { authorization } = request.headers;
		const acArr = authorization?.split("Bearer ") ?? [];

		if (acArr.length !== 2) {
			throw new UnauthorizedException({
				statusCode: AUTH_SOCIAL_NAVER_ERROR.code,
				message: "Invalid Naver token",
			});
		}

		const code: string = acArr[1];

		try {
			const tokens = await this.authService.getNaverToken(code);
			if (!tokens.access_token) {
				throw new UnauthorizedException({
					statusCode: AUTH_SOCIAL_NAVER_ERROR.code,
					message: "Invalid Naver token",
				});
			}
			const naverUserInfo = await this.authService.getNaverUserInfo(tokens.access_token);
			request.user = { ...naverUserInfo, ...tokens } as any;

			return true;
		} catch (e: any) {
			if (e?.response) {
				throw new UnauthorizedException({
					statusCode: AUTH_SOCIAL_NAVER_ERROR.code,
					message: e.response.data?.message,
				});
			}
			throw new UnauthorizedException({
				statusCode: AUTH_SOCIAL_NAVER_ERROR.code,
				message: e.message,
			});
		}
	}
}
