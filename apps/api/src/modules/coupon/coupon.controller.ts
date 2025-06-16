import { Controller, Post, Body, Req } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import couponMessage from "./coupon.message";
import { DocAuth, DocResponse } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { CouponValidateRequestDto } from "./dto/request/coupon.request.dto";
import { CouponValidateResponseDto } from "./dto/response/coupon.response.dto";

@Controller("coupon")
@ApiTags("coupon")
@ApiBearerAuth()
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	/**
	 * 쿠폰 코드 유효성 검증
	 *
	 * @description 쿠폰 코드의 유효성을 검증합니다.
	 * 쿠폰의 존재 여부, 만료 여부, 사용 한도, 사용자별 중복 사용 여부를 확인합니다.
	 *
	 * @param req - 인증된 사용자 정보가 포함된 요청 객체
	 * @param couponValidateRequestDto - 쿠폰 검증 요청 정보
	 * @returns 검증된 쿠폰 정보
	 *
	 * @example
	 * Request:
	 * ```json
	 * {
	 *   "code": "SUMMER2024"
	 * }
	 * ```
	 *
	 * Response:
	 * ```json
	 * {
	 *   "statusCode": 200,
	 *   "message": "쿠폰이 유효합니다.",
	 *   "data": {
	 *     "id": "1",
	 *     "code": "SUMMER2024",
	 *     "name": "여름 할인 쿠폰",
	 *     "discountType": "PERCENT",
	 *     "discountValue": 20,
	 *     "validFromAt": "2024-06-01T00:00:00.000Z",
	 *     "validUntilAt": "2024-08-31T23:59:59.000Z",
	 *     "usageLimit": 100,
	 *     "usedCount": 25,
	 *     "isActive": true
	 *   }
	 * }
	 * ```
	 */
	@Post("validate")
	@ApiOperation({ summary: "쿠폰 코드 유효성 검증" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<CouponValidateResponseDto>(couponMessage.validateCoupon.success, {
		dto: CouponValidateResponseDto,
	})
	async validateCoupon(
		@Req() req: AuthenticatedRequest,
		@Body() couponValidateRequestDto: CouponValidateRequestDto,
	): Promise<IResponse<CouponValidateResponseDto>> {
		const coupon = await this.couponService.validateCoupon(couponValidateRequestDto.code, req.user.id);

		return {
			statusCode: 200,
			message: couponMessage.validateCoupon.success,
			data: coupon,
		};
	}
}
