/**
 * 검색 매칭 점수 계산 함수
 * @param text 비교할 텍스트
 * @param searchKeyword 검색 키워드
 * @returns 매칭 점수 (0-100)
 */
export const calculateMatchScore = (text: string, searchKeyword: string): number => {
	const lowerText = text.toLowerCase();
	const lowerKeyword = searchKeyword.toLowerCase();

	// 정확히 일치하는 경우 최고 점수
	if (lowerText === lowerKeyword) return 100;

	// 시작 부분 일치하는 경우 높은 점수
	if (lowerText.startsWith(lowerKeyword)) return 80;

	// 포함하는 경우 중간 점수
	if (lowerText.includes(lowerKeyword)) return 60;

	// 기본 점수
	return 0;
};

/**
 * 상품 매칭 점수 계산
 * @param product 상품 객체
 * @param keyword 검색 키워드
 * @returns 매칭 점수가 추가된 상품 객체
 */
export const calculateProductMatchScore = (product: any, keyword: string) => ({
	...product,
	type: "product" as const,
	matchScore: Math.max(
		calculateMatchScore(product.productName, keyword),
		calculateMatchScore(product.productDescription || "", keyword),
	),
});

/**
 * 아티스트 매칭 점수 계산
 * @param artist 아티스트 객체
 * @param keyword 검색 키워드
 * @returns 매칭 점수가 추가된 아티스트 객체
 */
export const calculateArtistMatchScore = (artist: any, keyword: string) => ({
	...artist,
	type: "artist" as const,
	matchScore: calculateMatchScore(artist.stageName, keyword),
});

/**
 * 자동완성용 검색 결과를 매칭 점수 기준으로 정렬하고 섞어서 반환
 * @param products 상품 배열
 * @param artists 아티스트 배열
 * @param keyword 검색 키워드
 * @param maxResults 최대 결과 수 (기본값: 20)
 * @returns 매칭 점수 기준으로 정렬된 혼합 결과 배열
 */
export const sortAndLimitAutocompleteResults = (products: any[], artists: any[], keyword: string, maxResults = 20) => {
	// 상품을 자동완성 형태로 변환
	const autocompleteProducts = products.map((product) => ({
		type: "PRODUCT" as const,
		id: product.id,
		productName: product.productName,
		productImageUrl: product.coverImage?.url || "",
		matchScore: Math.max(
			calculateMatchScore(product.productName, keyword),
			calculateMatchScore(product.productDescription || "", keyword),
		),
	}));

	// 아티스트를 자동완성 형태로 변환
	const autocompleteArtists = artists.slice(0, 10).map((artist) => ({
		type: "ARTIST" as const,
		id: artist.id,
		stageName: artist.stageName,
		profileImageUrl: artist.profileImageUrl,
		slug: artist.slug,
		matchScore: calculateMatchScore(artist.stageName, keyword),
	}));

	// 모든 결과를 합치고 매칭 점수 기준으로 정렬
	const allResults = [...autocompleteProducts, ...autocompleteArtists].sort((a, b) => b.matchScore - a.matchScore);

	// 상위 결과만 취하고 매칭 점수 제거
	const finalResults = allResults.slice(0, maxResults).map((item) => {
		const { matchScore, ...rest } = item;
		return rest;
	});

	return finalResults;
};

/**
 * 빈 자동완성 결과 반환
 * @returns 빈 자동완성 결과 배열
 */
export const getEmptyAutocompleteResult = () => [];
