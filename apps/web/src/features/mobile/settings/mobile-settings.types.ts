import { ArtistUpdateSchema } from "@hitbeatclub/shared-types";
import { z } from "zod";

// UI 폼용 확장된 Zod 스키마 (ArtistUpdateSchema 기반)
export const MobileSettingsFormSchema = z.object({
	email: z.string().email("유효한 이메일 주소를 입력해주세요"),
	name: z.string().min(1, "이름을 입력해주세요"),
	phoneNumber: z
		.string()
		.min(1, "휴대전화 번호를 입력해주세요")
		.regex(/^010\d{8}$/, "올바른 휴대전화 번호 형식이 아닙니다 (예: 01012345678)"),
	stageName: z.string().min(1, "활동명을 입력해주세요").optional().or(z.literal("")),
	gender: z.enum(["M", "F"], { errorMap: () => ({ message: "성별을 선택해주세요" }) }).optional(),
	birthYear: z.string().min(4, "출생년도를 입력해주세요").optional(),
	birthMonth: z.string().min(1, "출생월을 입력해주세요").optional(),
	birthDay: z.string().min(1, "출생일을 입력해주세요").optional(),
	country: z.string().min(1, "국가를 선택해주세요").optional(),
	region: z.string().min(1, "지역을 선택해주세요").optional(),
	isAgreedEmail: z.boolean().optional(),
});

export type MobileSettingsFormData = z.infer<typeof MobileSettingsFormSchema>;
