/**
 * route-mapper.ts
 * 모바일/PC 호환을 위해 URL 경로를 상호 변환하는 유틸리티 함수 모음.
 *
 * 기본 규칙
 * 1. 모바일 경로는 `/mobile` prefix 를 가진다.
 * 2. PC 경로는 `/mobile` prefix 가 없다.
 * 3. 일부 경로는 prefix 외에도 디렉토리 구조가 달라 별도의 매핑이 필요하다.
 */

/** 커스텀 1:1 경로 매핑 테이블 */
const SPECIFIC_ROUTE_MAP: Record<string, string> = {
	// PC -> Mobile
	"/": "/mobile/home",
	"/cart": "/mobile/my/cart",
	"/likes": "/mobile/my/like",
	"/orders": "/mobile/my/orders",
	"/notices": "/mobile/notice",
	// 필요한 경우 여기에 계속 추가
};

/** 주어진 경로가 모바일 경로인지 여부 */
export const isMobilePath = (path: string): boolean => path.startsWith("/mobile");

/**
 * PC 경로 -> 모바일 경로 변환
 * - SPECIFIC_ROUTE_MAP 에 명시된 경우 우선 적용
 * - 그 외에는 "/mobile" prefix 를 붙여 반환
 */
export const toMobilePath = (pcPath: string): string => {
	if (isMobilePath(pcPath)) return pcPath; // 이미 모바일 경로

	// exact match 우선 변환
	const specific = SPECIFIC_ROUTE_MAP[pcPath];
	if (specific) return specific;

	// prefix 변환 (e.g., "/artists/123" -> "/mobile/artists/123")
	if (pcPath === "/") return "/mobile";

	return `/mobile${pcPath}`;
};

/**
 * 모바일 경로 -> PC 경로 변환
 * - SPECIFIC_ROUTE_MAP 의 역매핑 우선 적용
 * - 그 외에는 "/mobile" prefix 를 제거
 */
export const toPcPath = (mobilePath: string): string => {
	if (!isMobilePath(mobilePath)) return mobilePath; // 이미 PC 경로

	// 역매핑 생성
	const reversed = Object.fromEntries(Object.entries(SPECIFIC_ROUTE_MAP).map(([pc, mobile]) => [mobile, pc])) as Record<
		string,
		string
	>;

	const specific = reversed[mobilePath];
	if (specific) return specific;

	// prefix 제거
	const withoutPrefix = mobilePath.replace(/^\/mobile/, "");
	return withoutPrefix === "" ? "/" : withoutPrefix;
};
