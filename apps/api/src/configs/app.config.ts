import { registerAs } from "@nestjs/config";
// import { version } from "package.json";
import { ENUM_APP_ENVIRONMENT, ENUM_APP_TIMEZONE } from "~/app/constants/app.enum.constant";

export default registerAs(
	"app",
	(): Record<string, any> => ({
		name: process.env.APP_NAME ?? "ack",
		env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,
		timezone: process.env.APP_TIMEZONE ?? ENUM_APP_TIMEZONE.ASIA_SINGAPORE,
		// repoVersion: version,
		repoVersion: process.env.npm_package_version,
		globalPrefix: process.env.APP_ENV === ENUM_APP_ENVIRONMENT.PRODUCTION ? "v1" : "v1",
		urlVersion: {
			prefix: "v",
			version: process.env.URL_VERSION ?? "1",
		},
	}),
);
