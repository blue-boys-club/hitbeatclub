import { Controller, Post, Get, Body, Req, Query } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocResponse, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { IResponsePaging } from "~/common/response/interfaces/response.interface";
import { playerMessage } from "./player.message";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { PlayerStartRequestDto } from "./dto/request/player.start.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { PlayerListResponseDto } from "./dto/response/player.list.response.dto";

@Controller("player")
@ApiTags("player")
@ApiBearerAuth()
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@Post("start")
	@ApiOperation({ summary: "음악 재생 시작" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(playerMessage.savePlayRecord.success, {
		dto: DatabaseIdResponseDto,
	})
	async startPlay(
		@Req() req: AuthenticatedRequest,
		@Body() playerStartRequestDto: PlayerStartRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const playRecord = await this.playerService.createPlayRecord(playerStartRequestDto);

		return {
			statusCode: 201,
			message: playerMessage.savePlayRecord.success,
			data: { id: Number(playRecord.id) },
		};
	}

	@Get("")
	@ApiOperation({ summary: "플레이 기록 조회" })
	@AuthenticationDoc()
	@DocResponsePaging<PlayerListResponseDto>(playerMessage.findPlayHistory.success, {
		dto: PlayerListResponseDto,
	})
	async findPlayList(
		@Req() req: AuthenticatedRequest,
		@Query("page") page: number = 1,
		@Query("limit") limit: number = 20,
	): Promise<IResponsePaging<PlayerListResponseDto>> {
		const userId = req.user.id;
		const result = await this.playerService.findPlayList(userId, page, limit);

		return {
			statusCode: 200,
			message: playerMessage.findPlayHistory.success,
			_pagination: {
				page: result.page,
				limit: result.limit,
				totalPage: result.totalPages,
				total: result.totalPages * result.limit,
			},
			data: result.data,
		};
	}
}
