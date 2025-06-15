import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "../modules/auth/auth.module";
import { CommonModule } from "~/common/common.module";
import { AppMiddlewareModule } from "./app.middleware.module";
import { LoggerModule } from "nestjs-pino";
import { RouterModule } from "~/router/router.module";

@Module({
	imports: [
		AuthModule,
		CommonModule,
		AppMiddlewareModule,
		RouterModule.forRoot(),
		LoggerModule.forRoot({
			pinoHttp: {
				// add user context
				customProps: (req) => {
					const user = (
						req as unknown as {
							user?: { id: number; email: string };
						}
					).user;

					if (!user) {
						return {};
					}

					return {
						user: {
							userId: user.id,
							userEmail: user.email,
						},
					};
				},

				// remove bearer token
				redact: ["req.headers.authorization"],
				autoLogging: {
					ignore: (req) => {
						if (process.env.NODE_ENV === "development" && req.url) {
							return true;
						}
						return false;
					},
				},

				transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
			},
		}),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
