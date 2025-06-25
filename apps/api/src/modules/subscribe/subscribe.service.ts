import { CountryCode, getAlpha2ByAlpha3 } from "@hitbeatclub/country-options";
import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artist/artist.service";
import { CouponService } from "../coupon/coupon.service";
import {
	USER_NOT_FOUND_ERROR,
	USER_ALREADY_SUBSCRIBED_ERROR,
	SUBSCRIPTION_NOT_FOUND_ERROR,
	SUBSCRIPTION_PRODUCT_NOT_FOUND_ERROR,
	SUBSCRIPTION_ALREADY_CANCELED_ERROR,
} from "./subscribe.error";
import { ArtistCreateDto } from "../artist/dto/request/artist.create.request.dto";
import { PrismaService } from "~/common/prisma/prisma.service";
import { SubscribeRequestDto } from "./dto/request/subscribe.request.dto";
import { SubscribeCreateResponseDto } from "./dto/response/subscribe.create.response.dto";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { SubscribeRequest } from "@hitbeatclub/shared-types/subscribe";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- vscode doesn't recognize this is a dual package even though it is and can be compiled
import { PortOneClient, Webhook } from "@portone/server-sdk";

/**
 * 구독(멤버십) 관련 서비스
 * 사용자의 멤버십 생성 및 관리를 담당합니다.
 */
@Injectable()
export class SubscribeService {
	private portone: ReturnType<typeof PortOneClient>;
	private readonly logger = new Logger(SubscribeService.name);

	constructor(
		private readonly userService: UserService,
		private readonly artistService: ArtistService,
		private readonly couponService: CouponService,
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
	) {
		const portoneApiKey = this.configService.get<string>("payment.portone.api.key");
		this.portone = PortOneClient({
			secret: portoneApiKey,
		});
	}

