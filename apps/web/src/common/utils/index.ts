import type { ReactNode } from "react";

export { cn } from "./tailwind";

/**
 * 순수 영문 여부 체크
 *
 * 단 특수문자나 숫자만 있는 경우는 순수 영문으로 처리하지 않음
 * @param text 체크할 문자열 / ReactNode
 * @param treatSpecialCharactersAsEnglish 특수문자를 영문으로 처리할지 여부
 * @returns 순수 영문 여부
 */
export function checkIsPureEnglish(text?: string | ReactNode, treatSpecialCharactersAsEnglish = false) {
	if (!text) return false;

	const textStr = text.toString();
	// 영문, 숫자, 공백, 기본 특수문자로만 이루어진 경우 체크
	const isEnglish = !!textStr.match(/^[a-zA-Z0-9\s.,!?()_\-'"\s\n]+$/);
	// 특수문자로만 이루어진 경우 체크
	const isOnlySpecialCharacters = !!textStr.match(/^[^\w\s]+$/);
	// 조건에 따라 처리 - 특수문자를 영문으로 처리
	if (treatSpecialCharactersAsEnglish) {
		return isOnlySpecialCharacters || isEnglish;
	}
	// 영문이면서 특수문자로만 이루어지지 않은 경우를 순수 영문으로 판단
	return isEnglish && !isOnlySpecialCharacters;
}

export function generateDateObj(dateStr: Date) {
	const dateObj = new Date(dateStr);
	const year = String(dateObj.getFullYear());
	const month = String(dateObj.getMonth() + 1).padStart(2, "0");
	const date = String(dateObj.getDate()).padStart(2, "0");
	return { year, month, date };
}

/**
 * 숫자를 한국 원화 형식(천단위 콤마 + "원")으로 포맷합니다.
 * @param amount 포맷할 금액 (number)
 * @returns 포맷된 문자열 (예: 19900 -> "19,900원")
 */
export function formatPrice(amount?: number | null) {
	if (amount === undefined || amount === null) return "-";
	return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}
