import { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import { ProductListQueryRequest } from "@hitbeatclub/shared-types/product";
import { UserLikeProductListRequest } from "@hitbeatclub/shared-types/user";
import { UserFollowedArtistListPayload } from "./user/user.type";

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
};

export { QUERY_KEYS };
