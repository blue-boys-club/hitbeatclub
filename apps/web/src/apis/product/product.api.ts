import {
	ProductCreateSchema,
	ProductDetailResponse,
	ProductListDashboardResponse,
	ProductListPagingResponse,
	ProductListQueryRequest,
	ProductSearchInfoResponse,
	ProductUpdateSchema,
} from "@hitbeatclub/shared-types/product";
import client from "@/apis/api.client";
import { z } from "zod";
import type { CommonResponse, CommonResponseId } from "@/apis/api.type";
import { FileUploadResponse } from "@hitbeatclub/shared-types/file";
import { PRODUCT_FILE_TYPE } from "./product.type";
import { deepRemoveDefaults } from "@/lib/schema.utils";

/**
 * 상품 목록 조회
 * @returns 상품 목록
 */
export const getProductList = async (payload: ProductListQueryRequest) => {
	const response = await client.get<ProductListPagingResponse>("/products", {
		params: payload,
	});
	return response.data;
};

/**
 * 상품 상세 조회
 * @param productId 상품 ID
 * @returns 상품 상세 정보
 */
export const getProduct = async (productId: number) => {
	const response = await client.get<CommonResponse<ProductDetailResponse>>(`/products/${productId}`);
	return response.data;
};

/**
 * 상품 생성
 * @param product 상품 정보
 * @returns 생성된 상품 정보
 */
export const createProduct = async (product: z.infer<typeof ProductCreateSchema>) => {
	const parsed = deepRemoveDefaults(ProductCreateSchema).parse(product);
	const response = await client.post<CommonResponseId>("/products", parsed);
	return response.data;
};

/**
 * 상품 수정
 * @param productId 상품 ID
 * @param product 상품 정보
 * @returns 수정된 상품 정보
 */
export const updateProduct = async (productId: number, product: z.infer<typeof ProductUpdateSchema>) => {
	const parsed = deepRemoveDefaults(ProductUpdateSchema).parse(product);
	const response = await client.patch<CommonResponseId>(`/products/${productId}`, parsed);
	return response.data;
};

/**
 * 상품 삭제
 * @param productId 상품 ID
 * @returns 삭제된 상품 정보
 */
export const deleteProduct = async (productId: number) => {
	const response = await client.delete<CommonResponseId>(`/products/${productId}`);
	return response.data;
};

/**
 * 상품 파일 업로드
 * @param file 업로드할 파일
 * @param type 파일 타입
 * @returns 업로드된 파일 정보
 */
export const uploadProductFile = async (file: File, type: PRODUCT_FILE_TYPE) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("type", type);

	const response = await client.post<CommonResponse<FileUploadResponse>>("/products/file", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

/**
 * 상품 검색 정보 조회 (장르, 태그)
 * @returns 상품 검색 정보 (장르, 태그)
 */
export const getProductSearchInfo = async () => {
	const response = await client.get<CommonResponse<ProductSearchInfoResponse>>("/products/search-info");
	return response.data;
};

/**
 * 메인 페이지(대쉬보드) 상품 목록 조회
 * @returns 메인 페이지(대쉬보드) 상품 목록
 */
export const getProductListForDashboard = async () => {
	const response = await client.get<CommonResponse<ProductListDashboardResponse>>("/products/dashboard");
	return response.data;
};

/**
 * 좋아요 처리
 */
export const likeProduct = async (productId: number) => {
	const response = await client.post<CommonResponseId>(`/products/${productId}/like`);
	return response.data;
};

/**
 * 좋아요 취소
 */
export const unlikeProduct = async (productId: number) => {
	const response = await client.delete<CommonResponseId>(`/products/${productId}/un-like`);
	return response.data;
};
