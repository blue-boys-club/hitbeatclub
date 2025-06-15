import { applyDecorators, UseGuards } from "@nestjs/common";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IRequestApp } from "~/common/request/interfaces/request.interface";
import { AuthJwtAccessGuard } from "../guards/jwt/auth.jwt.access.guard";
import { AuthJwtRefreshGuard } from "../guards/jwt/auth.jwt.refresh.guard";
import { AuthJwtAccessOptionalGuard } from "../guards/jwt/auth.jwt.access-optional.guard";
import { AuthJwtAccessPayloadDto } from "../dto/request/auth.jwt.access-payload.dto";

export const AuthJwtPayload = createParamDecorator(
	<T = AuthJwtAccessPayloadDto>(data: string, ctx: ExecutionContext): T => {
		const { user } = ctx.switchToHttp().getRequest<IRequestApp & { user: T }>();
		return data ? user[data] : user;
	},
);

// 옵셔널 AuthJwtPayload 데코레이터 (토큰이 없거나 유효하지 않으면 null 반환)
export const AuthJwtPayloadOptional = createParamDecorator(
	<T = AuthJwtAccessPayloadDto>(data: string, ctx: ExecutionContext): T | null => {
		const { user } = ctx.switchToHttp().getRequest<IRequestApp & { user: T }>();
		if (!user) {
			return null;
		}
		return data ? user[data] : user;
	},
);

export const AuthJwtToken = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
	const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
	const { authorization } = headers;
	const authorizations: string[] = authorization?.split(" ") ?? [];

	return authorizations.length >= 2 ? authorizations[1] : undefined;
});

export function AuthJwtAccessProtected(): MethodDecorator {
	return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

// 옵셔널 JWT 액세스 인증 데코레이터 (토큰이 없거나 유효하지 않아도 에러 발생하지 않음)
export function AuthJwtAccessOptional(): MethodDecorator {
	return applyDecorators(UseGuards(AuthJwtAccessOptionalGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
	return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
