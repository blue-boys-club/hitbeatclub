import type { ReactNode } from "react";

export { cn } from "./tailwind";

/**
 * 순수 영문 여부 체크
 *
 * 단 특수문자나 숫자만 있는 경우는 순수 영문으로 처리하지 않음
 * @param text 체크할 문자열 / ReactNode
 * @returns 순수 영문 여부
 */
export function checkIsPureEnglish(text?: string | ReactNode) {
	if (!text) return false;

	const textStr = text.toString();
	// 영문, 숫자, 공백, 기본 특수문자로만 이루어진 경우 체크
	const isEnglish = !!textStr.match(/^[a-zA-Z0-9\s.,!?()_\-']+$/);
	// 특수문자로만 이루어진 경우 체크
	const isOnlySpecialCharacters = !!textStr.match(/^[^\w\s]+$/);
	// 영문이면서 특수문자로만 이루어지지 않은 경우를 순수 영문으로 판단
	return isEnglish && !isOnlySpecialCharacters;
}
