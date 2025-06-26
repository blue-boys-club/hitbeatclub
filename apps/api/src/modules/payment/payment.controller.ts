import {
	Controller,
	Post,
	Body,
	Headers,
	Get,
	Param,
	Query,
	Request,
	RawBody,
	BadRequestException,
	Logger,
	HttpCode,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentOrderCreateRequestDto } from "./dto/request/payment.order.create.request.dto";
import { PaymentCompleteRequestDto } from "./dto/request/payment.complete.request.dto";
import { PaymentOrderResponseDto } from "./dto/response/payment.order.response.dto";
import { PaymentCompletionResponseDto } from "./dto/response/payment.completion.response.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthJwtAccessProtected } from "~/modules/auth/decorators/auth.jwt.decorator";
import { WEBHOOK_VERIFICATION_ERROR } from "./payment.error";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- vscode doesn't recognize this is a dual package even though it is and can be compiled
import { Webhook } from "@portone/server-sdk";
import { PaymentPaginationRequestDto } from "./dto/request/payment.pagination.request.dto";
import { PaymentOrderCreateResponseDto } from "./dto/response/payment.order-create.response.dto";
import { isBillingKeyWebhook, isPaymentWebhook, PortOneWebhook } from "./payment.utils";
import { SubscribeService } from "../subscribe/subscribe.service";
import { PaymentOrderCreateRequestSchema } from "@hitbeatclub/shared-types/payment";
import { ZodValidationPipe } from "nestjs-zod";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
	private readonly logger = new Logger(PaymentController.name);

	constructor(
		private readonly paymentService: PaymentService,
		private readonly subscribeService: SubscribeService,
	) {}

	/**
	 * 결제 주문을 생성합니다.
	 * 사용자의 카트에서 아이템들을 가져와서 주문을 생성하고 결제 정보를 반환합니다.
	 */
	@Post("order")
	@AuthJwtAccessProtected()
	@ApiBearerAuth()
	@ApiOperation({
		summary: "결제 주문 생성",
		description: "카트의 아이템들로 결제 주문을 생성합니다.",
	})
	@ApiResponse({
		status: 201,
		description: "결제 주문이 성공적으로 생성되었습니다.",
		type: PaymentOrderResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: "잘못된 요청입니다.",
	})
	@ApiResponse({
		status: 401,
		description: "인증이 필요합니다.",
	})
	async createPaymentOrder(
		@Request() req: AuthenticatedRequest,
		@Body(new ZodValidationPipe(PaymentOrderCreateRequestSchema)) createPaymentOrderDto: PaymentOrderCreateRequestDto,
	): Promise<IResponse<PaymentOrderCreateResponseDto>> {
		const userId = req.user.id;
		this.logger.log(
			{
				userId,
				dto: createPaymentOrderDto,
			},
			"결제 주문 생성 요청",
		);
		const result = await this.paymentService.createPaymentOrder(userId, createPaymentOrderDto);
		return {
			statusCode: 200,
			message: "결제 주문이 성공적으로 생성되었습니다.",
			data: result,
		};
	}

	/**
	 * 결제 완료 처리를 수행합니다.
	 * 포트원에서 결제 정보를 조회하고 검증한 후 주문을 완료 처리합니다.
	 */
	@Post("complete")
	@AuthJwtAccessProtected()
	@ApiBearerAuth()
	@ApiOperation({
		summary: "결제 완료 처리",
		description: "포트원 결제 정보를 검증하고 주문을 완료 처리합니다.",
	})
	@ApiResponse({
		status: 200,
		description: "결제가 성공적으로 완료되었습니다.",
		type: PaymentCompletionResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: "결제 검증에 실패했습니다.",
	})
	@ApiResponse({
		status: 401,
		description: "인증이 필요합니다.",
	})
	@ApiResponse({
		status: 404,
		description: "결제 정보를 찾을 수 없습니다.",
	})
	async completePayment(
		@Request() req: AuthenticatedRequest,
		@Body() completePaymentDto: PaymentCompleteRequestDto,
	): Promise<IResponse<PaymentCompletionResponseDto>> {
		const userId = req.user.id;
		const result = await this.paymentService.completePayment(userId, completePaymentDto);
		return {
			statusCode: 200,
			message: "결제가 성공적으로 완료되었습니다.",
			data: result,
		};
	}

	/**
	 * 포트원 웹훅을 처리합니다.
	 * 결제 상태 변경 시 포트원에서 전송하는 웹훅을 받아 처리합니다.
	 */
	@Post("webhook")
	@ApiOperation({
		summary: "포트원 웹훅 처리",
		description: "포트원에서 전송하는 결제 상태 변경 웹훅을 처리합니다.",
	})
	@ApiResponse({
		status: 200,
		description: "웹훅이 성공적으로 처리되었습니다.",
	})
	@ApiResponse({
		status: 400,
		description: "웹훅 검증에 실패했습니다.",
	})
	@HttpCode(200) // PortOne에서 POST 인데도 200을 요구함...
	async handleWebhook(@RawBody() body: Buffer | undefined, @Headers() headers: any) {
		try {
			// 웹훅 시그니처 검증
			let webhook: PortOneWebhook;
			try {
				const bodyString = body ? body.toString() : "";
				// this.logger.log({ body, bodyString, headers }, "웹훅 수신");
				const verifiedWebhook = await this.paymentService.verifyWebhook(bodyString, headers);
				webhook = verifiedWebhook as PortOneWebhook;
			} catch (error) {
				this.logger.error({ error }, "Failed to verify webhook");
				throw new BadRequestException(WEBHOOK_VERIFICATION_ERROR);
			}

			this.logger.log(
				{
					webhook,
				},
				"Webhook received",
			);

			// 결제 관련 웹훅 처리
			if (isPaymentWebhook(webhook)) {
				const { paymentId } = webhook.data;
				await this.paymentService.syncPaymentFromWebhook(paymentId, webhook);
				await this.subscribeService.handlePaymentWebhook(webhook);

				this.logger.log(
					{
						webhookType: webhook.type,
						paymentId,
						timestamp: webhook.timestamp,
					},
					"Payment webhook processed",
				);
			}
			// 빌링키 관련 웹훅 처리
			else if (isBillingKeyWebhook(webhook)) {
				await this.subscribeService.handleBillingKeyWebhook(webhook);
			}
			// 처리하지 않는 웹훅 타입
			else {
				this.logger.log(
					{
						webhookType: (webhook as PortOneWebhook).type,
						timestamp: (webhook as PortOneWebhook).timestamp,
					},
					"Unhandled webhook type",
				);
			}

			return { success: true };
		} catch (error) {
			this.logger.error(
				{
					error: error.message,
					stack: error.stack,
				},
				"Webhook processing failed",
			);

			if (error instanceof BadRequestException) {
				throw error;
			}
			// 웹훅 처리 실패시에도 200을 반환하여 재시도를 방지
			// return { success: false, error: "Internal server error" };
			throw new BadRequestException(WEBHOOK_VERIFICATION_ERROR);
		}
	}

	/**
	 * 주문 상세 정보를 조회합니다.
	 */
	@Get("order/:orderNumber")
	@AuthJwtAccessProtected()
	@ApiBearerAuth()
	@ApiOperation({
		summary: "주문 상세 조회",
		description: "주문번호로 주문 상세 정보를 조회합니다.",
	})
	@ApiResponse({
		status: 200,
		description: "주문 정보가 성공적으로 조회되었습니다.",
	})
	@ApiResponse({
		status: 401,
		description: "인증이 필요합니다.",
	})
	@ApiResponse({
		status: 404,
		description: "주문을 찾을 수 없습니다.",
	})
	async getOrder(@Request() req: AuthenticatedRequest, @Param("orderNumber") orderNumber: string) {
		const userId = req.user.id;
		return this.paymentService.getOrder(userId, orderNumber);
	}

	/**
	 * 사용자의 주문 목록을 조회합니다.
	 */
	@Get("orders")
	@AuthJwtAccessProtected()
	@ApiBearerAuth()
	@ApiOperation({
		summary: "주문 목록 조회",
		description: "사용자의 주문 목록을 페이지네이션으로 조회합니다.",
	})
	@ApiResponse({
		status: 200,
		description: "주문 목록이 성공적으로 조회되었습니다.",
	})
	@ApiResponse({
		status: 401,
		description: "인증이 필요합니다.",
	})
	async getUserOrders(
		@Request() req: AuthenticatedRequest,
		@Query() query: PaymentPaginationRequestDto,
	): Promise<IResponsePaging<PaymentOrderResponseDto>> {
		const userId = req.user.id;
		const result = await this.paymentService.getUserOrders(userId, query.page, query.limit);
		return {
			statusCode: 200,
			message: "주문 목록이 성공적으로 조회되었습니다.",
			...result,
		};
	}
}
