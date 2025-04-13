import client from "../client";

// TODO: Type package로 공유 타입 정의
/**
 * 상품 목록 조회
 * @returns 상품 목록
 */
export const getProductList = async () => {
	const response = await client.get("/products");
	return response.data;
};

// TODO: Type package로 공유 타입 정의
/**
 * 상품 상세 조회
 * @param productId 상품 ID
 * @returns 상품 상세 정보
 */
export const getProduct = async (productId: number) => {
	const response = await client.get(`/products/${productId}`);
	return response.data;
};

// TODO: Type package로 공유 타입 정의
/**
 * 상품 생성
 * @param product 상품 정보
 * @returns 생성된 상품 정보
 */
export const createProduct = async (product: unknown) => {
	const response = await client.post("/products", product);
	return response.data;
};

// TODO: Type package로 공유 타입 정의
/**
 * 상품 수정
 * @param productId 상품 ID
 * @param product 상품 정보
 * @returns 수정된 상품 정보
 */
export const updateProduct = async (productId: number, product: unknown) => {
	const response = await client.put(`/products/${productId}`, product);
	return response.data;
};

// TODO: Type package로 공유 타입 정의
/**
 * 상품 삭제
 * @param productId 상품 ID
 * @returns 삭제된 상품 정보
 */
export const deleteProduct = async (productId: number) => {
	const response = await client.delete(`/products/${productId}`);
	return response.data;
};
