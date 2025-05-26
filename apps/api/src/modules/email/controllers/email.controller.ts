import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { EmailSendDoc } from "src/modules/email/docs/email.doc";
import { EmailSendDto } from "src/modules/email/dtos/email.send.dto";
import { EmailService } from "src/modules/email/services/email.service";
import { ENUM_EMAIL } from "src/modules/email/constants/email.enum.constant";
import { AuthService } from "src/modules/auth/auth.service";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { EMAIL_SEND_ERROR } from "../email.error";

@ApiTags("modules.email")
@Controller({
	version: "1",
	path: "/email",
})
export class EmailController {
	constructor(
		private readonly emailService: EmailService,
		private readonly authService: AuthService,
		private readonly helperHashService: HelperHashService,
	) {}

	@EmailSendDoc()
	@Post("/")
	async sendEmail(@Body() body: EmailSendDto) {
		try {
			const { type, to } = body;

			const hashInfo = this.authService.createHashInfo(type, to);

			switch (type) {
				case ENUM_EMAIL.CHANGE_PASSWORD:
					await this.emailService.sendChangePassword(to, hashInfo.salt);
					break;
				case ENUM_EMAIL.SIGN_UP:
					await this.emailService.sendSignUp({ to }, { salt: hashInfo.salt });
					break;
				default:
					break;
			}
		} catch (e) {
			if (e?.response) {
				throw new BadRequestException(e.response);
			}

			throw new BadRequestException({
				...EMAIL_SEND_ERROR,
				message: e.message,
			});
		}
	}
}
