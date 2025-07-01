// 환율(ExchangeRate) 에러 메시지

export const EXCHANGE_RATE_NOT_FOUND_ERROR = {
	statusCode: 404,
	message: "환율 정보를 찾을 수 없습니다.",
	error: "EXCHANGE_RATE_NOT_FOUND_ERROR",
};

export const EXCHANGE_RATE_FIND_ERROR = {
	statusCode: 400,
	message: "환율 조회에 실패했습니다.",
	error: "EXCHANGE_RATE_FIND_ERROR",
};
