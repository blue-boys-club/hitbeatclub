import { getProduct, getProductList } from "@/apis/product/product.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const getProductListQueryOption = () => {
	return {
		queryKey: QUERY_KEYS.products.list,
		queryFn: () => getProductList(),
	};
};

export const getProductQueryOption = (productId: number) => {
	return {
		queryKey: QUERY_KEYS.products.one(productId),
		queryFn: () => getProduct(productId),
	};
};
