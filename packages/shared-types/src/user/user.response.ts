import { z } from "zod";
import { UserUpdatePayloadSchema } from "./user.request";

export const UserUpdateResponseSchema = z.object({
	id: z.number().describe("사용자 ID").default(1),
	message: z.string().describe("업데이트 결과 메시지").default("사용자 정보가 성공적으로 업데이트되었습니다"),
});

export const UserFindMeResponseSchema = UserUpdatePayloadSchema.omit({
	password: true,
	isAgreedTerms: true,
	isAgreedPrivacyPolicy: true,
	isAgreedEmail: true,
}).extend({
	agreedTermsAt: z.date().describe("이용약관 동의 일시"),
	agreedPrivacyPolicyAt: z.date().describe("개인정보처리방침 동의 일시"),
	agreedEmailAt: z.date().describe("이메일 수신 동의 일시"),
});

export type UserFindMeResponse = z.infer<typeof UserFindMeResponseSchema>;

export type UserUpdateResponse = z.infer<typeof UserUpdateResponseSchema>;
