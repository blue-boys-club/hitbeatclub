import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { InquiryService } from "./inquiry.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DocResponse } from "~/common/doc/decorators/doc.decorator";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { InquiryCreateDto } from "./dto/request/inquiry.create.dto";
import { InquiryUpdateDto } from "./dto/request/inquiry.update.dto";
import { InquiryListResponseDto } from "./dto/response/inquiry.list.response.dto";
import { InquiryDetailResponseDto } from "./dto/response/inquiry.detail.response.dto";

@Controller("inquiries")
@ApiTags("inquiry.public")
@ApiBearerAuth()
export class InquiryPublicController {
	constructor(private readonly inquiryService: InquiryService) {}

	@Post()
	@ApiOperation({ summary: "문의 생성" })
	@DocResponse<DatabaseIdResponseDto>("문의 생성 성공", {
		dto: DatabaseIdResponseDto,
	})
	async create(@Body() createInquiryDto: InquiryCreateDto): Promise<DatabaseIdResponseDto> {
		const inquiry = await this.inquiryService.create(createInquiryDto);
		return {
			statusCode: 201,
			message: "문의 생성 성공",
			data: {
				id: Number(inquiry.id),
			},
		};
	}

	@Get()
	@ApiOperation({ summary: "문의 목록 조회" })
	@DocResponse<InquiryListResponseDto>("문의 목록 조회 성공", {
		dto: InquiryListResponseDto,
	})
	async findAll(): Promise<IResponse<InquiryListResponseDto>> {
		const data = await this.inquiryService.findAll();
		return {
			statusCode: 200,
			message: "문의 목록 조회 성공",
			data,
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "문의 상세 조회" })
	@DocResponse<InquiryDetailResponseDto>("문의 상세 조회 성공", {
		dto: InquiryDetailResponseDto,
	})
	async findOne(@Param("id") id: number): Promise<IResponse<InquiryDetailResponseDto>> {
		const data = await this.inquiryService.findOne(id);
		return {
			statusCode: 200,
			message: "문의 상세 조회 성공",
			data,
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "문의 수정" })
	@DocResponse<DatabaseIdResponseDto>("문의 수정 성공", {
		dto: DatabaseIdResponseDto,
	})
	async update(@Param("id") id: number, @Body() updateInquiryDto: InquiryUpdateDto): Promise<DatabaseIdResponseDto> {
		const inquiry = await this.inquiryService.update(id, updateInquiryDto);
		return {
			statusCode: 200,
			message: "문의 수정 성공",
			data: {
				id: Number(inquiry.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "문의 삭제" })
	@DocResponse<DatabaseIdResponseDto>("문의 삭제 성공", {
		dto: DatabaseIdResponseDto,
	})
	async remove(@Param("id") id: number): Promise<DatabaseIdResponseDto> {
		await this.inquiryService.softDelete(id);
		return {
			statusCode: 200,
			message: "문의 삭제 성공",
			data: {
				id: Number(id),
			},
		};
	}
}
