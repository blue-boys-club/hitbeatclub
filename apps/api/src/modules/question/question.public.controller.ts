import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { QuestionCreateDto } from "./dto/request/question.create.dto";
import { QuestionUpdateDto } from "./dto/request/question.update.dto";
import { QuestionDetailResponseDto } from "./dto/response/question.detail.response.dto";
import { QuestionListResponseDto } from "./dto/response/question.list.response.dto";

@Controller("questions")
@ApiTags("question.public")
@ApiBearerAuth()
export class QuestionPublicController {
	constructor(private readonly questionService: QuestionService) {}

	@Post()
	@ApiOperation({ summary: "질문 생성" })
	@DocResponse<DatabaseIdResponseDto>("질문 생성 성공", {
		dto: DatabaseIdResponseDto,
	})
	async create(@Body() createQuestionDto: QuestionCreateDto): Promise<DatabaseIdResponseDto> {
		const question = await this.questionService.create(createQuestionDto);

		return {
			statusCode: 201,
			message: "질문 생성 성공",
			data: {
				id: Number(question.id),
			},
		};
	}

	@Get()
	@ApiOperation({ summary: "질문 목록 조회" })
	@DocResponse<QuestionListResponseDto>("질문 목록 조회 성공", {
		dto: QuestionListResponseDto,
	})
	async findAll(): Promise<IResponse<QuestionListResponseDto>> {
		const questions = await this.questionService.findAll();

		return {
			statusCode: 200,
			message: "질문 목록 조회 성공",
			data: questions,
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "질문 상세 조회" })
	@DocResponse<QuestionDetailResponseDto>("질문 상세 조회 성공", {
		dto: QuestionDetailResponseDto,
	})
	async findOne(@Param("id") id: number): Promise<IResponse<QuestionDetailResponseDto>> {
		const question = await this.questionService.findOne(id);

		return {
			statusCode: 200,
			message: "질문 상세 조회 성공",
			data: question,
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "질문 수정" })
	@DocResponse<DatabaseIdResponseDto>("질문 수정 성공", {
		dto: DatabaseIdResponseDto,
	})
	async update(@Param("id") id: number, @Body() updateQuestionDto: QuestionUpdateDto): Promise<DatabaseIdResponseDto> {
		const question = await this.questionService.update(id, updateQuestionDto);

		return {
			statusCode: 200,
			message: "질문 수정 성공",
			data: {
				id: Number(question.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "질문 삭제" })
	@DocResponse<DatabaseIdResponseDto>("질문 삭제 성공", {
		dto: DatabaseIdResponseDto,
	})
	async remove(@Param("id") id: number): Promise<DatabaseIdResponseDto> {
		await this.questionService.softDelete(id);

		return {
			statusCode: 200,
			message: "질문 삭제 성공",
			data: {
				id: Number(id),
			},
		};
	}
}
