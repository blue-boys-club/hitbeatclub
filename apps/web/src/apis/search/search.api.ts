import client from "@/apis/api.client";

import { ProductSearchQuery, ProductSearchQuerySchema, ProductSearchResponse } from "./search.type";
import { PaginationResponse } from "../api.type";

/**
 * 검색
 */
export const getSearch = async (query: ProductSearchQuery) => {
	// const searchQuery = ProductSearchQuerySchema.parse(query);

	const response = await client.get<PaginationResponse<ProductSearchResponse>>("/search", {
		params: query,
	});

	return response.data;
};

/**
 * 자동완성 검색
 */
export const getAutocompleteSearch = async (keyword: string) => {
	const response = await client.get<{
		statusCode: number;
		message: string;
		data: Array<{
			type: "PRODUCT" | "ARTIST";
			id: number;
			productName?: string;
			productImageUrl?: string;
			stageName?: string;
			profileImageUrl?: string;
			slug?: string;
		}>;
	}>("/search/autocomplete", {
		params: { keyword },
	});

	return response.data;
};
