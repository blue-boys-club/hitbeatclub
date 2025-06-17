import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artist/artist.service";
import { CouponService } from "../coupon/coupon.service";
import { USER_NOT_FOUND_ERROR, USER_ALREADY_SUBSCRIBED_ERROR } from "./subscribe.error";
import { ArtistCreateDto } from "../artist/dto/request/artist.create.request.dto";
import { PrismaService } from "~/common/prisma/prisma.service";
import { SubscribeRequestDto } from "./dto/request/subscribe.request.dto";
import { SubscribeCreateResponseDto } from "./dto/response/subscribe.create.response.dto";

/**
 * 구독(멤버십) 관련 서비스
 * 사용자의 멤버십 생성 및 관리를 담당합니다.
 */
@Injectable()
export class SubscribeService {
	constructor(
		private readonly userService: UserService,
		private readonly artistService: ArtistService,
		private readonly couponService: CouponService,
		private readonly prisma: PrismaService,
	) {}

	async subscribeMembership(userId: number, subscribeData: SubscribeRequestDto): Promise<SubscribeCreateResponseDto> {
		// 사용자 존재 확인
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}

		// 이미 구독되어있는지 체크
		const existsSubscription = await this.existsSubscription(userId);
		if (existsSubscription) {
			throw new BadRequestException(USER_ALREADY_SUBSCRIBED_ERROR);
		}

		// 구독 상품 정보 조회
		const subscribeProduct = await this.prisma.subscribeProduct.findFirst({
			where: {
				type: subscribeData.subscriptionPlan,
				deletedAt: null,
			},
		});

		if (!subscribeProduct) {
			throw new BadRequestException("해당 구독 상품을 찾을 수 없습니다.");
		}

		const finalPrice = subscribeProduct.discountPrice || subscribeProduct.price;
		let couponId: number | null = null;

		// 쿠폰 코드가 있는 경우 쿠폰 검증 및 할인 적용
		if (subscribeData?.hitcode) {
			const validatedCoupon = await this.couponService.validateCoupon(subscribeData.hitcode, userId);
			// TODO: 쿠폰 할인 적용
			// finalPrice = this.couponService.calculateDiscountedPrice(finalPrice, validatedCoupon);
			couponId = Number(validatedCoupon.id);
		}

		// Subscribe 테이블에 구독 정보 생성
		const subscribeRecord = await this.prisma.subscribe.create({
			data: {
				userId: userId,
				subscriptionPlan: subscribeData.subscriptionPlan,
				productType: "MEMBERSHIP",
				price: finalPrice,
				couponId: couponId,
				nextPaymentDate: this.calculateNextPaymentDate(subscribeData.subscriptionPlan),
			},
		});

		// 쿠폰 사용 처리 (사용 횟수 증가)
		if (couponId) {
			await this.couponService.useCoupon(BigInt(couponId));
		}

		// 아티스트 생성 (없는 경우에만 새로 생성)
		let artist = await this.artistService.findByUserId(userId);
		if (!artist) {
			const artistData: ArtistCreateDto = { stageName: "" };
			artist = await this.artistService.create(userId, artistData);
		}

		return {
			userId,
			createdAt: subscribeRecord.createdAt,
			nextPaymentDate: subscribeRecord.nextPaymentDate,
			artistId: Number(artist.id),
		};
	}

	async existsSubscription(userId: number) {
		const subscribe = await this.prisma.subscribe
			.findFirst({
				where: {
					userId: userId,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return subscribe;
	}

	private calculateNextPaymentDate(subscriptionPlan: string): Date {
		const now = new Date();
		if (subscriptionPlan === "MONTH") {
			return new Date(now.setMonth(now.getMonth() + 1));
		} else if (subscriptionPlan === "YEAR") {
			return new Date(now.setFullYear(now.getFullYear() + 1));
		}
		return now;
	}
}
