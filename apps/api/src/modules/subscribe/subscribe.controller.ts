import { Controller, Post, Req, Body, Patch, Get, Query, UnauthorizedException } from "@nestjs/common";
import { SubscribeService } from "./subscribe.service";
import { ApiOperation, ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import subscribeMessage from "./subscribe.message";
import { DocAuth, DocResponse } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { SubscribeRequestDto } from "./dto/request/subscribe.request.dto";
import { SubscribeCreateResponseDto } from "./dto/response/subscribe.create.response.dto";
import { SubscribePlanUpdateRequestDto } from "./dto/request/subscribe.plan-update.request.dto";
import { SubscribeCancelRequestDto } from "./dto/request/subscribe.cancel.request.dto";
import { SubscribePlansResponseDto } from "./dto/response/subscribe.plans.response.dto";
import { ConfigService } from "@nestjs/config";

@Controller("subscribe")
@ApiTags("subscribe")
@ApiBearerAuth()
export class SubscribeController {
	constructor(
		private readonly subscribeService: SubscribeService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * 멤버십을 구독합니다
	 *
	 * @description 인증된 사용자에게 멤버십을 부여하고, 필요한 경우 아티스트 프로필을 자동으로 생성합니다.
	 * JWT 토큰을 통해 사용자를 인증하며, 비즈니스 로직과 에러 처리는 서비스 레이어에서 담당합니다.
	 *
	 * @param req - 인증된 사용자 정보가 포함된 요청 객체
	 * @param subscribeRequestDto - 구독 요청 정보가 포함된 객체
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
	@DocResponse<SubscribeCreateResponseDto>(subscribeMessage.subscribeMembership.success, {
		dto: SubscribeCreateResponseDto,
	})
	async subscribeMembership(
		@Req() req: AuthenticatedRequest,
		@Body() subscribeRequestDto: SubscribeRequestDto,
	): Promise<IResponse<SubscribeCreateResponseDto>> {
		const result = await this.subscribeService.subscribeMembership(req.user.id, subscribeRequestDto);

		return {
			statusCode: 201,
			message: subscribeMessage.subscribeMembership.success,
			data: result,
		};
	}

	/**
	 * 맴버십 종류 조회
	 */
	@Get("plans")
	@ApiOperation({ summary: "멤버십 플랜 조회" })
	@DocAuth({ jwtAccessToken: true })
	async getPlans(): Promise<IResponse<SubscribePlansResponseDto>> {
		const plans = await this.subscribeService.getPlans();

		return {
			statusCode: 200,
			message: subscribeMessage.plans.success,
			data: plans,
		};
	}

	/**
	 * 멤버십 결제 주기 변경 (월↔연)
	 */
	@Patch("")
	@ApiOperation({ summary: "멤버십 플랜 변경" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	async updatePlan(
		@Req() req: AuthenticatedRequest,
		@Body() body: SubscribePlanUpdateRequestDto,
	): Promise<IResponse<unknown>> {
		await this.subscribeService.updateSubscriptionPlan(req.user.id, body.subscriptionPlan);
		return { statusCode: 200, message: subscribeMessage.planUpdate.success };
	}

	/**
	 * 멤버십 취소 (즉시 / 차회)
	 */
	@Post("cancel")
	@ApiOperation({ summary: "멤버십 취소" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	async cancelSubscription(
		@Req() req: AuthenticatedRequest,
		@Body() body: SubscribeCancelRequestDto,
	): Promise<IResponse<void>> {
		await this.subscribeService.cancelSubscription(req.user.id, body.cancel);
		return {
			statusCode: 200,
			message: body.cancel ? subscribeMessage.cancel.success : subscribeMessage.cancel.undo,
		};
	}

	/**
	 * 스케줄된 멤버십 결제를 수동으로 실행합니다.
	 *
	 * cronSecret 쿼리 파라미터가 설정된 시크릿과 일치해야 합니다.
	 */
	@Post("cron/daily-payments")
	@ApiOperation({ summary: "멤버십 결제 스케줄 수동 실행" })
	async triggerDailyPayments(@Query("secret") secret: string): Promise<IResponse<void>> {
		if (secret !== this.configService.get<string>("app.cronSecret")) {
			throw new UnauthorizedException();
		}

		await this.subscribeService.runScheduledPayments();

		return {
			statusCode: 200,
			message: "trigger subscribe cron succeeded",
		};
	}
}
