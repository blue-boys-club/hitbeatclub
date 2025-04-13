import { getProduct, getProductList } from "../product.api";

export const getProductListQueryOption = () => {
	return {
		queryKey: ["products", "list"],
		queryFn: () => getProductList(),
	};
};

export const getProductQueryOption = (productId: number) => {
	return {
		queryKey: ["products", productId],
		queryFn: () => getProduct(productId),
	};
};
