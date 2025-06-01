import { getProduct, getProductList } from "@/apis/product/product.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { queryOptions } from "@tanstack/react-query";

export const getProductListQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.list,
		queryFn: () => getProductList(),
		select: (response) => response.data,
	});
};

export const getProductQueryOption = (productId: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.one(productId),
		queryFn: () => getProduct(productId),
		select: (response) => response.data,
	});
};
