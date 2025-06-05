import { registerAs } from "@nestjs/config";
import ms, { StringValue } from "ms";

export default registerAs(
	"auth",
	(): Record<string, any> => ({
		jwt: {
			accessToken: {
				secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? "123456",
				expirationTime: ms((process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED ?? "7d") as StringValue) / 1000, // 1 hours
			},
			refreshToken: {
				secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ?? "123456000",
				expirationTime: ms((process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED ?? "182d") as StringValue) / 1000,
			},
			subject: process.env.AUTH_JWT_SUBJECT ?? "ackDevelopment",
			audience: process.env.AUTH_JWT_AUDIENCE ?? "https://ssync.team",
			issuer: process.env.AUTH_JWT_ISSUER ?? "ack",
			prefixAuthorization: "Bearer",
		},
		password: {
			attempt: false,
			maxAttempt: 5,
			saltLength: 8,
			expiredIn: ms("182d"), // 182 days
		},
		email: {
			saltLength: 8,
			expiredIn: ms("1d"), // 182 days
		},
		signUp: {
			saltLength: 8,
			expiredIn: ms("1d"), // 1 days
		},
		google: {
			clientId: process.env.AUTH_SOCIAL_GOOGLE_CLIENT_ID,
			clientSecret: process.env.AUTH_SOCIAL_GOOGLE_CLIENT_SECRET,
		},
		kakao: {
			clientId: process.env.AUTH_SOCIAL_KAKAO_CLIENT_ID,
			clientSecret: process.env.AUTH_SOCIAL_KAKAO_CLIENT_SECRET,
			redirectUri: process.env.AUTH_SOCIAL_KAKAO_REDIRECT_URI,
		},
		naver: {
			clientId: process.env.AUTH_SOCIAL_NAVER_CLIENT_ID,
			clientSecret: process.env.AUTH_SOCIAL_NAVER_CLIENT_SECRET,
		},
	}),
);
