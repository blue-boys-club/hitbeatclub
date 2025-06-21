import { z } from "zod";
import { CommonResponsePagingSchema } from "../common/common.response";

export const PlayerListResponseSchema = z.object({
	id: z.number().describe("플레이리스트 ID"),
	productId: z.number().describe("상품 ID"),
	productName: z.string().describe("상품 이름"),
	seller: z.object({
		id: z.number().describe("판매자 ID"),
		stageName: z.string().describe("판매자 닉네임"),
		profileImageUrl: z.string().describe("판매자 프로필 이미지"),
	}),
	audioFile: z.object({
		id: z.number().describe("오디오 파일 ID"),
		url: z.string().describe("오디오 파일 URL"),
		originName: z.string().describe("오디오 파일 원본 이름"),
	}),
	coverImage: z.object({
		id: z.number().describe("커버 이미지 ID"),
		url: z.string().describe("커버 이미지 URL"),
		originName: z.string().describe("커버 이미지 원본 이름"),
	}),
});

export const PlayerHistoryResponseSchema = CommonResponsePagingSchema.extend({
	data: z.array(PlayerListResponseSchema),
});

export type PlayerListResponse = z.infer<typeof PlayerListResponseSchema>;
export type PlayerHistoryResponse = z.infer<typeof PlayerHistoryResponseSchema>;
