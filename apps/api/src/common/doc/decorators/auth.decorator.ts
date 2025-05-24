import { applyDecorators } from "@nestjs/common";
import { DocAuth } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "src/modules/auth/decorators/auth.jwt.decorator";
import { UserProtected } from "src/modules/user/decorators/user.decorator";

/**
 * 인증 관련 데코레이터를 한 번에 적용하는 함수
 * @param options 인증 옵션 객체
 * @returns 데코레이터 배열
 */
export function AuthenticationDoc(options: { jwtAccessToken?: boolean } = {}) {
	const decorators = [];

	// 사용자 보호 데코레이터 추가
	decorators.push(UserProtected());

	// JWT 액세스 토큰 보호 데코레이터 추가
	decorators.push(AuthJwtAccessProtected());

	// Swagger 문서에 Bearer 인증 표시
	decorators.push(DocAuth({ jwtAccessToken: true }));

	return applyDecorators(...decorators);
}
