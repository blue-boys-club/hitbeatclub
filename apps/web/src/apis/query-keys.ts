import { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import { PaginationRequest } from "@hitbeatclub/shared-types/common";
import { ProductListQueryRequest } from "@hitbeatclub/shared-types/product";
import { UserLikeProductListRequest } from "@hitbeatclub/shared-types/user";
import { UserFollowedArtistListPayload } from "./user/user.type";
import { ProductSearchQuery } from "./search/search.type";

type QueryKey = Array<
	string | number | boolean | Record<string, string | number | boolean | Array<number | string | boolean>>
>;

const QUERY_KEYS = {
	_root: [],
	user: {
		_key: ["user"],
		me: ["user", "me"],
		_likedProducts: ["user", "likedProducts"],
		likedProducts: (userId: number, payload: UserLikeProductListRequest): QueryKey => [
			"user",
			"likedProducts",
			userId,
			payload,
		],
		_infiniteLikedProducts: ["user", "likedProducts", "infinite"],
		infiniteLikedProducts: (userId: number, payload: UserLikeProductListRequest): QueryKey => [
			"user",
			"likedProducts",
			"infinite",
			userId,
			payload,
		],

		payment: {
			_key: ["user", "payment"],
			infiniteOrders: ["user", "payment", "orders", "infinite"],
			orders: (payload: PaginationRequest): QueryKey => ["user", "payment", "orders", payload],
			order: (orderNumber: number): QueryKey => ["user", "payment", "order", orderNumber],
		},
	},
	products: {
		_key: ["products"],
		_list: ["products", "list"],
		list: (payload: Omit<ProductListQueryRequest, "page" | "limit">): QueryKey => ["products", "list", payload],
		_infiniteList: ["products", "list", "infinite"],
		infiniteList: (payload: Omit<ProductListQueryRequest, "page" | "limit">): QueryKey => [
			"products",
			"list",
			"infinite",
			payload,
		],
		one: (productId: number): QueryKey => ["products", productId],
		searchInfo: ["products", "searchInfo"],
		dashboard: ["products", "dashboard"],
		fileDownloadLink: (productId: number, type: string): QueryKey => ["products", productId, "fileDownloadLink", type],
	},
	artist: {
		_key: ["artist"],
		detail: (id: number): QueryKey => ["artist", id],
		detailBySlug: (slug: string): QueryKey => ["artist", "slug", slug],
		me: ["artist", "me"],
		rawProductList: (id: number): QueryKey => ["artist", id, "productList"],
		productList: (id: number, payload: ArtistProductListQueryRequest): QueryKey => [
			"artist",
			id,
			"productList",
			payload,
		],
		productListBySlug: (slug: string, payload: ArtistProductListQueryRequest): QueryKey => [
			"artist",
			"slug",
			slug,
			"productList",
			payload,
		],
	},
	tag: {
		_key: ["tag"],
		list: ["tag", "list"],
		one: (id: number): QueryKey => ["tag", id],
	},
	cart: {
		_key: ["cart"],
		list: ["cart", "list"],
	},
	followedArtists: {
		_key: ["followedArtists"],
		list: (userId: number, payload: UserFollowedArtistListPayload) => ["followedArtists", "list", userId, payload],
		infiniteList: (userId: number, payload: UserFollowedArtistListPayload) => [
			"followedArtists",
			"list",
			"infinite",
			userId,
			payload,
		],
	},
	search: {
		_key: ["search"],
		_list: ["search", "list"],
		list: (payload: ProductSearchQuery): QueryKey => ["search", "list", payload],
		infiniteList: (payload: ProductSearchQuery): QueryKey => ["search", "list", "infinite", payload],
		autocomplete: (keyword: string): QueryKey => ["search", "autocomplete", keyword],
	},
	player: {
		_key: ["player"],
		infiniteList: ["player", "list", "infinite"],
		list: (payload: PaginationRequest): QueryKey => ["player", "list", payload],
	},
};

export { QUERY_KEYS };
