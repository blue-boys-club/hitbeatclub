import {
	Injectable,
	BadRequestException,
	NotFoundException,
	Logger,
	ForbiddenException,
	UnauthorizedException,
} from "@nestjs/common";
import {
	PAYMENT_FORBIDDEN_ERROR,
	PAYMENT_INVALID_REQUEST_ERROR,
	PAYMENT_UNAUTHORIZED_ERROR,
	WEBHOOK_VERIFICATION_ERROR,
} from "./payment.error";
import { PrismaService } from "~/common/prisma/prisma.service";
import { CartService } from "../cart/cart.service";
import { PaymentOrderCreateRequestDto } from "./dto/request/payment.order.create.request.dto";
import { PaymentCompleteRequestDto } from "./dto/request/payment.complete.request.dto";
import { PaymentOrderCreateResponseDto } from "./dto/response/payment.order-create.response.dto";
import { PaymentOrderResponseDto } from "./dto/response/payment.order.response.dto";
import { PaymentCompletionResponseDto } from "./dto/response/payment.completion.response.dto";
import {
	PAYMENT_VALIDATION_ERROR,
	PAYMENT_ORDER_CREATE_ERROR,
	PAYMENT_COMPLETE_ERROR,
	PAYMENT_NOT_FOUND_ERROR,
	INVALID_PAYMENT_AMOUNT_ERROR,
	CART_EMPTY_ERROR,
} from "./payment.error";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- vscode doesn't recognize this is a dual package even though it is and can be compiled
import { PortOneClient, Payment } from "@portone/server-sdk";
import { PAYMENT_PORTONE_API_KEY } from "./payment.constant";
import z from "zod";
import { type OrderStatus } from "@hitbeatclub/shared-types/payment";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { FileService } from "~/modules/file/file.service";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- vscode doesn't recognize this is a dual package even though it is and can be compiled
import { Webhook } from "@portone/server-sdk";
import { PortOneWebhook, isPaymentWebhook } from "./payment.utils";
import { ConfigService } from "@nestjs/config";

// CartService.findAll()이 실제로 반환하는 타입 정의
interface CartItemWithProduct {
	id: bigint;
	userId: bigint;
	selectedLicense: {
		id: bigint;
		type: string;
		price: number;
	};
	product: {
		id: bigint;
		productName: string;
		price: number;
		category: string;
		seller?: {
			id: bigint;
			stageName: string;
			profileImageUrl: string;
			isVerified: boolean;
		} | null;
		licenseInfo: Array<{
			id: bigint;
			type: string;
			price: number;
		}>;
		coverImage?: {
			id: number;
			url: string;
			originName: string;
		} | null;
		audioFile?: {
			id: bigint;
			url: string;
			originName: string;
		} | null;
		zipFile?: {
			id: bigint;
			url: string;
			originName: string;
		} | null;
	};
	createdAt: Date;
	updatedAt: Date;
}

@Injectable()
export class PaymentService {
	private readonly logger = new Logger(PaymentService.name);
	private portone: PortOneClient;
	private portoneWebhookSecret: string;

	constructor(
		private readonly prisma: PrismaService,
		private readonly cartService: CartService,
		private readonly fileService: FileService,
		private readonly configService: ConfigService,
	) {
		this.portoneWebhookSecret = this.configService.get<string>("payment.portone.webhook.secret");

		const portoneApiKey = this.configService.get<string>("payment.portone.api.key");
		this.portone = PortOneClient({
			secret: portoneApiKey,
		});
	}

