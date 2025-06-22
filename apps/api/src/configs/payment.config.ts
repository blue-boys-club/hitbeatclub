import { registerAs } from "@nestjs/config";

export default registerAs(
	"payment",
	(): Record<string, any> => ({
		portone: {
			webhook: {
				secret: process.env.PAYMENT_PORTONE_WEBHOOK_SECRET,
			},
			api: {
				key: process.env.PAYMENT_PORTONE_API_KEY,
			},
		},
	}),
);
