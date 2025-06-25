export const USER_NOT_FOUND_ERROR = {
	title: "User not found",
	code: 1600,
	status: 404,
	detail: "사용자를 찾을 수 없습니다.",
};

export const USER_ALREADY_SUBSCRIBED_ERROR = {
	title: "User already subscribed",
	code: 1601,
	status: 401,
	detail: "이미 구독 중입니다.",
};

export const SUBSCRIPTION_NOT_FOUND_ERROR = {
	title: "Subscription not found",
	code: 1602,
	status: 404,
	detail: "구독 정보를 찾을 수 없습니다.",
};

export const SUBSCRIPTION_PRODUCT_NOT_FOUND_ERROR = {
	title: "Subscription product not found",
	code: 1603,
	status: 400,
	detail: "구독 상품을 찾을 수 없습니다.",
};

export const SUBSCRIPTION_ALREADY_CANCELED_ERROR = {
	title: "Subscription already canceled",
	code: 1604,
	status: 400,
	detail: "이미 취소된 구독입니다.",
};
