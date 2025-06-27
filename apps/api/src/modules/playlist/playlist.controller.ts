import { Controller, Get, Post, Query, Body, Req } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PlaylistService } from "./playlist.service";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { AuthJwtAccessOptional } from "../auth/decorators/auth.jwt.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { PlaylistTracksResponseDto } from "./dto/response/playlist.tracks.response.dto";
import { DocResponse } from "~/common/doc/decorators/doc.decorator";

// TODO: Replace 'any' with actual imports when shared-types export is available
type PlaylistAutoRequest = any;
type PlaylistManualRequest = { trackIds: number[] };

@Controller("playlists")
@ApiTags("playlist")
export class PlaylistController {
	constructor(private readonly playlistService: PlaylistService) {}

	@Get("auto")
	@ApiOperation({ summary: "컨텍스트 기반 자동 재생목록" })
	@AuthJwtAccessOptional()
	@DocResponse<PlaylistTracksResponseDto>("success", { dto: PlaylistTracksResponseDto })
	async getAutoPlaylist(
		@Req() req: AuthenticatedRequest,
		@Query() query: PlaylistAutoRequest,
	): Promise<IResponse<{ trackIds: number[] }>> {
		const result = await this.playlistService.createAutoPlaylist(req?.user?.id, query);
		return {
			statusCode: 200,
			message: "success",
			data: result,
		};
	}

	@Post("manual")
	@ApiOperation({ summary: "수동 재생목록 생성" })
	@AuthenticationDoc({ optional: true })
	@DocResponse<PlaylistTracksResponseDto>("success", { dto: PlaylistTracksResponseDto })
	async postManualPlaylist(
		@Req() req: AuthenticatedRequest,
		@Body() body: PlaylistManualRequest,
	): Promise<IResponse<{ trackIds: number[] }>> {
		const result = await this.playlistService.createManualPlaylist(req?.user?.id, body);
		return {
			statusCode: 200,
			message: "success",
			data: result,
		};
	}
}
