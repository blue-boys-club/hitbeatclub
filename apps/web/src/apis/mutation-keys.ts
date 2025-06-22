export const MUTATION_KEYS = {
	auth: {
		signup: {
			checkEmail: ["auth", "signup", "checkEmail"],
			join: {
				email: ["auth", "signup", "join", "email"],
				social: ["auth", "signup", "join", "social"],
			},
		},
		login: {
			google: ["auth", "login", "google"],
			email: ["auth", "login", "email"],
			naver: ["auth", "login", "naver"],
			kakao: ["auth", "login", "kakao"],
			// apple: ["auth", "login", "apple"],
		},

		findEmail: ["auth", "findEmail"],
		resetPassword: ["auth", "resetPassword"],
	},
	email: {
		sendChangePassword: ["email", "sendChangePassword"],
	},
	product: {
		create: ["product", "create"],
		update: (productId: number) => ["product", "update", productId],
		delete: (productId: number) => ["product", "delete", productId],
		uploadFile: ["product", "uploadFile"],

		getFileDownloadLink: ["product", "getFileDownloadLink"],
	},
	artist: {
		create: ["artist", "create"],
		update: ["artist", "update"],
		uploadProfile: ["artist", "uploadProfile"],
	},
	cart: {
		create: ["cart", "create"],
		delete: ["cart", "delete"],
		update: ["cart", "update"],
	},
	payment: {
		createOrder: ["payment", "createOrder"],
		completePayment: ["payment", "completePayment"],
		getOrder: ["payment", "getOrder"],
		getUserOrders: ["payment", "getUserOrders"],
	},
	player: {
		startPlayer: ["player", "startPlayer"],
	},
};
