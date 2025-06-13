import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { IRequestApp } from "~/common/request/interfaces/request.interface";
import { TokenPayload } from "google-auth-library";
import { AUTH_SOCIAL_GOOGLE_ERROR, AUTH_SOCIAL_KAKAO_ERROR } from "~/modules/auth/auth.error";
import { AuthService } from "~/modules/auth/auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthSocialKakaoGuard implements CanActivate {
	private readonly logger = new Logger(AuthSocialKakaoGuard.name);
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<IRequestApp<TokenPayload>>();
		const { authorization, origin } = request.headers;
		const acArr = authorization?.split("Bearer ") ?? [];

		if (acArr.length !== 2) {
			throw new UnauthorizedException({
				statusCode: AUTH_SOCIAL_KAKAO_ERROR.code,
				message: "Invalid Kakao token",
			});
		}

		const code: string = acArr[1];

		try {
			const tokens = await this.authService.kakaoGetToken({
				code,
				redirectUri: origin,
			});
			if (!tokens.id_token) {
				throw new UnauthorizedException({
					statusCode: AUTH_SOCIAL_KAKAO_ERROR.code,
					message: "Invalid Kakao token",
				});
			}
			const kakaoUserInfo = await this.authService.getKakaoUserInfo(tokens.access_token);
			request.user = { ...kakaoUserInfo, ...tokens } as any;

			return true;
		} catch (e: any) {
			if (e?.response) {
				throw new UnauthorizedException({
					statusCode: AUTH_SOCIAL_KAKAO_ERROR.code,
					message: e.response.data?.message,
				});
			}
			throw new UnauthorizedException({
				statusCode: AUTH_SOCIAL_KAKAO_ERROR.code,
				message: e.message,
			});
		}
	}
}
