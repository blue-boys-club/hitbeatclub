import { Controller, Post, Delete, Param, Body, Req } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse } from "src/common/doc/decorators/doc.decorator";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { TagCreateDto } from "./dto/request/tag.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { AuthenticationDoc } from "src/common/doc/decorators/auth.decorator";
import { tagMessage } from "./tag.message";

@Controller("tags")
@ApiTags("tag")
@ApiBearerAuth()
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Post()
	@ApiOperation({ summary: "태그 생성" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(tagMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(@Req() req: AuthenticatedRequest, @Body() createTagDto: TagCreateDto): Promise<DatabaseIdResponseDto> {
		const tag = await this.tagService.create(req.user.id, createTagDto);

		return {
			statusCode: 201,
			message: tagMessage.create.success,
			data: {
				id: tag.id,
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "태그 삭제" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(tagMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	async softDelete(@Param("id") id: number): Promise<DatabaseIdResponseDto> {
		const tag = await this.tagService.softDelete(id);

		return {
			statusCode: 200,
			message: tagMessage.delete.success,
			data: {
				id: tag.id,
			},
		};
	}
}