	/**
	 * 결제 주문을 생성합니다.
	 * 카트에서 아이템들을 가져와서 주문을 생성하고 결제를 위한 정보를 반환합니다.
	 */
	async createPaymentOrder(userId: number, dto: PaymentOrderCreateRequestDto): Promise<PaymentOrderCreateResponseDto> {
		try {
			// 사용자의 카트 아이템들 조회
			const cartItems = (await this.cartService.findAll(userId)) as unknown as CartItemWithProduct[];
			this.logger.log({ cartItems, userId }, "카트 아이템 조회");

			if (!cartItems || cartItems.length === 0) {
				throw new BadRequestException(CART_EMPTY_ERROR);
			}

			// 선택된 아이템들만 필터링 (dto.cartItemIds가 제공된 경우)
			const selectedItems = dto.cartItemIds
				? cartItems.filter((item) => dto.cartItemIds.includes(Number(item.id)))
				: cartItems;

			if (selectedItems.length === 0) {
				throw new BadRequestException(CART_EMPTY_ERROR);
			}

			// 총 금액 계산
			const totalAmount = selectedItems.reduce((sum, item) => sum + item.selectedLicense.price, 0);

			// 주문 정보 생성
			const orderName =
				selectedItems.length === 1
					? selectedItems[0].product.productName
					: `${selectedItems[0].product.productName} 외 ${selectedItems.length - 1}개`;

			// 외부 노출용 주문번호 생성 (YYYYMMDD + 시분초 + 랜덤3자리)
			const now = new Date();
			const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
			const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
			const randomStr = Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0"); // 000-999
			const orderNumber = `${dateStr}${timeStr}${randomStr}`;

			// 주문 데이터를 데이터베이스에 저장 (UUID는 자동 생성)
			const order = await this.prisma.order.create({
				data: {
					buyerId: BigInt(userId),
					orderNumber,
					orderName,
					totalAmount,
					status: "PENDING",
					paymentId: dto.paymentId,
				},
			});

			// 주문 아이템들 생성 (개별 상품 정보)
			await this.prisma.orderItem.createMany({
				data: selectedItems.map((item) => ({
					orderId: order.id,
					productId: BigInt(item.product.id),
					licenseId: BigInt(item.selectedLicense.id),
					price: item.selectedLicense.price,
					productName: item.product.productName,
				})),
			});

			return {
				orderNumber: order.orderNumber,
				orderUuid: order.uuid,
				paymentId: order.paymentId,
				orderName: order.orderName,
				totalAmount: order.totalAmount,
				createdAt: order.createdAt,
			};
		} catch (error) {
			this.logger.error(
				{
					userId,
					dto,
					error: error.message,
					stack: error.stack,
				},
				"결제 주문 생성 실패",
			);
			if (error instanceof BadRequestException || error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({
				...PAYMENT_ORDER_CREATE_ERROR,
				detail: error.message,
			});
		}
	}

	/**
	 * 결제 완료 처리를 수행합니다.
	 * 포트원에서 결제 정보를 조회하고 검증한 후 주문을 완료 처리합니다.
	 */
	async completePayment(userId: number, dto: PaymentCompleteRequestDto): Promise<PaymentCompletionResponseDto> {
		try {
			// 포트원에서 결제 정보 조회
			const payment = await this.portone.payment.getPayment({
				paymentId: dto.paymentId,
			});

			if (!payment) {
				throw new NotFoundException(PAYMENT_NOT_FOUND_ERROR);
			}

			// 데이터베이스에서 주문 정보 조회
			const order = await this.prisma.order
				.findFirst({
					where: {
						buyerId: BigInt(userId),
						paymentId: dto.paymentId,
					},
					include: {
						orderItems: true,
					},
				})
				.then((order) => this.prisma.serializeBigIntTyped(order));

			if (!order) {
				throw new NotFoundException({
					code: "ORDER_NOT_FOUND",
					message: "주문을 찾을 수 없습니다.",
				});
			}

			// 결제 상태에 따른 처리
			if (payment.status === "PAID") {
				// 결제 금액 검증
				const paymentAmount = payment.amount.total;
				if (paymentAmount !== (order.totalAmount || order.totalPrice || 0)) {
					throw new BadRequestException(INVALID_PAYMENT_AMOUNT_ERROR);
				}

				// 결제 성공 처리
				const updatedOrder = await this.prisma.order.update({
					where: { id: order.id },
					data: {
						status: "COMPLETED",
						paidAt: new Date(),
						paymentMethod: (payment.method?.type as string) || "UNKNOWN",
						pgTransactionId: payment.pgTxId,
					},
					include: { orderItems: true },
				});

				// 카트에서 아이템 제거
				await this.clearCartAfterPayment(userId, updatedOrder.orderItems);

				this.logger.log(
					{
						orderId: order.id,
						paymentId: dto.paymentId,
						amount: paymentAmount,
						status: payment.status,
					},
					"결제 완료",
				);

				return {
					orderId: Number(order.id),
					paymentId: order.paymentId,
					status: updatedOrder.status as OrderStatus,
					amount: paymentAmount,
					paidAt: updatedOrder.paidAt,
					paymentMethod: updatedOrder.paymentMethod,
				};
			} else if (payment.status === "VIRTUAL_ACCOUNT_ISSUED") {
				// 가상계좌 발급 처리
				await this.prisma.order.update({
					where: { id: order.id },
					data: {
						status: "WAITING_FOR_DEPOSIT",
						paymentMethod: "VIRTUAL_ACCOUNT",
						pgTransactionId: payment.pgTxId,
					},
				});

				// 가상계좌 정보 추출
				let virtualAccount = undefined;
				if (payment.method?.type === "PaymentMethodVirtualAccount") {
					virtualAccount = {
						bankCode: payment.method.bank,
						accountNumber: payment.method.accountNumber,
						dueDate: payment.method.expiredAt,
					};
				}

				return {
					orderId: Number(order.id),
					paymentId: dto.paymentId,
					status: "WAITING_FOR_DEPOSIT",
					amount: payment.amount.total,
					virtualAccount,
				};
			} else {
				throw new BadRequestException({
					code: "INVALID_PAYMENT_STATUS",
					message: `유효하지 않은 결제 상태입니다: ${String(payment.status)}`,
				});
			}
		} catch (error) {
			this.logger.error(
				{
					userId,
					dto,
					error: error.message,
					stack: error.stack,
				},
				"결제 완료 처리 실패",
			);
			if (
				error instanceof Payment.GetPaymentError ||
				error instanceof BadRequestException ||
				error instanceof NotFoundException ||
				error instanceof ForbiddenException ||
				error instanceof UnauthorizedException
			) {
				throw error;
			}
			throw new BadRequestException({
				...PAYMENT_COMPLETE_ERROR,
				detail: error.message,
			});
		}
	}

	/**
	 * 웹훅을 통한 결제 상태 동기화
	 */
	async syncPaymentFromWebhook(paymentId: string, baseWebhookData: PortOneWebhook) {
		try {
			this.logger.log(
				{
					paymentId,
					webhookType: baseWebhookData.type,
					timestamp: baseWebhookData.timestamp,
				},
				"웹훅 처리 시작",
			);

			// 결제 관련 웹훅이 아닌 경우 early return
			if (!isPaymentWebhook(baseWebhookData)) {
				this.logger.warn(
					{
						paymentId,
						webhookType: baseWebhookData.type,
					},
					"결제 관련 웹훅이 아님",
				);
				return;
			}

			const webhookData = baseWebhookData as Webhook.Webhook;
			// 데이터베이스에서 주문 정보 조회
			const order = await this.prisma.order
				.findFirst({
					where: { paymentId },
					include: { orderItems: true },
				})
				.then((order) => this.prisma.serializeBigIntTyped(order));

			if (!order) {
				this.logger.warn({ paymentId }, "웹훅에서 주문 정보를 찾을 수 없음");
				return;
			}

			// 웹훅 타입에 따른 결제 상태 처리
			if (webhookData.type === "Transaction.Paid" && order.status !== "COMPLETED") {
				// 포트원에서 최신 결제 정보 조회하여 검증 (금액 등 중요 정보)
				const payment = await this.portone.payment.getPayment({ paymentId });

				if (!payment) {
					this.logger.error({ paymentId }, "포트원에서 결제 정보를 찾을 수 없음");
					return;
				}

				// 결제 완료 상태 확인
				if (payment.status !== "PAID") {
					this.logger.warn(
						{
							paymentId,
							webhookStatus: "Transaction.Paid",
							actualStatus: payment.status,
						},
						"웹훅과 실제 결제 상태 불일치",
					);
					return;
				}

				// 주문 완료 처리
				await this.prisma.order.update({
					where: { id: order.id },
					data: {
						status: "COMPLETED",
						paidAt: new Date(),
						paymentMethod: (payment.method?.type as string) || "UNKNOWN",
						pgTransactionId: payment.pgTxId || null,
					},
				});

				// 카트에서 아이템 제거
				await this.clearCartAfterPayment(Number(order.buyerId), order.orderItems);

				this.logger.log(
					{
						orderId: order.id,
						paymentId,
						webhookType: webhookData.type,
						status: payment.status,
						amount: payment.amount?.total,
					},
					"웹훅으로 결제 완료 처리",
				);
			} else if (
				(webhookData.type === "Transaction.Cancelled" || webhookData.type === "Transaction.PartialCancelled") &&
				order.status !== "CANCELLED"
			) {
				// 주문 취소 처리
				await this.prisma.order.update({
					where: { id: order.id },
					data: {
						status: "CANCELLED",
						cancelledAt: new Date(),
					},
				});

				this.logger.log(
					{
						orderId: order.id,
						paymentId,
						webhookType: webhookData.type,
						cancellationId: webhookData.data.cancellationId,
					},
					"웹훅으로 결제 취소 처리",
				);
			} else if (webhookData.type === "Transaction.VirtualAccountIssued") {
				// 가상계좌 발급 상태 업데이트
				await this.prisma.order.update({
					where: { id: order.id },
					data: {
						status: "WAITING_FOR_DEPOSIT",
					},
				});

				this.logger.log(
					{
						orderId: order.id,
						paymentId,
						webhookType: webhookData.type,
					},
					"웹훅으로 가상계좌 발급 처리",
				);
			} else {
				this.logger.log(
					{
						orderId: order.id,
						paymentId,
						webhookType: webhookData.type,
						currentStatus: order.status,
					},
					"처리하지 않는 웹훅 타입 또는 이미 처리된 상태",
				);
			}
		} catch (error) {
			this.logger.error(
				{
					paymentId,
					webhookType: baseWebhookData.type,
					error: error.message,
					stack: error.stack,
				},
				"웹훅 처리 실패",
			);
			// 웹훅 처리 실패시에도 예외를 던지지 않아야 재시도를 방지할 수 있음
			throw error;
		}
	}

	/**
	 * 결제 완료 후 카트에서 구매한 아이템들을 제거
	 */
	private async clearCartAfterPayment(userId: number, orderItems: any[]) {
		try {
			const cartItems = await this.prisma.cart
				.findMany({
					where: {
						userId: BigInt(userId),
						deletedAt: null,
						productId: {
							in: orderItems.map((item) => item.productId),
						},
						licenseId: {
							in: orderItems.map((item) => item.licenseId),
						},
					},
				})
				.then((cartItems) => this.prisma.serializeBigIntTyped(cartItems));

			if (cartItems.length > 0) {
				await this.prisma.cart.updateMany({
					where: {
						id: {
							in: cartItems.map((item) => item.id),
						},
					},
					data: {
						deletedAt: new Date(),
					},
				});

				this.logger.log(
					{
						userId,
						cartItemCount: cartItems.length,
						removedItemIds: cartItems.map((item) => item.id),
					},
					"카트에서 아이템 제거 완료",
				);
			}
		} catch (error) {
			this.logger.error(
				{
					userId,
					orderItems: orderItems.map((item) => ({ productId: item.productId, licenseId: item.licenseId })),
					error: error.message,
					stack: error.stack,
				},
				"카트 아이템 제거 실패",
			);
			// 카트 제거 실패는 결제 완료에 영향을 주지 않음
		}
	}

	/**
	 * 주문 조회 (orderNumber 기반)
	 */
	async getOrder(userId: number, orderNumber: string) {
		const order = await this.prisma.order
			.findFirst({
				where: {
					orderNumber: orderNumber,
					buyerId: BigInt(userId),
				},
				include: {
					orderItems: {
						include: {
							product: {
								select: {
									id: true,
									productName: true,
									artistSellerIdToArtist: {
										select: {
											stageName: true,
										},
									},
								},
							},
							license: {
								select: {
									type: true,
								},
							},
						},
					},
				},
			})
			.then((order) => this.prisma.serializeBigIntTyped(order));

		if (!order) {
			throw new NotFoundException({
				code: "ORDER_NOT_FOUND",
				message: "주문을 찾을 수 없습니다.",
			});
		}

		return {
			...order,
			id: Number(order.id),
			buyerId: Number(order.buyerId),
			orderItems: order.orderItems.map((item) => ({
				...item,
				id: Number(item.id),
				orderId: Number(item.orderId),
				productId: Number(item.productId),
				licenseId: Number(item.licenseId),
				product: {
					...item.product,
					id: Number(item.product.id),
				},
			})),
		};
	}

	/**
	 * 사용자의 주문 목록 조회
	 */
	async getUserOrders(
		userId: number,
		page: number = 1,
		limit: number = 10,
	): Promise<{
		data: PaymentOrderResponseDto[];
		_pagination: {
			page: number;
			limit: number;
			totalPage: number;
			total: number;
		};
	}> {
		const skip = (page - 1) * limit;

		const [orders, total] = await Promise.all([
			this.prisma.order
				.findMany({
					where: {
						buyerId: BigInt(userId),
						// only completed orders
						status: {
							not: "INITIATE",
						},
					},
					include: {
						orderItems: {
							include: {
								product: {
									include: {
										artistSellerIdToArtist: {
											omit: {
												userId: true,
											},
											include: {
												// profileImageUrl: true,
											},
										},
										productLicense: {
											select: {
												license: {
													select: {
														id: true,
														type: true,
													},
												},
											},
										},
										productGenre: {
											select: {
												genre: {
													select: {
														id: true,
														name: true,
													},
												},
											},
										},
										productTag: {
											select: {
												tag: {
													select: {
														id: true,
														name: true,
													},
												},
											},
										},
										productLike: {
											where: { userId: BigInt(userId), deletedAt: null },
										},
									},
								},
								license: {
									select: {
										type: true,
									},
								},
							},
						},
					},
					orderBy: { createdAt: "desc" },
					skip,
					take: limit,
				})
				.then((orders) => this.prisma.serializeBigIntTyped(orders)),
			this.prisma.order
				.count({
					where: { buyerId: BigInt(userId) },
				})
				.then((total) => this.prisma.serializeBigIntTyped(total)),
		]);

		const productIds = orders
			.flatMap((order) => order.orderItems.flatMap((item) => item.productId))
			.map((id) => Number(id));
		const productsFiles = await this.fileService.findFilesByTargetIds({
			targetIds: productIds,
			targetTable: "product",
			type: ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE,
		});
		console.log(productsFiles);
		const productsFilesMap = new Map(productsFiles.map((file) => [Number(file.targetId), file]));
		console.log(productsFilesMap);

		const productTrim = (p) => {
			const isLiked = p.productLike.length > 0 ? true : false;
			const coverImage = productsFilesMap.get(Number(p.id));

			const newProduct = {
				...p,
				seller: {
					...p.artistSellerIdToArtist,
					etcAccounts: p.artistSellerIdToArtist.etcAccounts as string[],
				},
				licenses: p.productLicense.map((l) => ({
					id: l.license.id,
					type: l.license.type,
					price: l.price,
				})),
				genres: p.productGenre.map((pg) => ({
					id: pg.genre.id,
					name: pg.genre.name,
				})),
				tags: p.productTag.map((pt) => ({
					id: pt.tag.id,
					name: pt.tag.name,
				})),
				isLiked: isLiked,
				imageUrl: coverImage?.url,
				coverImage: coverImage,
			};

			delete newProduct.artistSellerIdToArtist;
			delete newProduct.productLicense;
			delete newProduct.productGenre;
			delete newProduct.productTag;
			delete newProduct.productLike;

			return newProduct;
		};

		return {
			data: orders.map((order) => ({
				// id: Number(order.id),
				buyerId: Number(order.buyerId),
				// orderId: Number(order.id),
				paymentId: order.paymentId,
				orderNumber: order.orderNumber,
				orderName: order.orderName,
				totalAmount: order.totalAmount,
				items: order.orderItems.map((item) => ({
					// id: Number(item.id),
					// productId: Number(item.productId),
					// productName: item.product.productName,
					price: item.price,
					licenseType: item.license.type,
					product: productTrim(item.product),
					// artist: {
					// 	...item.product.artistSellerIdToArtist,
					// 	id: Number(item.product.artistSellerIdToArtist.id),
					// 	etcAccounts: item.product.artistSellerIdToArtist.etcAccounts as string[],
					// 	profileImage: artistProfileImages[Number(item.product.artistSellerIdToArtist.id)],
					// },
				})),
				status: order.status as OrderStatus,
				createdAt: order.createdAt,
				// orderUuid: order.uuid,
			})),
			_pagination: {
				page,
				limit,
				totalPage: Math.ceil(total / limit),
				total,
			},
		};
	}

	/**
	 * 사용자가 구매한 상품 목록 조회
	 * @param userId 사용자 ID
	 * @param productId 상품 ID
	 * @returns
	 */
	async getOrderedItemsByProductId(userId: number | bigint, productId: number | bigint) {
		const order = await this.prisma.order
			.findMany({
				where: {
					buyerId: BigInt(userId),
					orderItems: {
						some: {
							productId: BigInt(productId),
						},
					},
				},
			})
			.then((order) => this.prisma.serializeBigIntTyped(order));

		return order;
	}

	/**
	 * 포트원 웹훅 검증
	 * @param body
	 * @param headers
	 * @returns
	 */
	async verifyWebhook(body: string, headers: any) {
		const verifiedWebhook = await Webhook.verify(this.portoneWebhookSecret, body, headers);
		return verifiedWebhook;
	}
}
