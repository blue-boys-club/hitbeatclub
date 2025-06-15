import { z } from "zod";

export const EmailTypeEnum = z.enum(["SIGN_UP", "CHANGE_PASSWORD", "WElCOME", "EMAIL"]);
export type EmailType = z.infer<typeof EmailTypeEnum>;

export const EmailSendPayloadSchema = z.object({
	to: z.string().email().describe("이메일").default("recipient@example.com"),
	type: EmailTypeEnum.default("CHANGE_PASSWORD"),
});

export type EmailSendPayload = z.infer<typeof EmailSendPayloadSchema>;
