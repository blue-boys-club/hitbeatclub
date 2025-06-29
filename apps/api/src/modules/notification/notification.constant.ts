import { NotificationType } from "@hitbeatclub/shared-types";

/**
 * 알림 타입별 메시지 템플릿
 */
export const NOTIFICATION_MESSAGE_TEMPLATE: Record<NotificationType, string> = {
	// 1. 거래 알림
	BUYER_TRANSACTION_SUCCESS: "{artistName}의 비트를 성공적으로 구매했습니다!",
	SELLER_TRANSACTION_SUCCESS: "{buyerName}님이 당신의 '{beatName}' 비트를 구매했습니다!",

	// 2. 정산 / 결제 알림
	MONTHLY_SETTLEMENT_PAYMENT_SUCCESS: "이번 달 정산 금액 {amount}원이 지급되었습니다.",
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED: "다음 달 구독 결제 {amount}원이 완료되었습니다.",
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING: "다음 달 구독 결제가 {daysLeft}일 후에 진행됩니다.",

	// 3. 팔로우 & 좋아요
	SELLER_FOLLOW_NEW: "{userName}님이 당신을 팔로우했습니다.",
	SELLER_FOLLOW_BEAT_LIKE: "당신의 비트 '{beatName}'에 좋아요가 달렸어요!",

	// 4. 업로드 관련 알림
	UPLOAD_BEAT_SUCCESS: "업로드한 비트 '{beatName}'가 정상 등록되었습니다.",

	// 5. 공지 및 이벤트
	COMMON_EVENT_BEAT_UPLOAD: "신규 등록 이벤트 안내: 비트 업로드 판매가 가능해졌어요!",
	COMMON_EVENT_SOUND_BLOCK: "이벤트 알림: 커뮤니티 참가 접수 중!",

	// 6. 신고 및 차단 관련
	REPORT_PROCESSED: "귀하의 콘텐츠에 대한 신고가 접수되었습니다. 현재 검토 중입니다.",
	REPORT_RESOLVED: "콘텐츠 이의제기 및 표절 의심 콘텐츠로 분류되었습니다.",

	// 7. 보상 및 챌린지 알림
	EVENT_FRIEND_INVITE_3M: "친구 초대 보상으로 3개월 무료 이용권이 지급되었습니다!",
};

/**
 * 알림 타입별 제목 템플릿
 */
export const NOTIFICATION_TITLE_TEMPLATE: Record<NotificationType, string> = {
	// 1. 거래 알림
	BUYER_TRANSACTION_SUCCESS: "비트 구매 완료",
	SELLER_TRANSACTION_SUCCESS: "비트 판매 완료",

	// 2. 정산 / 결제 알림
	MONTHLY_SETTLEMENT_PAYMENT_SUCCESS: "정산 금액 지급 완료",
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED: "구독 결제 완료",
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING: "구독 결제 예정",

	// 3. 팔로우 & 좋아요
	SELLER_FOLLOW_NEW: "새로운 팔로워",
	SELLER_FOLLOW_BEAT_LIKE: "비트 좋아요",

	// 4. 업로드 관련 알림
	UPLOAD_BEAT_SUCCESS: "비트 업로드 완료",

	// 5. 공지 및 이벤트
	COMMON_EVENT_BEAT_UPLOAD: "이벤트 안내",
	COMMON_EVENT_SOUND_BLOCK: "이벤트 알림",

	// 6. 신고 및 차단 관련
	REPORT_PROCESSED: "신고 접수",
	REPORT_RESOLVED: "신고 처리 완료",

	// 7. 보상 및 챌린지 알림
	EVENT_FRIEND_INVITE_3M: "보상 지급",
};

/**
 * 메시지 템플릿에 데이터를 바인딩하는 함수
 */
export function bindNotificationMessage(
	type: NotificationType,
	data: Record<string, string | number> = {},
): { title: string; content: string } {
	const titleTemplate = NOTIFICATION_TITLE_TEMPLATE[type];
	const contentTemplate = NOTIFICATION_MESSAGE_TEMPLATE[type];

	// 템플릿의 {변수명}을 실제 데이터로 치환
	const title = titleTemplate.replace(/\{(\w+)\}/g, (match, key) => {
		return data[key]?.toString() || match;
	});

	const content = contentTemplate.replace(/\{(\w+)\}/g, (match, key) => {
		return data[key]?.toString() || match;
	});

	return { title, content };
}

/**
 * 알림 카테고리
 */
export const NOTIFICATION_CATEGORY = {
	TRANSACTION: "TRANSACTION", // 거래 관련
	SETTLEMENT: "SETTLEMENT", // 정산/결제 관련
	SOCIAL: "SOCIAL", // 팔로우/좋아요 관련
	UPLOAD: "UPLOAD", // 업로드 관련
	EVENT: "EVENT", // 공지/이벤트 관련
	REPORT: "REPORT", // 신고/차단 관련
	REWARD: "REWARD", // 보상/챌린지 관련
} as const;

/**
 * 알림 타입별 카테고리 매핑
 */
export const NOTIFICATION_TYPE_CATEGORY: Record<NotificationType, string> = {
	BUYER_TRANSACTION_SUCCESS: NOTIFICATION_CATEGORY.TRANSACTION,
	SELLER_TRANSACTION_SUCCESS: NOTIFICATION_CATEGORY.TRANSACTION,
	MONTHLY_SETTLEMENT_PAYMENT_SUCCESS: NOTIFICATION_CATEGORY.SETTLEMENT,
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED: NOTIFICATION_CATEGORY.SETTLEMENT,
	NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING: NOTIFICATION_CATEGORY.SETTLEMENT,
	SELLER_FOLLOW_NEW: NOTIFICATION_CATEGORY.SOCIAL,
	SELLER_FOLLOW_BEAT_LIKE: NOTIFICATION_CATEGORY.SOCIAL,
	UPLOAD_BEAT_SUCCESS: NOTIFICATION_CATEGORY.UPLOAD,
	COMMON_EVENT_BEAT_UPLOAD: NOTIFICATION_CATEGORY.EVENT,
	COMMON_EVENT_SOUND_BLOCK: NOTIFICATION_CATEGORY.EVENT,
	REPORT_PROCESSED: NOTIFICATION_CATEGORY.REPORT,
	REPORT_RESOLVED: NOTIFICATION_CATEGORY.REPORT,
	EVENT_FRIEND_INVITE_3M: NOTIFICATION_CATEGORY.REWARD,
};

export type NotificationCategory = (typeof NOTIFICATION_CATEGORY)[keyof typeof NOTIFICATION_CATEGORY];
