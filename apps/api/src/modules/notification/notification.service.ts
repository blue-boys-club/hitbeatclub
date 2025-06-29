import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { NotificationCreateDto } from "./dto/request/notification.create.dto";
import { NotificationUpdateDto } from "./dto/request/notification.update.dto";
import { NotificationMarkAsReadDto } from "./dto/request/notification.mark-read.dto";
import {
	NOTIFICATION_CREATE_ERROR,
	NOTIFICATION_FIND_ERROR,
	NOTIFICATION_NOT_FOUND_ERROR,
	NOTIFICATION_DETAIL_ERROR,
	NOTIFICATION_UPDATE_ERROR,
	NOTIFICATION_DELETE_ERROR,
	NOTIFICATION_MARK_READ_ERROR,
} from "./notification.error";
import { NotificationType } from "@hitbeatclub/shared-types";
import { bindNotificationMessage } from "./notification.constant";

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name);

	constructor(private readonly prisma: PrismaService) {}

	async create(reqUserId: number, createNotificationDto: NotificationCreateDto) {
		try {
			const dto = createNotificationDto as any; // 임시 타입 캐스팅 (shared-types 빌드 후 제거 필요)
			const { type, title, content, templateData, receiverId } = dto;

			// title과 content가 없으면 type에 따라 템플릿으로 자동 생성
			let finalTitle = title;
			let finalContent = content;

			if (!title || !content) {
				const templateResult = bindNotificationMessage(type, templateData || {});
				finalTitle = title || templateResult.title;
				finalContent = content || templateResult.content;
			}

			const notification = await this.prisma.notification
				.create({
					data: {
						type,
						title: finalTitle,
						content: finalContent,
						receiverId: receiverId || null,
						senderId: reqUserId,
						isRead: false,
						readAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			return notification;
		} catch (error) {
			this.logger.error("Error creating notification:", error);
			throw new BadRequestException({ ...NOTIFICATION_CREATE_ERROR, detail: error.message });
		}
	}

	/**
	 * 템플릿을 사용한 알림 생성 (편의 메서드)
	 */
	async createWithTemplate(
		userId: number,
		type: NotificationType,
		templateData: Record<string, string | number> = {},
		senderId?: number,
	) {
		try {
			const { title, content } = bindNotificationMessage(type, templateData);

			const notification = await this.prisma.notification
				.create({
					data: {
						receiverId: userId,
						senderId,
						type,
						title,
						content,
						isRead: false,
						readAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			return notification;
		} catch (error) {
			this.logger.error("Error creating notification with template:", error);
			throw new BadRequestException({ ...NOTIFICATION_CREATE_ERROR, detail: error.message });
		}
	}

	/**
	 * 여러 사용자에게 동일한 알림 전송 (템플릿 사용)
	 */
	async createBatchWithTemplate(
		userIds: number[],
		type: NotificationType,
		templateData: Record<string, string | number> = {},
		senderId?: number,
	) {
		try {
			const { title, content } = bindNotificationMessage(type, templateData);

			const notifications = await this.prisma.notification.createMany({
				data: userIds.map((userId) => ({
					userId,
					senderId,
					type,
					title,
					content,
					isRead: false,
					readAt: null,
				})),
			});

			return notifications;
		} catch (error) {
			this.logger.error("Error creating batch notifications:", error);
			throw new BadRequestException({ ...NOTIFICATION_CREATE_ERROR, detail: error.message });
		}
	}

	async findAll(receiverId: number, limit = 20, offset = 0) {
		try {
			// null인 경우 모든 사용자에게 알림 노출
			const notifications = await this.prisma.notification
				.findMany({
					where: {
						OR: [{ receiverId }, { receiverId: null }],
						deletedAt: null,
					},
					orderBy: {
						id: "desc",
					},
					take: Number(limit),
					skip: Number(offset),
				})
				.then((data) => this.prisma.serializeBigInt(data));

			return notifications;
		} catch (error) {
			this.logger.error("Error finding notifications:", error);
			throw new BadRequestException({ ...NOTIFICATION_FIND_ERROR, detail: error.message });
		}
	}

	async findOne(id: number, receiverId: number) {
		try {
			const notification = await this.prisma.notification
				.findFirst({
					where: {
						id,
						receiverId,
						deletedAt: null,
					},
				})
				.then((data) => (data ? this.prisma.serializeBigInt(data) : null));

			if (!notification) {
				throw new NotFoundException(NOTIFICATION_NOT_FOUND_ERROR);
			}

			return notification;
		} catch (error) {
			this.logger.error("Error finding notification:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...NOTIFICATION_DETAIL_ERROR, detail: error.message });
		}
	}

	async update(id: number, receiverId: number, updateNotificationDto: NotificationUpdateDto) {
		try {
			const existingNotification = await this.prisma.notification.findFirst({
				where: {
					id,
					receiverId,
					deletedAt: null,
				},
			});

			if (!existingNotification) {
				throw new NotFoundException(NOTIFICATION_NOT_FOUND_ERROR);
			}

			const notification = await this.prisma.notification
				.update({
					where: { id },
					data: {
						...updateNotificationDto,
						...(updateNotificationDto.isRead ? { readAt: new Date() } : {}),
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			return notification;
		} catch (error) {
			this.logger.error("Error updating notification:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...NOTIFICATION_UPDATE_ERROR, detail: error.message });
		}
	}

	async softDelete(id: number, userId: number) {
		try {
			const existingNotification = await this.prisma.notification.findFirst({
				where: {
					id,
					receiverId: userId,
					deletedAt: null,
				},
			});

			if (!existingNotification) {
				throw new NotFoundException(NOTIFICATION_NOT_FOUND_ERROR);
			}

			await this.prisma.notification.update({
				where: { id },
				data: { deletedAt: new Date() },
			});

			return { id };
		} catch (error) {
			this.logger.error("Error deleting notification:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...NOTIFICATION_DELETE_ERROR, detail: error.message });
		}
	}

	async markAsRead(userId: number, markAsReadDto: NotificationMarkAsReadDto) {
		try {
			const { ids } = markAsReadDto;

			await this.prisma.notification.updateMany({
				where: {
					id: { in: ids },
					receiverId: userId,
					deletedAt: null,
				},
				data: {
					isRead: true,
					readAt: new Date(),
				},
			});

			return { ids };
		} catch (error) {
			this.logger.error("Error marking notifications as read:", error);
			throw new BadRequestException({ ...NOTIFICATION_MARK_READ_ERROR, detail: error.message });
		}
	}

	async markAllAsRead(userId: number) {
		try {
			await this.prisma.notification.updateMany({
				where: {
					receiverId: userId,
					isRead: false,
					deletedAt: null,
				},
				data: {
					isRead: true,
					readAt: new Date(),
				},
			});

			return { success: true };
		} catch (error) {
			this.logger.error("Error marking all notifications as read:", error);
			throw new BadRequestException({ ...NOTIFICATION_MARK_READ_ERROR, detail: error.message });
		}
	}

	async getStats(userId: number) {
		try {
			const totalCount = await this.prisma.notification.count({
				where: {
					receiverId: userId,
					deletedAt: null,
				},
			});

			const unreadCount = await this.prisma.notification.count({
				where: {
					receiverId: userId,
					isRead: false,
					deletedAt: null,
				},
			});

			return {
				totalCount,
				unreadCount,
			};
		} catch (error) {
			this.logger.error("Error getting notification stats:", error);
			throw new BadRequestException({ ...NOTIFICATION_FIND_ERROR, detail: error.message });
		}
	}

	async getTotal(receiverId: number) {
		try {
			const total = await this.prisma.notification.count({
				where: {
					receiverId,
					deletedAt: null,
				},
			});

			return total;
		} catch (error) {
			this.logger.error("Error getting total notifications count:", error);
			throw new BadRequestException({ ...NOTIFICATION_FIND_ERROR, detail: error.message });
		}
	}
}
