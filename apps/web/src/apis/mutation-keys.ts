export const MUTATION_KEYS = {
	auth: {
		login: {
			google: ["auth", "login", "google"],
		},
	},
	attendances: {
		checkIn: ["attendances", "checkIn"],
		checkOut: ["attendances", "checkOut"],
	},
	projects: {
		create: ["projects", "create"],
		delete: ["projects", "delete"],
	},
	emails: {
		send: ["emails", "send"],
	},
};
