import { LogLevel, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from "@nestjs/throttler";
import {
	JsonBodyParserMiddleware,
	RawBodyParserMiddleware,
	TextBodyParserMiddleware,
	UrlencodedBodyParserMiddleware,
} from "~/app/middlewares/body-parser.middleware";
import { CorsMiddleware } from "~/app/middlewares/cors.middleware";
import { HelmetMiddleware } from "~/app/middlewares/helmet.middleware";
import { ResponseTimeMiddleware } from "~/app/middlewares/response-time.middleware";
import { UrlVersionMiddleware } from "~/app/middlewares/url-version.middleware";

@Module({
	controllers: [],
	exports: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
	imports: [
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
				throttlers: [
					{
						ttl: config.get("middleware.throttle.ttl"),
						limit: config.get("middleware.throttle.limit"),
					},
				],
			}),
		}),
	],
})
export class AppMiddlewareModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(
				HelmetMiddleware,
				JsonBodyParserMiddleware,
				TextBodyParserMiddleware,
				RawBodyParserMiddleware,
				UrlencodedBodyParserMiddleware,
				CorsMiddleware,
				UrlVersionMiddleware,
				ResponseTimeMiddleware,
			)
			.forRoutes("*");
	}
}
