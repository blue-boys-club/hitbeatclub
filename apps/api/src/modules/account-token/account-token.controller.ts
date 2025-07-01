import { Controller, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AccountTokenService } from "./account-token.service";
import { IResponse } from "~/common/response/interfaces/response.interface";

@Controller("account-tokens/cron")
@ApiTags("account-token")
export class AccountTokenCronController {
	constructor(
		private readonly accountTokenService: AccountTokenService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * 휴지 토큰 soft-delete를 수동으로 실행합니다.
	 */
	@Post("cleanup")
	@ApiOperation({ summary: "휴지 토큰 정리 크론 수동 실행" })
	async triggerCleanup(@Query("secret") secret: string): Promise<IResponse<{ count: number }>> {
		if (secret !== this.configService.get<string>("app.cronSecret")) {
			throw new UnauthorizedException();
		}

		const { count } = await this.accountTokenService.softDeleteGarbage(30);
		return {
			statusCode: 200,
			message: "trigger account token cleanup succeeded",
			data: { count },
		};
	}
}
