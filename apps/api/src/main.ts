import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { useContainer } from "class-validator";

// dayjs 설정
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const corsOptions: CorsOptions = {
		origin: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	};

	app.enableCors(corsOptions);

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.locale("ko");

	app.setGlobalPrefix("v1", {
		exclude: [{ path: "docs", method: RequestMethod.GET }],
	});
	const isProduction = process.env.NODE_ENV.includes("prod") ? true : false;
	// 로컬 & 개발환경에서만 Swagger 셋팅
	if (true) {
		const config = new DocumentBuilder()
			.setTitle("Backend Api Docs")
			.setDescription("Backend user api")
			.setVersion("1.0")
			.addBearerAuth()
			.addTag("admin.auth", "Admin Auth")
			.addTag("admin.public.auth", "Admin Public Auth")
			.addTag("admin.user", "Admin User")
			.addTag("admin.file", "Admin File")
			.build();

		const document = SwaggerModule.createDocument(app as any, config);
		SwaggerModule.setup("v1/docs", app as any, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});
	}

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	await app.listen(4000);
}
bootstrap();
