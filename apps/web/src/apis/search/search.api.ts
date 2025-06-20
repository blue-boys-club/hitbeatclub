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
