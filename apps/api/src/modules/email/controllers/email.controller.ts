import { BadRequestException, Body, Controller, Post, Get, Logger } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import { EmailSendDoc } from "src/modules/email/docs/email.doc";
import { EmailSendDto } from "src/modules/email/dtos/email.send.dto";
import { EmailService } from "src/modules/email/services/email.service";
import { EmailType } from "@hitbeatclub/shared-types";
import { AuthService } from "src/modules/auth/auth.service";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { AccountTokenService } from "src/modules/account-token/account-token.service";
import { UserService } from "src/modules/user/user.service";
import { TokenPurpose } from "@prisma/client";

@ApiTags("email")
@Controller({
	version: "1",
	path: "/email",
})
export class EmailController {
	private readonly logger = new Logger(EmailController.name);

	constructor(
		private readonly emailService: EmailService,
		private readonly authService: AuthService,
		private readonly helperHashService: HelperHashService,
		private readonly accountTokenService: AccountTokenService,
		private readonly userService: UserService,
	) {}

	// 이메일 타입과 토큰 목적 매핑
	private getTokenPurpose(emailType: EmailType): TokenPurpose {
		switch (emailType) {
			case "CHANGE_PASSWORD":
				return TokenPurpose.PASSWORD_RESET;
			case "SIGN_UP":
				return TokenPurpose.EMAIL_VERIFICATION;
			default:
				throw new BadRequestException(`지원하지 않는 이메일 타입입니다: ${emailType}`);
		}
	}

	@EmailSendDoc()
	@Post("/")
	async sendEmail(@Body() body: EmailSendDto) {
		try {
			const { type, to } = body;
			this.logger.log(`Sending email of type ${type} to ${to}`);

			// 사용자 조회
			const user = await this.userService.findByEmail(to);
			if (!user) {
				throw new BadRequestException("해당 이메일의 사용자를 찾을 수 없습니다.");
			}

			// 토큰 목적 결정
			const tokenPurpose = this.getTokenPurpose(type);

			// TTL 설정 (분 단위)
			const ttlMinutes = type === "CHANGE_PASSWORD" ? 30 : 60; // 비밀번호 재설정: 30분, 이메일 인증: 60분

			// AccountToken 발급
			const accountToken = await this.accountTokenService.issueToken(BigInt(user.id), tokenPurpose, ttlMinutes);

			// 기존 해시 정보도 생성 (호환성을 위해)
			const hashInfo = this.authService.createHashInfo(type, to);

			switch (type) {
				case "CHANGE_PASSWORD": {
					const passwordResult = await this.emailService.sendChangePassword(to, accountToken.token);
					if (!passwordResult) {
						throw new BadRequestException("비밀번호 변경 이메일 발송에 실패했습니다.");
					}
					break;
				}
				// case "SIGN_UP": {
				// 	const signUpResult = await this.emailService.sendSignUp(to, accountToken.token);
				// 	if (!signUpResult) {
				// 		throw new BadRequestException("가입 확인 이메일 발송에 실패했습니다.");
				// 	}
				// 	break;
				// }
				default:
					throw new BadRequestException("지원하지 않는 이메일 타입입니다.");
			}

			this.logger.log(`Email sent successfully with token: ${type} to ${to}, token: ${accountToken.token}`);
			return {
				success: true,
				message: "이메일이 성공적으로 발송되었습니다.",
				type,
				to,
				tokenId: accountToken.id.toString(),
			};
		} catch (e) {
			this.logger.error(`Failed to send email: ${e.message}`, e.stack);

			if (e?.response) {
				throw new BadRequestException(e.response);
			}

			throw new BadRequestException({
				message: e.message || "이메일 발송 중 오류가 발생했습니다.",
			});
		}
	}

	@Get("/templates/initialize")
	@ApiOperation({
		summary: "이메일 템플릿 초기화",
		description: "모든 이메일 템플릿을 AWS SES에 생성합니다.",
	})
	@ApiResponse({
		status: 200,
		description: "템플릿 초기화 성공",
		schema: {
			type: "object",
			properties: {
				success: { type: "boolean" },
				message: { type: "string" },
			},
		},
	})
	async initializeTemplates() {
		try {
			this.logger.log("Initializing email templates...");
			await this.emailService.initializeTemplates();

			return {
				success: true,
				message: "이메일 템플릿이 성공적으로 초기화되었습니다.",
			};
		} catch (e) {
			this.logger.error(`Failed to initialize templates: ${e.message}`, e.stack);

			throw new BadRequestException({
				message: e.message || "템플릿 초기화 중 오류가 발생했습니다.",
			});
		}
	}
}
