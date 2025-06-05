/**
 * Settlement 모듈 에러 메시지 상수
 */

export const SETTLEMENT_NOT_FOUND_ERROR = {
	title: "Settlement not found",
	detail: "정산 정보를 찾을 수 없습니다.",
	code: 2000,
	status: 404,
};

export const SETTLEMENT_ALREADY_EXISTS_ERROR = {
	title: "Settlement already exists",
	detail: "정산 정보가 이미 존재합니다.",
	code: 2001,
	status: 400,
};
