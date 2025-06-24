import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import "dayjs/locale/ko";
import { Logger, VersioningType } from "@nestjs/common";
import { useContainer } from "class-validator";
import swaggerInit from "~/swagger";
import { ConfigService } from "@nestjs/config";
import { Logger as PinoLogger } from "nestjs-pino";
import { ZodValidationPipe } from "nestjs-zod";

async function bootstrap() {
	const logger = new Logger();
	const app: NestApplication = await NestFactory.create(AppModule, {
		bufferLogs: true,
		rawBody: true,
	});

	const configService = app.get(ConfigService);
	const databaseUri: string = configService.get<string>("database.uri");
	const env: string = configService.get<string>("app.env");
	const timezone: string = configService.get<string>("app.timezone");
	const host: string = configService.get<string>("app.http.host");
	const port: number = configService.get<number>("app.http.port");
	const globalPrefix: string = configService.get<string>("app.globalPrefix");
	const versioningPrefix: string = configService.get<string>("app.urlVersion.prefix");
	const version: string = configService.get<string>("app.urlVersion.version");

	// enable
	const httpEnable: boolean = configService.get<boolean>("app.http.enable");
	const versionEnable: string = configService.get<string>("app.urlVersion.enable");
	const jobEnable: boolean = configService.get<boolean>("app.jobEnable");

	process.env.NODE_ENV = env;
	process.env.TZ = timezone;

	// Global
	app.setGlobalPrefix(globalPrefix);

	// For Custom Validation
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	// Versioning
	if (versionEnable) {
		app.enableVersioning({
			type: VersioningType.URI,
			defaultVersion: version,
			prefix: versioningPrefix,
		});
	}

	swaggerInit(app);

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	// nestjs-zod validation pipe 사용
	app.useGlobalPipes(new ZodValidationPipe());

	app.useLogger(app.get(PinoLogger));

	await app.listen(4000);

	if (env === "development") {
		logger.log(`==========================================================`);

		logger.log(`Environment Variable`, "NestApplication");

		// Validate Env
		// const classEnv = plainToInstance(AppEnvDto, process.env);
		// const errors = await validate(classEnv);
		// if (errors.length > 0) {
		//     logger.log(errors, 'NestApplication');
		//     throw new Error('Env Variable Invalid');
		// }

		logger.log(JSON.parse(JSON.stringify(process.env)), "NestApplication");
	}

	logger.log(`==========================================================`);

	logger.log(`Job is ${jobEnable}`, "NestApplication");
	logger.log(`Http is ${httpEnable}, ${httpEnable ? "routes registered" : "no routes registered"}`, "NestApplication");
	logger.log(`Http versioning is ${versionEnable}`, "NestApplication");

	logger.log(`Http Server running on ${await app.getUrl()}`, "NestApplication");
	logger.log(`Database uri ${databaseUri}`, "NestApplication");

	logger.log(`==========================================================`);
}
bootstrap();
