type QueryKey = Array<string | number | Record<string, string | number | Array<number | string>>>;

const QUERY_KEYS = {
	_root: [],
	user: {
		_key: ["user"],
		info: ["user", "info"],
		one: (userId: number): QueryKey => ["user", userId],
	},
	products: {
		_key: ["products"],
		list: ["products", "list"],
		one: (productId: number): QueryKey => ["products", productId],
	},
};

const MUTATION_KEYS = {
	product: {
		create: ["product", "create"],
		update: (productId: number): QueryKey => ["product", "update", productId],
		delete: (productId: number): QueryKey => ["product", "delete", productId],
	},
};

export { QUERY_KEYS, MUTATION_KEYS };
