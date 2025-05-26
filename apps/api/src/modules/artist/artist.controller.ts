import { Controller, Get, Post, Patch, Delete, Param, Body, Req, NotFoundException } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { artistMessage } from "./artist.message";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";
import { ARTIST_NOT_FOUND_ERROR } from "./artist.error";

@Controller("artist")
@ApiTags("artist")
@ApiBearerAuth()
export class ArtistController {
	constructor(private readonly artistService: ArtistService) {}

	@Get()
	@ApiOperation({ summary: "아티스트 목록 조회" })
	async findAll() {
		return this.artistService.findAll();
	}

	@Get("me")
	@ApiOperation({ summary: "내 아티스트 정보 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<ArtistDetailResponseDto>(artistMessage.find.success, {
		dto: ArtistDetailResponseDto,
	})
	async findMe(@Req() req: AuthenticatedRequest) {
		const artist = await this.artistService.findByUserId(req.user.id);

		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		return {
			statusCode: 200,
			message: artistMessage.find.success,
			data: artist,
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "아티스트 상세 조회" })
	@DocResponse<ArtistDetailResponseDto>(artistMessage.find.success, {
		dto: ArtistDetailResponseDto,
	})
	async findOne(@Param("id") id: number) {
		const artist = await this.artistService.findOne(id);

		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		return {
			statusCode: 200,
			message: artistMessage.find.success,
			data: artist,
		};
	}

	@Post()
	@ApiOperation({ summary: "아티스트 생성" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(artistMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createArtistDto: ArtistCreateDto,
	): Promise<DatabaseIdResponseDto> {
		const artist = await this.artistService.create(req.user.id, createArtistDto);

		return {
			statusCode: 201,
			message: artistMessage.create.success,
			data: {
				id: artist.id,
			},
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "아티스트 정보 수정" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(artistMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async update(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Body() updateArtistDto: ArtistUpdateDto,
	): Promise<DatabaseIdResponseDto> {
		const artist = await this.artistService.update(id, updateArtistDto);

		return {
			statusCode: 200,
			message: artistMessage.update.success,
			data: {
				id: Number(artist.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "아티스트 삭제" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(artistMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	async softDelete(@Param("id") id: number): Promise<IResponse<{ id: number }>> {
		await this.artistService.softDelete(id);

		return {
			statusCode: 200,
			message: artistMessage.delete.success,
			data: {
				id,
			},
		};
	}
}
