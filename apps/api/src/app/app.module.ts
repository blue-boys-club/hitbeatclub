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
						// DEBUG
						if (process.env.APP_DEBUG === "true") {
							return false;
						}

						// Deployed whatever reason
						if (!!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.ECS_CONTAINER_METADATA_URI) {
							// ignore health check
							if (
								req.url?.includes("/health") &&
								(req.headers["user-agent"]?.includes("ELB-HealthChecker") ||
									req.headers["user-agent"]?.includes("curl"))
							) {
								return true;
							}

							return false;
						}

						// Local development
						if (process.env.NODE_ENV === "development" && req.url) {
							return true;
						}
						return false;
					},
				},

				transport:
					process.env.NODE_ENV !== "production" &&
					!(!!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.ECS_CONTAINER_METADATA_URI)
						? { target: "pino-pretty" }
						: undefined,
			},
		}),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
