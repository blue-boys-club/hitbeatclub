export const COUPON_NOT_FOUND_ERROR = {
	title: "Coupon not found",
	code: 1602,
	status: 404,
	detail: "쿠폰을 찾을 수 없습니다.",
};

export const COUPON_ALREADY_USED_ERROR = {
	title: "Coupon already used",
	code: 1603,
	status: 409,
	detail: "이미 사용한 이력이 있는 쿠폰이에요.",
};

export const COUPON_EXPIRED_ERROR = {
	title: "Coupon expired",
	code: 1604,
	status: 410,
	detail: "만료된 쿠폰입니다.",
};

export const COUPON_USAGE_LIMIT_EXCEEDED_ERROR = {
	title: "Coupon usage limit exceeded",
	code: 1605,
	status: 409,
	detail: "쿠폰 사용 한도를 초과했습니다.",
};
