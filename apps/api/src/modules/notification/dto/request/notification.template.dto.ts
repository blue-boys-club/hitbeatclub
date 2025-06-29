import { IsNotEmpty, IsOptional, IsObject, IsNumber, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { NotificationType } from "@hitbeatclub/shared-types";

export class NotificationTemplateDto {
	@ApiProperty({
		example: "BUYER_TRANSACTION_SUCCESS",
		description: "알림 타입",
		enum: [
			"BUYER_TRANSACTION_SUCCESS",
			"SELLER_TRANSACTION_SUCCESS",
			"MONTHLY_SETTLEMENT_PAYMENT_SUCCESS",
			"NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED",
			"NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING",
			"SELLER_FOLLOW_NEW",
			"SELLER_FOLLOW_BEAT_LIKE",
			"UPLOAD_BEAT_SUCCESS",
			"COMMON_EVENT_BEAT_UPLOAD",
			"COMMON_EVENT_SOUND_BLOCK",
			"REPORT_PROCESSED",
			"REPORT_RESOLVED",
			"EVENT_FRIEND_INVITE_3M",
		],
	})
	@IsNotEmpty()
	type: NotificationType;

	@ApiProperty({
		example: { artistName: "홍길동", beatName: "Cool Beat" },
		description: "템플릿에 사용할 데이터 (key-value 형태)",
	})
	@IsOptional()
	@IsObject()
	templateData?: Record<string, string | number>;

	@ApiPropertyOptional({
		example: 1,
		description: "발송자 ID (선택사항)",
	})
	@IsOptional()
	@IsNumber()
	senderId?: number;
}

export class NotificationBatchTemplateDto {
	@ApiProperty({
		example: [1, 2, 3],
		description: "알림을 받을 사용자 ID 배열",
	})
	@IsNotEmpty()
	@IsArray()
	@Type(() => Number)
	userIds: number[];

	@ApiProperty({
		example: "BUYER_TRANSACTION_SUCCESS",
		description: "알림 타입",
		enum: [
			"BUYER_TRANSACTION_SUCCESS",
			"SELLER_TRANSACTION_SUCCESS",
			"MONTHLY_SETTLEMENT_PAYMENT_SUCCESS",
			"NEXT_MONTH_SUBSCRIPTION_PAYMENT_COMPLETED",
			"NEXT_MONTH_SUBSCRIPTION_PAYMENT_UPCOMING",
			"SELLER_FOLLOW_NEW",
			"SELLER_FOLLOW_BEAT_LIKE",
			"UPLOAD_BEAT_SUCCESS",
			"COMMON_EVENT_BEAT_UPLOAD",
			"COMMON_EVENT_SOUND_BLOCK",
			"REPORT_PROCESSED",
			"REPORT_RESOLVED",
			"EVENT_FRIEND_INVITE_3M",
		],
	})
	@IsNotEmpty()
	type: NotificationType;

	@ApiProperty({
		example: { artistName: "홍길동", beatName: "Cool Beat" },
		description: "템플릿에 사용할 데이터 (key-value 형태)",
	})
	@IsOptional()
	@IsObject()
	templateData?: Record<string, string | number>;

	@ApiPropertyOptional({
		example: 1,
		description: "발송자 ID (선택사항)",
	})
	@IsOptional()
	@IsNumber()
	senderId?: number;
}
