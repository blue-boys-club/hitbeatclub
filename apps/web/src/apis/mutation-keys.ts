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
	product: {
		create: ["product", "create"],
		update: (productId: number) => ["product", "update", productId],
		delete: (productId: number) => ["product", "delete", productId],
	},
	artist: {
		create: ["artist", "create"],
		update: ["artist", "update"],
	},
};
