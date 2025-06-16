import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import {
	COUPON_NOT_FOUND_ERROR,
	COUPON_ALREADY_USED_ERROR,
	COUPON_EXPIRED_ERROR,
	COUPON_USAGE_LIMIT_EXCEEDED_ERROR,
} from "./coupon.error";

/**
 * 쿠폰 관련 서비스
 * 쿠폰 검증, 사용 처리 등을 담당합니다.
 */
@Injectable()
export class CouponService {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * 쿠폰 유효성 검증
	 */
	async validateCoupon(hitcode: string, userId: number) {
		// 쿠폰 존재 여부 확인
		const coupon = await this.prisma.coupon
			.findFirst({
				where: {
					code: hitcode,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (!coupon) {
			throw new NotFoundException(COUPON_NOT_FOUND_ERROR);
		}

		// 쿠폰 만료 확인
		const now = new Date();
		if (coupon.validUntilAt && coupon.validUntilAt < now) {
			throw new BadRequestException(COUPON_EXPIRED_ERROR);
		}

		if (coupon.validFromAt && coupon.validFromAt > now) {
			throw new BadRequestException(COUPON_EXPIRED_ERROR);
		}

		// 사용 한도 확인
		if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
			throw new BadRequestException(COUPON_USAGE_LIMIT_EXCEEDED_ERROR);
		}

		// 사용자별 중복 사용 확인 (쿠폰 중복 사용 방지)
		const existingUsage = await this.prisma.subscribe.findFirst({
			where: {
				userId: userId,
				couponId: Number(coupon.id),
				deletedAt: null,
			},
		});

		if (existingUsage) {
			throw new BadRequestException(COUPON_ALREADY_USED_ERROR);
		}

		return coupon;
	}

	/**
	 * 쿠폰 사용 처리 (사용 횟수 증가)
	 */
	async useCoupon(couponId: bigint) {
		await this.prisma.coupon.update({
			where: { id: couponId },
			data: {
				usedCount: {
					increment: 1,
				},
			},
		});
	}

	/**
	 * 쿠폰 적용된 가격 계산
	 */
	calculateDiscountedPrice(originalPrice: number, coupon: any): number {
		// 쿠폰 테이블에서 discountPrice와 discountMonth 사용
		// discountPrice: 할인 금액
		// discountMonth: 할인 개월 수 (현재는 가격 할인에 사용)
		return Math.max(0, originalPrice - coupon.discountPrice);
	}
}
