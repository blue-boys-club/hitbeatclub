import { z } from "zod";

/**
 * 알림 타입 enum
 */
export const notificationTypeEnum = z.enum([
	// 1. 거래 알림
	"BUYER_TRANSACTION_SUCCESS", // "OO의 비트를 성공적으로 구매했습니다!"
	"SELLER_TRANSACTION_SUCCESS", // "OO의 비트를 성공적으로 판매했습니다!"

	// 2. 정산 / 결제 알림
	"MONTHLY_SETTLEMENT_PAYMENT_SUCCESS", // "이번 달 정산 금액이 지급되었습니다."
	"NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED", // "다음 달 구독 결제가 완료되었습니다."
	"NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING", // "다음 달 구독 결제가 곧 진행됩니다."

	// 3. 팔로우 & 좋아요
	"SELLER_FOLLOW_NEW", // "OO님이 당신을 팔로우했습니다."
	"SELLER_FOLLOW_BEAT_LIKE", // "당신의 비트 'XXXX'에 좋아요가 달렸어요!"

	// 4. 업로드 관련 알림
	"UPLOAD_BEAT_SUCCESS", // "업로드한 비트가 정상 등록되었습니다."

	// 5. 공지 및 이벤트
	"COMMON_EVENT_BEAT_UPLOAD", // "신규 등록 이벤트 안내: 비트 업로드 판매가 가능해졌어요!"
	"COMMON_EVENT_SOUND_BLOCK", // "이벤트 알림: 커뮤니티 참가 접수 중!"

	// 6. 신고 및 차단 관련
	"REPORT_PROCESSED", // "귀하의 콘텐츠에 대한 신고가 접수되었습니다. 현재 검토 중입니다."
	"REPORT_RESOLVED", // "콘텐츠 이의제기 및 표절 의심 콘텐츠로 분류되었습니다."

	// 7. 보상 및 챌린지 알림
	"EVENT_FRIEND_INVITE_3M", // "친구 초대 보상으로 3개월 무료 이용권이 지급되었습니다!"
]);

export const NotificationCreateSchema = z.object({
	type: notificationTypeEnum.describe("알림 타입"),
	receiverId: z.number().optional().describe("알림 수신자 ID").nullable(),
	templateData: z
		.record(z.union([z.string(), z.number()]))
		.describe("템플릿 데이터")
		.optional(),
});

export const NotificationListQuerySchema = z.object({
	limit: z.coerce.number().optional().describe("조회할 개수 (기본: 20)"),
	offset: z.coerce.number().optional().describe("건너뛸 개수 (기본: 0)"),
});

export const NotificationUpdateSchema = z
	.object({
		isRead: z.boolean().describe("읽음 여부").optional(),
	})
	.strict();

export const NotificationMarkAsReadSchema = z.object({
	ids: z.array(z.number()).describe("읽음 처리할 알림 ID 목록"),
});

export type NotificationType = z.infer<typeof notificationTypeEnum>;
export type NotificationCreateRequest = z.infer<typeof NotificationCreateSchema>;
export type NotificationUpdateRequest = z.infer<typeof NotificationUpdateSchema>;
export type NotificationMarkAsReadRequest = z.infer<typeof NotificationMarkAsReadSchema>;
export type NotificationListQueryRequest = z.infer<typeof NotificationListQuerySchema>;
