import { z } from "zod";
import { ProductResponseSchema } from "../product/product.response";

export const CartListResponseSchema = z.array(
	z.object({
		id: z.number().describe("장바구니 ID").default(1),
		userId: z.number().describe("사용자 ID").default(1),
		selectedLicense: z.object({
			id: z.number().describe("라이선스 ID").default(1),
			type: z.string().describe("라이선스 타입").default("MASTER"),
			price: z.number().describe("가격").default(10000),
		}),
		createdAt: z.string().datetime().describe("생성 시간").default("2025-06-04T17:12:58.000Z"),
		updatedAt: z.string().datetime().describe("수정 시간").default("2025-06-04T17:12:58.000Z"),
		product: ProductResponseSchema.omit({
			description: true,
			isLiked: true,
			genres: true,
			tags: true,
			createdAt: true,
		}),
	}),
);

export type CartListResponse = z.infer<typeof CartListResponseSchema>;
