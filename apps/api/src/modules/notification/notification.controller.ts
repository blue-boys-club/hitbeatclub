import { Controller, Get, Post, Patch, Delete, Param, Body, Req, Query, Logger, ParseIntPipe } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";

import { NotificationCreateDto } from "./dto/request/notification.create.dto";
import { NotificationUpdateDto } from "./dto/request/notification.update.dto";
import { NotificationMarkAsReadDto } from "./dto/request/notification.mark-read.dto";
import { NotificationListResponseDto } from "./dto/response/notification.list.response.dto";
import { NotificationDetailResponseDto } from "./dto/response/notification.detail.response.dto";
import { NotificationStatsResponseDto } from "./dto/response/notification.stats.response.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { notificationMessage } from "./notification.message";
import { NotificationListQueryRequestDto } from "./dto/request/notification.list.query.request.dto";

@Controller("notifications")
@ApiTags("notification")
@ApiBearerAuth()
export class NotificationController {
	private readonly logger = new Logger(NotificationController.name);
	constructor(private readonly notificationService: NotificationService) {}

	@Post()
	@AuthenticationDoc()
	@ApiOperation({ summary: "알림 생성 (관리자용)" })
	@DocResponse<{ id: number }>(notificationMessage.create.success)
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createNotificationDto: NotificationCreateDto,
	): Promise<IResponse<{ id: number }>> {
		const notification = await this.notificationService.create(req.user.id, createNotificationDto);

		return {
			statusCode: 201,
			message: notificationMessage.create.success,
			data: {
				id: Number(notification.id),
			},
		};
	}

	@Get()
	@AuthenticationDoc()
	@ApiOperation({ summary: "내 알림 목록 조회" })
	@DocResponsePaging<NotificationListResponseDto>(notificationMessage.find.success, {
		dto: NotificationListResponseDto,
	})
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() notificationListQueryRequestDto: NotificationListQueryRequestDto,
	): Promise<IResponsePaging<NotificationListResponseDto>> {
		const { limit = 20, offset = 0 } = notificationListQueryRequestDto;
		const notifications = await this.notificationService.findAll(req.user.id, limit, offset);
		const total = await this.notificationService.getTotal(req.user.id);

		// offset을 이용해 page 계산
		const page = Math.floor(offset / limit) + 1;

		return {
			statusCode: 200,
			message: notificationMessage.find.success,
			_pagination: {
				page,
				limit,
				totalPage: Math.ceil(total / limit),
				total,
			},
			data: notifications,
		};
	}

	@Get("stats")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "내 알림 통계 조회 (총 개수, 읽지 않은 개수)" })
	@DocResponse<NotificationStatsResponseDto>(notificationMessage.stats.success, {
		dto: NotificationStatsResponseDto,
	})
	async getStats(@Req() req: AuthenticatedRequest): Promise<IResponse<NotificationStatsResponseDto>> {
		const stats = await this.notificationService.getStats(req.user.id);

		return {
			statusCode: 200,
			message: notificationMessage.stats.success,
			data: stats,
		};
	}

	@Get(":id")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "알림 상세 조회" })
	@DocResponse<NotificationDetailResponseDto>(notificationMessage.findOne.success, {
		dto: NotificationDetailResponseDto,
	})
	async findOne(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
	): Promise<IResponse<NotificationDetailResponseDto>> {
		const notification = await this.notificationService.findOne(id, req.user.id);

		return {
			statusCode: 200,
			message: notificationMessage.findOne.success,
			data: notification,
		};
	}

	@Patch(":id")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "알림 수정 (읽음 상태 변경)" })
	@DocResponse<{ id: number }>(notificationMessage.update.success)
	async update(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
		@Body() updateNotificationDto: NotificationUpdateDto,
	): Promise<IResponse<{ id: number }>> {
		await this.notificationService.update(id, req.user.id, updateNotificationDto);

		return {
			statusCode: 200,
			message: notificationMessage.update.success,
			data: { id },
		};
	}

	@Delete(":id")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "알림 삭제" })
	@DocResponse<{ id: number }>(notificationMessage.delete.success)
	async remove(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
	): Promise<IResponse<{ id: number }>> {
		await this.notificationService.softDelete(id, req.user.id);

		return {
			statusCode: 200,
			message: notificationMessage.delete.success,
			data: { id },
		};
	}

	@Post("mark-read")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "선택한 알림들을 읽음 처리" })
	@DocResponse<{ ids: number[] }>(notificationMessage.markRead.success)
	async markAsRead(
		@Req() req: AuthenticatedRequest,
		@Body() markAsReadDto: NotificationMarkAsReadDto,
	): Promise<IResponse<{ ids: number[] }>> {
		const result = await this.notificationService.markAsRead(req.user.id, markAsReadDto);

		return {
			statusCode: 200,
			message: notificationMessage.markRead.success,
			data: result,
		};
	}

	@Post("mark-all-read")
	@AuthJwtAccessProtected()
	@AuthenticationDoc()
	@ApiOperation({ summary: "모든 알림을 읽음 처리" })
	@DocResponse<{ success: boolean }>(notificationMessage.markRead.success)
	async markAllAsRead(@Req() req: AuthenticatedRequest): Promise<IResponse<{ success: boolean }>> {
		const result = await this.notificationService.markAllAsRead(req.user.id);

		return {
			statusCode: 200,
			message: notificationMessage.markRead.success,
			data: result,
		};
	}
}
