import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestApplication } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";

export default function (app: NestApplication | NestExpressApplication) {
	const configService = app.get(ConfigService);
	const env: string = configService.get<string>("app.env");
	const logger = new Logger();

	const docName: string = configService.get<string>("doc.name");
	const docDesc: string = configService.get<string>("doc.description");
	const docVersion: string = configService.get<string>("doc.version");
	const docPrefix: string = configService.get<string>("doc.prefix");

	// nestjs-zod Swagger 패치 적용
	patchNestJsSwagger();

	// if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
	const isProduction = env === "production";
	if (!isProduction) {
		const documentBuild = new DocumentBuilder()
			.setTitle(docName)
			.setDescription(docDesc)
			.setVersion(docVersion)
			.addServer("/")
			.addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "accessToken")
			.addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "google")
			.addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "kakao")
			.addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "naver")
			// .addApiKey(
			//     { type: 'apiKey', in: 'header', name: 'x-api-key' },
			//     'xApiKey'
			// )
			// .addBearerAuth(
			//     { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			//     'apple'
			// )
			// .addBearerAuth(
			//     { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			//     'refreshToken'
			// )
			.build();

		const document = SwaggerModule.createDocument(app, documentBuild, {
			deepScanRoutes: true,
		});

		// writeFileSync("swagger.json", JSON.stringify(document));
		SwaggerModule.setup(docPrefix, app, document, {
			jsonDocumentUrl: `${docPrefix}/json`,
			yamlDocumentUrl: `${docPrefix}/yaml`,
			explorer: true,
			customSiteTitle: docName,
			swaggerOptions: {
				docExpansion: "none",
				persistAuthorization: true,
				displayOperationId: true,
				operationsSorter: "method",
				tagsSorter: "alpha",
				tryItOutEnabled: true,
				filter: true,
				deepLinking: true,
			},
		});

		logger.log(`==========================================================`);

		logger.log(`Docs will serve on ${docPrefix}`, "NestApplication");

		logger.log(`==========================================================`);
	}
}
