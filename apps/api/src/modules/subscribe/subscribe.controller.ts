import { Controller, Post, Req } from "@nestjs/common";
import { SubscribeService } from "./subscribe.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import subscribeMessage from "./subscribe.message";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { SubscribeMembershipResponseDto } from "./dto/response/subscribe.subscribe-membership.dto";

/**
 * 구독(멤버십) 관련 컨트롤러
 * 멤버십 구독 엔드포인트를 제공합니다.
 */
@Controller("subscribe")
@ApiTags("subscribe")
@ApiBearerAuth()
export class SubscribeController {
	constructor(private readonly subscribeService: SubscribeService) {}

	/**
	 * 멤버십을 구독합니다
	 *
	 * @description 인증된 사용자에게 멤버십을 부여하고, 필요한 경우 아티스트 프로필을 자동으로 생성합니다.
	 * JWT 토큰을 통해 사용자를 인증하며, 비즈니스 로직과 에러 처리는 서비스 레이어에서 담당합니다.
	 *
	 * @param req - 인증된 사용자 정보가 포함된 요청 객체
	 * @returns 생성된 멤버십 정보와 성공 메시지
	 *
	 * @example
	 * Response:
	 * ```json
	 * {
	 *   "statusCode": 201,
	 *   "message": "멤버십이 구독되었습니다.",
	 *   "data": {
	 *     "userId": 123,
	 *     "subscribedAt": "2024-01-01T00:00:00.000Z",
	 *     "artistId": 456
	 *   }
	 * }
	 * ```
	 */
	@Post()
	@ApiOperation({ summary: "멤버십 구독" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<SubscribeMembershipResponseDto>(subscribeMessage.subscribeMembership.success, {
		dto: SubscribeMembershipResponseDto,
	})
	async subscribeMembership(
		@Req() req: AuthenticatedRequest,
	): Promise<IResponse<{ userId: number; subscribedAt: Date; artistId: number }>> {
		const result = await this.subscribeService.subscribeMembership(req.user.id);

		return {
			statusCode: 201,
			message: subscribeMessage.subscribeMembership.success,
			data: result,
		};
	}
}
