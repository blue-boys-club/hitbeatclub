import { registerAs } from "@nestjs/config";
// import { version } from "package.json";
import { ENUM_APP_ENVIRONMENT, ENUM_APP_TIMEZONE } from "~/app/constants/app.enum.constant";

const isDeployed = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.ECS_CONTAINER_METADATA_URI;

export default registerAs(
	"app",
	(): Record<string, any> => ({
		name: process.env.APP_NAME ?? "ack",
		env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,
		timezone: process.env.APP_TIMEZONE ?? ENUM_APP_TIMEZONE.ASIA_SEOUL,
		// repoVersion: version,
		repoVersion: process.env.npm_package_version,
		globalPrefix: process.env.APP_ENV === ENUM_APP_ENVIRONMENT.PRODUCTION ? "v1" : "v1",
		urlVersion: {
			prefix: "v",
			version: process.env.URL_VERSION ?? "1",
		},

		deployed: isDeployed,
		enableTrustProxy: process.env.ENABLE_TRUST_PROXY === "true" || isDeployed,
		cronSecret: process.env.CRON_SECRET ?? "qwe123!@#",
	}),
);
