import { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import { ProductListQueryRequest } from "@hitbeatclub/shared-types/product";

type QueryKey = Array<
	string | number | boolean | Record<string, string | number | boolean | Array<number | string | boolean>>
>;

const QUERY_KEYS = {
	_root: [],
	user: {
		_key: ["user"],
		me: ["user", "me"],
	},
	products: {
		_key: ["products"],
		_list: ["products", "list"],
		list: (payload: Omit<ProductListQueryRequest, "page" | "limit">): QueryKey => ["products", "list", payload],
		infiniteList: (payload: Omit<ProductListQueryRequest, "page" | "limit">): QueryKey => [
			"products",
			"list",
			"infinite",
			payload,
		],
		one: (productId: number): QueryKey => ["products", productId],
		searchInfo: ["products", "searchInfo"],
		dashboard: ["products", "dashboard"],
	},
	artist: {
		_key: ["artist"],
		detail: (id: number): QueryKey => ["artist", id],
		me: ["artist", "me"],
		rawProductList: (id: number): QueryKey => ["artist", id, "productList"],
		productList: (id: number, payload: ArtistProductListQueryRequest): QueryKey => [
			"artist",
			id,
			"productList",
			payload,
		],
	},
	tag: {
		_key: ["tag"],
		list: ["tag", "list"],
		one: (id: number): QueryKey => ["tag", id],
	},
};

export { QUERY_KEYS };
