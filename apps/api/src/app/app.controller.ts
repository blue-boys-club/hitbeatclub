import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller()
export class AppController {
	constructor() {}

	// health check
	@Get("health")
	healthCheck(): { message: string; timestamp: string } {
		return {
			message: "ok",
			timestamp: new Date().toISOString(),
		};
	}
}
