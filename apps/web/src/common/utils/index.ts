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
