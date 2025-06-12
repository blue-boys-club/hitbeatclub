import { Controller, Get } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse } from "src/common/doc/decorators/doc.decorator";
import { AuthenticationDoc } from "src/common/doc/decorators/auth.decorator";
import { genreMessage } from "./genre.message";
import { GenreListWithCountResponseDto } from "./dto/response/genre.list-with-count.response.dto";
import { IResponse } from "src/common/response/interfaces/response.interface";

@Controller("genres")
@ApiTags("genre")
@ApiBearerAuth()
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get("with-count")
	@ApiOperation({ summary: "장르별 리스트 및 개수 조회" })
	@AuthenticationDoc()
	@DocResponse<GenreListWithCountResponseDto>(genreMessage.find.success, {
		dto: GenreListWithCountResponseDto,
	})
	async findAllWithCount(): Promise<IResponse<GenreListWithCountResponseDto>> {
		const genres = await this.genreService.findAllWithCount();

		return {
			statusCode: 200,
			message: genreMessage.find.success,
			data: genres,
		};
	}
}
