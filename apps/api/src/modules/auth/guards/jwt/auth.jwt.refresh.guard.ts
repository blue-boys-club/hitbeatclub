import { AuthGuard } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_JWT_REFRESH_TOKEN_ERROR } from "~/modules/auth/auth.error";

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard("jwtRefresh") {
	handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
		if (err || !user) {
			throw new UnauthorizedException({
				...AUTH_JWT_REFRESH_TOKEN_ERROR,
				_error: err ? err.message : info.message,
			});
		}

		return user;
	}
}
