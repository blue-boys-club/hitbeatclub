import { z } from "zod";
import { notificationTypeEnum } from "./notification.request";

export const NotificationResponseSchema = z.object({
	id: z.number().describe("알림 ID").default(1),
	userId: z.number().describe("사용자 ID").default(1),
	type: notificationTypeEnum.describe("알림 타입").default("BUYER_TRANSACTION_SUCCESS"),
	title: z.string().describe("알림 제목").default("새로운 알림"),
	content: z.string().describe("알림 내용").default("새로운 알림이 도착했습니다."),
	isRead: z.boolean().describe("읽음 여부").default(false),
	readAt: z.string().datetime().nullable().describe("읽은 시간").default(null),
	createdAt: z.string().datetime().describe("생성 일시").default("2024-01-01T00:00:00Z"),
	updatedAt: z.string().datetime().describe("수정 일시").default("2024-01-01T00:00:00Z"),
});

export const NotificationListResponseSchema = z.array(NotificationResponseSchema);
export const NotificationDetailResponseSchema = NotificationResponseSchema;

export const NotificationStatsResponseSchema = z.object({
	totalCount: z.number().describe("총 알림 수").default(0),
	unreadCount: z.number().describe("읽지 않은 알림 수").default(0),
});

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
export type NotificationDetailResponse = z.infer<typeof NotificationDetailResponseSchema>;
export type NotificationStatsResponse = z.infer<typeof NotificationStatsResponseSchema>;
