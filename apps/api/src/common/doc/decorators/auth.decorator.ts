import { applyDecorators } from "@nestjs/common";
import { DocAuth } from "~/common/doc/decorators/doc.decorator";
import { AuthJwtAccessOptional, AuthJwtAccessProtected } from "~/modules/auth/decorators/auth.jwt.decorator";
import { UserProtected } from "~/modules/user/decorators/user.decorator";

/**
 * 인증 관련 데코레이터 options
 */
interface IAuthenticationDocOptions {
	optional?: boolean;
}

/**
 * 인증 관련 데코레이터를 한 번에 적용하는 함수
 * @param options 인증 옵션 객체
 * @returns 데코레이터 배열
 */
export function AuthenticationDoc(options: IAuthenticationDocOptions = {}) {
	const decorators = [];

	// JWT 액세스 토큰 보호 데코레이터 추가
	if (options.optional) {
		decorators.push(AuthJwtAccessOptional());
	} else {
		// JWT 액세스 토큰 보호 데코레이터 추가
		decorators.push(AuthJwtAccessProtected());

		// 사용자 보호 데코레이터 추가
		decorators.push(UserProtected());
	}

	// Swagger 문서에 Bearer 인증 표시
	decorators.push(DocAuth({ jwtAccessToken: true }));

	return applyDecorators(...decorators);
}
