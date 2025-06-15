import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthJwtAccessOptionalGuard extends AuthGuard("jwtAccess") {
	handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser | null {
		// 에러가 발생하거나 유저가 없어도 예외를 발생시키지 않고 null을 반환
		if (err || !user) {
			return null;
		}

		return user;
	}
}
