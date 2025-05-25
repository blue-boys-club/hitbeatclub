import { z } from "zod";

export const UserUpdateResponseSchema = z.object({
	id: z.number().describe("사용자 ID").default(1),
	message: z.string().describe("업데이트 결과 메시지").default("사용자 정보가 성공적으로 업데이트되었습니다"),
});

export type UserUpdateResponse = z.infer<typeof UserUpdateResponseSchema>;
