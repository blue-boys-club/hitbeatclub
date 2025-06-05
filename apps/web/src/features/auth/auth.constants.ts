import type { DropdownOption } from "@/components/ui/Dropdown";

// 성별 옵션
export const GENDER_OPTIONS: DropdownOption[] = [
	{ label: "남성", value: "M" },
	{ label: "여성", value: "F" },
];

// 년도 옵션 생성 함수
export const generateYearOptions = (): DropdownOption[] => {
	const currentYear = new Date().getFullYear();
	return Array.from({ length: 100 }, (_, i) => {
		const year = currentYear - i;
		return { label: `${year}`, value: year.toString() };
	});
};

// 월 옵션
export const MONTH_OPTIONS: DropdownOption[] = Array.from({ length: 12 }, (_, i) => {
	const month = i + 1;
	return { label: `${month}`, value: month.toString() };
});

// 일 옵션
export const DAY_OPTIONS: DropdownOption[] = Array.from({ length: 31 }, (_, i) => {
	const day = i + 1;
	return { label: `${day}`, value: day.toString() };
});

export const KAKAO_OAUTH_TYPE = "kakao";
export const KAKAO_OAUTH_SCOPE = "openid,account_email";

export const KAKAO_OAUTH_BASE_URL = "https://kauth.kakao.com/oauth/authorize";

/**
 * 카카오 로그인 URL 생성기
 * 클라이언트 사이드에서만 호출되어야 합니다.
 */
export const generateKakaoOAuthURL = (): string => {
	const clientId = process.env.NEXT_PUBLIC_AUTH_SOCIAL_KAKAO_CLIENT_ID!;
	const origin = window.location.origin;
	const callbackUri = `${origin}/auth/${KAKAO_OAUTH_TYPE}/callback`;

	const parameters = new URLSearchParams({
		client_id: clientId,
		redirect_uri: callbackUri,
		response_type: "code",
		scope: KAKAO_OAUTH_SCOPE,
	});

	return `${KAKAO_OAUTH_BASE_URL}?${parameters.toString()}`;
};

export const NAVER_OAUTH_TYPE = "naver";

export const NAVER_OAUTH_BASE_URL = "https://nid.naver.com/oauth2.0/authorize";

/**
 * 네이버 로그인 URL 생성기
 * 클라이언트 사이드에서만 호출되어야 합니다.
 */
export const generateNaverOAuthURL = (): string => {
	const clientId = process.env.NEXT_PUBLIC_AUTH_SOCIAL_NAVER_CLIENT_ID!;
	const origin = window.location.origin;
	const callbackUri = `${origin}/auth/${NAVER_OAUTH_TYPE}/callback`;

	const parameters = new URLSearchParams({
		client_id: clientId,
		redirect_uri: callbackUri,
		response_type: "code",
	});

	return `${NAVER_OAUTH_BASE_URL}?${parameters.toString()}`;
};