	async subscribeMembership(userId: number, subscribeData: SubscribeRequest): Promise<SubscribeCreateResponseDto> {
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
		const subscribeProduct = await this.prisma.subscribeProduct
			.findFirst({
				where: {
					type: subscribeData.subscriptionPlan,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigIntTyped(data));

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

		// 결제 정보 추출
		const { billingKey, type: paymentMethodType } = subscribeData.method;
		if (!billingKey) {
			throw new BadRequestException("Billing key is required.");
		}

		// 1) 선결제 시도
		const paymentId = `subscribe-${randomUUID()}`;
		let pgTxId: string | undefined;
		try {
			const paymentResponse = await this.portone.payment.payWithBillingKey({
				paymentId,
				billingKey,
				orderName: "멤버십 첫 결제",
				customer: {
					id: `hitbeatclub-${userId}`,
					email: user.email,
					name: {
						full: user.name,
					},
					phoneNumber: user.phoneNumber,
					country: getAlpha2ByAlpha3(user.country as CountryCode),
				},
				amount: { total: finalPrice },
				currency: "KRW",
			});

			// Log the raw response for auditing/debugging
			this.logger.log({ paymentId, paymentResponse }, "payWithBillingKey response (initial)");
			pgTxId = (paymentResponse as any)?.pgTxId ?? undefined;
		} catch (err) {
			// 선결제 실패 → 아무것도 저장하지 않고 에러 반환
			throw new BadRequestException({
				code: "INITIAL_PAYMENT_FAILED",
				message: err?.message || "Failed to charge first payment.",
			});
		}

		// 2) DB 기록 (모두 하나의 트랜잭션으로)
		const [subscribeRecord] = await this.prisma.$transaction([
			this.prisma.subscribe.create({
				data: {
					userId,
					subscriptionPlan: subscribeData.subscriptionPlan,
					productType: "MEMBERSHIP",
					price: finalPrice,
					couponId: couponId,
					nextPaymentDate: this.calculateNextPaymentDate(subscribeData.subscriptionPlan),
				},
			}),
		]);

		await this.prisma.$transaction([
			this.prisma.subscribeBilling.create({
				data: {
					subscribeId: subscribeRecord.id,
					billingKey,
					pg: paymentMethodType || "CARD",
					status: "ISSUED",
				},
			}),
			this.prisma.subscribeTransaction.create({
				data: {
					subscribeId: subscribeRecord.id,
					paymentId,
					amount: finalPrice,
					status: "SUCCEEDED",
					attemptedAt: new Date(),
					succeededAt: new Date(),
					pgTxId,
				},
			}),
		]);

		// 쿠폰 사용 처리 (성공 후 증가)
		if (couponId) {
			await this.couponService.useCoupon(BigInt(couponId));
		}

		// 아티스트 생성 (없는 경우에만 새로 생성)
		let artist = await this.artistService.findByUserId(userId);
		if (!artist) {
			const artistData: ArtistCreateDto = { stageName: "" };
			artist = await this.artistService.create(userId, artistData);
		}

		this.logger.log(
			{ subscribeId: subscribeRecord.id, paymentId, amount: finalPrice },
			"Subscription payment succeeded",
		);

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
			.then((data) => this.prisma.serializeBigIntTyped(data));

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

	async attemptPayment(
		subscribeId: bigint | number,
		subscriptionPlan: "MONTH" | "YEAR",
		billingKey: string,
		amount: number,
		paymentMethodType: string,
		isInitial: boolean = false,
	) {
		const paymentId = `subscribe-${randomUUID()}`;
		const transaction = await this.prisma.subscribeTransaction.create({
			data: {
				subscribeId: BigInt(subscribeId),
				paymentId,
				amount,
				status: "INITIATED",
				attemptedAt: new Date(),
			},
		});

		try {
			const paymentResponse = await this.portone.payment.payWithBillingKey({
				paymentId,
				billingKey,
				orderName: isInitial ? "멤버십 첫 결제" : "멤버십 정기 결제",
				customer: { id: String(subscribeId) },
				amount: { total: amount },
				currency: "KRW",
			});

			// Log response
			this.logger.log({ paymentId, paymentResponse }, "payWithBillingKey response (recurring)");

			// update transaction
			await this.prisma.subscribeTransaction.update({
				where: { id: transaction.id },
				data: {
					status: "SUCCEEDED",
					succeededAt: new Date(),
					pgTxId: (paymentResponse as any)?.pgTxId ?? undefined,
				},
			});

			this.logger.log({ subscribeId, paymentId, amount }, "Subscription payment succeeded");

			await this.prisma.subscribe.update({
				where: { id: BigInt(subscribeId) },
				data: {
					nextPaymentDate: this.calculateNextPaymentDate(subscriptionPlan),
				},
			});
		} catch (err) {
			this.logger.error({ subscribeId, paymentId, error: err?.message }, "Subscription payment failed");
			await this.prisma.subscribeTransaction.update({
				where: { id: transaction.id },
				data: {
					status: "FAILED",
					failedAt: new Date(),
					failReason: err?.message?.substring(0, 250) || "Unknown error",
				},
			});
		}
	}

	/**
	 * 정해진 주기마다 호출되어 예정된 결제를 시도합니다.
	 * 분리된 Cron 클래스에서 호출합니다.
	 */
	async runScheduledPayments() {
		const now = new Date();
		// 1) 최종 해지(만료) 처리: 이미 취소된(CANCELED) 구독 중 nextPaymentDate가 경과한 건을 소프트 삭제
		const expiredCanceledSubs = await this.prisma.subscribe
			.findMany({
				where: {
					status: "CANCELED",
					deletedAt: null,
					nextPaymentDate: { lte: now },
				},
			})
			.then((data) => this.prisma.serializeBigIntTyped(data));

		for (const sub of expiredCanceledSubs) {
			await this.prisma.subscribe.update({
				where: { id: sub.id },
				data: { deletedAt: new Date() },
			});
			this.logger.log({ subscribeId: sub.id }, "Subscription finalized and soft-deleted after cancellation period");
		}

		// 2) 예정 결제가 도래한 ACTIVE 구독 결제 시도
		const dueSubscriptions = await this.prisma.subscribe
			.findMany({
				where: {
					deletedAt: null,
					status: "ACTIVE",
					nextPaymentDate: { lte: now },
				},
			})
			.then((data) => this.prisma.serializeBigIntTyped(data));

		for (const sub of dueSubscriptions) {
			const billing = await this.prisma.subscribeBilling
				.findFirst({
					where: { subscribeId: sub.id, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigIntTyped(data));
			if (!billing) continue;
			await this.attemptPayment(sub.id, sub.subscriptionPlan, billing.billingKey, sub.price, billing.pg || "CARD");
		}
	}

	/**
	 * BillingKey.* webhook events 처리
	 */
	async handleBillingKeyWebhook(webhookRaw: any) {
		this.logger.log({ webhookType: webhookRaw.type, timestamp: webhookRaw.timestamp }, "Received BillingKey webhook");

		if (!("data" in webhookRaw) || !("billingKey" in webhookRaw.data)) return;

		const { billingKey } = webhookRaw.data;

		const billing = await this.prisma.subscribeBilling
			.findFirst({ where: { billingKey } })
			.then((data) => this.prisma.serializeBigIntTyped(data));
		if (!billing) return;

		let newStatus: "READY" | "ISSUED" | "FAILED" | "DELETED" | undefined;
		const webhook = webhookRaw as Webhook.Webhook;
		if (webhook.type === "BillingKey.Ready") newStatus = "READY";
		else if (webhook.type === "BillingKey.Issued") newStatus = "ISSUED";
		else if (webhook.type === "BillingKey.Failed") newStatus = "FAILED";
		else if (webhook.type === "BillingKey.Deleted") newStatus = "DELETED";
		else if (webhook.type === "BillingKey.Updated") {
			newStatus = "ISSUED";
		}

		if (webhook.type === "BillingKey.Updated" && "newBillingKey" in webhook.data) {
			// replace key
			await this.prisma.subscribeBilling.update({
				where: { id: billing.id },
				data: {
					billingKey: webhook.data.newBillingKey,
					status: newStatus,
				},
			});
		} else if (newStatus) {
			await this.prisma.subscribeBilling.update({
				where: { id: billing.id },
				data: {
					status: newStatus,
					deletedAt: newStatus === "DELETED" ? new Date() : undefined,
				},
			});
		}
	}

	/**
	 * Payment.* webhook 처리 – SubscribeTransaction 상태 동기화
	 */
	async handlePaymentWebhook(webhookRaw: any) {
		try {
			if (!("data" in webhookRaw) || !("paymentId" in webhookRaw.data)) return;
			const paymentId: string = webhookRaw.data.paymentId;

			const webhook = webhookRaw as Webhook.Webhook;
			const transaction = await this.prisma.subscribeTransaction
				.findFirst({ where: { paymentId } })
				.then((data) => this.prisma.serializeBigIntTyped(data));
			if (!transaction) {
				this.logger.warn({ paymentId }, "Subscription transaction not found in webhook");
				return;
			}

			const payment = await this.portone.payment.getPayment({ paymentId });
			if (!payment) {
				this.logger.warn({ paymentId }, "Payment not found in portone");
				return;
			}

			if (payment.status === "PAID") {
				await this.prisma.subscribeTransaction.update({
					where: { id: transaction.id },
					data: {
						status: "SUCCEEDED",
						succeededAt: new Date(),
					},
				});
				// Update nextPaymentDate if not already
				await this.prisma.subscribe.update({
					where: { id: transaction.subscribeId },
					data: {
						nextPaymentDate: this.calculateNextPaymentDate(
							(await this.prisma.subscribe.findUnique({ where: { id: transaction.subscribeId } }))?.subscriptionPlan ||
								"MONTH",
						),
					},
				});
			} else if (payment.status === "FAILED") {
				await this.prisma.subscribeTransaction.update({
					where: { id: transaction.id },
					data: {
						status: "FAILED",
						failedAt: new Date(),
						failReason: (payment as any)?.failReason ?? undefined,
					},
				});
			} else if (webhook.type === "Transaction.Cancelled") {
				// Transaction was cancelled – mark subscription as cancelled as well
				await this.prisma.subscribeTransaction.update({
					where: { id: transaction.id },
					data: {
						status: "FAILED", // treat cancelled as failed for now
						failedAt: new Date(),
						failReason: "Transaction cancelled",
					},
				});

				// Cancel the related subscription
				await this.prisma.subscribe.update({
					where: { id: transaction.subscribeId },
					data: {
						status: "CANCELED",
						cancelledAt: new Date(),
						deletedAt: new Date(),
					},
				});

				this.logger.log(
					{ webhookType: webhook.type, paymentStatus: payment.status, paymentId, subscribeId: transaction.subscribeId },
					"Subscription cancelled via webhook",
				);
			}

			this.logger.log(
				{ webhookType: webhook.type, paymentStatus: payment.status, paymentId },
				"Subscription payment webhook processed",
			);
		} catch (err) {
			this.logger.error({ err: err?.message }, "handlePaymentWebhook error");
		}
	}

	/** 변경 구독 플랜 */
	async updateSubscriptionPlan(userId: number, newPlan: "MONTH" | "YEAR") {
		const sub = await this.prisma.subscribe.findFirst({ where: { userId, deletedAt: null, status: "ACTIVE" } });
		if (!sub) throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_ERROR);
		if (sub.subscriptionPlan === newPlan) return;
		// price update
		const product = await this.prisma.subscribeProduct.findFirst({ where: { type: newPlan, deletedAt: null } });
		if (!product) throw new BadRequestException(SUBSCRIPTION_PRODUCT_NOT_FOUND_ERROR);
		await this.prisma.subscribe.update({
			where: { id: sub.id },
			data: {
				subscriptionPlan: newPlan,
				price: product.discountPrice || product.price,
				// reset nextPaymentDate relative to now
				nextPaymentDate: this.calculateNextPaymentDate(newPlan),
			},
		});
	}

	/** cancel or reactivate */
	async cancelSubscription(userId: number, cancel = true) {
		const sub = await this.prisma.subscribe.findFirst({ where: { userId, deletedAt: null } });
		if (!sub) throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_ERROR);
		if (cancel && sub.status === "CANCELED") throw new BadRequestException(SUBSCRIPTION_ALREADY_CANCELED_ERROR);
		if (!cancel && sub.status === "ACTIVE") return;
		await this.prisma.subscribe.update({
			where: { id: sub.id },
			data: {
				status: cancel ? "CANCELED" : "ACTIVE",
				cancelledAt: cancel ? new Date() : null,
			},
		});
	}

	/**
	 * 맴버십 종류 조회
	 */
	async getPlans() {
		const plans = await this.prisma.subscribeProduct
			.findMany({
				where: { deletedAt: null },
				select: {
					// id: true,
					type: true,
					discountPrice: true,
					price: true,
					discountRate: true,
				},
			})
			.then((data) => this.prisma.serializeBigIntTyped(data));

		//  map by type
		return plans.reduce((acc, plan) => {
			acc[plan.type] = plan;
			return acc;
		}, {});
	}
}
