export const PAYMENT_VALIDATION_ERROR = {
	title: "Payment validation error",
	code: 2100,
	status: 400,
	detail: "결제 정보 검증에 실패했습니다.",
};

export const PAYMENT_ORDER_CREATE_ERROR = {
	title: "Payment order create error",
	code: 2101,
	status: 400,
	detail: "결제 주문 생성에 실패했습니다.",
};

export const PAYMENT_COMPLETE_ERROR = {
	title: "Payment complete error",
	code: 2102,
	status: 400,
	detail: "결제 완료 처리에 실패했습니다.",
};

export const INVALID_PAYMENT_AMOUNT_ERROR = {
	title: "Invalid payment amount",
	code: 2104,
	status: 400,
	detail: "결제 금액이 주문 금액과 일치하지 않습니다.",
};

export const CART_EMPTY_ERROR = {
	title: "Cart empty error",
	code: 2105,
	status: 400,
	detail: "장바구니가 비어있습니다.",
};

export const ORDER_NOT_FOUND_ERROR = {
	title: "Order not found",
	code: 2106,
	status: 404,
	detail: "주문을 찾을 수 없습니다.",
};

export const WEBHOOK_VERIFICATION_ERROR = {
	title: "Webhook verification error",
	code: 2107,
	status: 400,
	detail: "웹훅 검증에 실패했습니다.",
};

export const PAYMENT_FORBIDDEN_ERROR = {
	title: "Rejected payment",
	code: 2131,
	status: 403,
	detail: "결제가 거절되었습니다.",
};

export const PAYMENT_INVALID_REQUEST_ERROR = {
	title: "Invalid payment request",
	code: 2162,
	status: 400,
	detail: "잘못된 결제 요청입니다.",
};

export const PAYMENT_NOT_FOUND_ERROR = {
	title: "Payment not found",
	code: 2163,
	status: 404,
	detail: "존재하지 않는 결제건 입니다.",
};

export const PAYMENT_UNAUTHORIZED_ERROR = {
	title: "Unauthorized payment",
	code: 2164,
	status: 401,
	detail: "결제 인증이 필요합니다.",
};
