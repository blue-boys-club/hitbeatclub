type QueryKey = Array<string | number | Record<string, string | number | Array<number | string>>>;

const QUERY_KEYS = {
	_root: [],
	user: {
		_key: ["user"],
		me: ["user", "me"],
	},
	products: {
		_key: ["products"],
		list: ["products", "list"],
		one: (productId: number): QueryKey => ["products", productId],
	},
	artist: {
		_key: ["artist"],
		detail: (id: number): QueryKey => ["artist", id],
		me: ["artist", "me"],
	},
	tag: {
		_key: ["tag"],
		list: ["tag", "list"],
		one: (id: number): QueryKey => ["tag", id],
	},
};

export { QUERY_KEYS };
