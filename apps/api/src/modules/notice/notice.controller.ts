import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	ParseIntPipe,
	Req,
	UploadedFile,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { NoticeService } from "./notice.service";
import { DocResponse, DocResponsePaging, DocRequestFile } from "~/common/doc/decorators/doc.decorator";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import noticeMessage from "./notice.message";
import { ENUM_FILE_MIME_DOCUMENT, ENUM_FILE_MIME_IMAGE } from "~/common/file/constants/file.enum.constant";
import { FileUploadSingle } from "~/common/file/decorators/file.decorator";
import { FileRequiredPipe } from "~/common/file/pipes/file.required.pipe";
import { FileTypePipe } from "~/common/file/pipes/file.type.pipe";
import { FileService } from "../file/file.service";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";

// Request DTOs
import { NoticeCreateRequestDto } from "./dto/request/notice.create.request.dto";
import { NoticeUpdateRequestDto } from "./dto/request/notice.update.request.dto";
import { NoticeListQueryRequestDto } from "./dto/request/notice.list.request.dto";
import { NoticeUploadFileRequestDto } from "./dto/request/notice.upload-file.request.dto";

// Response DTOs
import { NoticeListResponseDto } from "./dto/response/notice.list.response.dto";
import { NoticeDetailResponseDto } from "./dto/response/notice.detail.response.dto";
import { FileUploadResponseDto } from "../file/dto/response/file.upload.response.dto";
import { NoticeSearchQuery } from "./decorators/notice.decorator";

@ApiTags("notice")
@Controller("notices")
@ApiBearerAuth()
export class NoticeController {
	constructor(
		private readonly noticeService: NoticeService,
		private readonly fileService: FileService,
	) {}

	@Get()
	@ApiOperation({ summary: "공지사항 목록 조회" })
	@NoticeSearchQuery()
	@DocResponsePaging<NoticeListResponseDto>(noticeMessage.find.success, {
		dto: NoticeListResponseDto,
	})
	async getNotices(@Query() query: NoticeListQueryRequestDto): Promise<IResponsePaging<NoticeListResponseDto[]>> {
		const notices = await this.noticeService.findAll(query);
		const total = await this.noticeService.getTotal(query);
		const totalPages = Math.ceil(total / query.limit);

		return {
			statusCode: 200,
			message: noticeMessage.find.success,
			data: notices,
			_pagination: {
				totalPage: totalPages,
				page: query.page,
				limit: query.limit,
				total,
			},
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "공지사항 상세 조회" })
	@DocResponse<NoticeDetailResponseDto>(noticeMessage.find.success, {
		dto: NoticeDetailResponseDto,
	})
	async getNotice(@Param("id", ParseIntPipe) id: number): Promise<IResponse<NoticeDetailResponseDto>> {
		const notice = await this.noticeService.findOne(id);

		return {
			statusCode: 200,
			message: noticeMessage.find.success,
			data: notice,
		};
	}

	@Post()
	@ApiOperation({ summary: "공지사항 생성" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(noticeMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async createNotice(
		@Req() req: AuthenticatedRequest,
		@Body() createNoticeDto: NoticeCreateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const notice = await this.noticeService.create(req.user.id, createNoticeDto);

		return {
			statusCode: 200,
			message: noticeMessage.create.success,
			data: {
				id: Number(notice.id),
			},
		};
	}

	@Put(":id")
	@ApiOperation({ summary: "공지사항 수정" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(noticeMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async updateNotice(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
		@Body() updateNoticeDto: NoticeUpdateRequestDto,
	): Promise<DatabaseIdResponseDto> {
		const notice = await this.noticeService.update(req.user.id, id, updateNoticeDto);

		return {
			statusCode: 200,
			message: noticeMessage.update.success,
			data: {
				id: Number(notice.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "공지사항 삭제" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(noticeMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	async deleteNotice(@Param("id", ParseIntPipe) id: number): Promise<DatabaseIdResponseDto> {
		const result = await this.noticeService.softDelete(id);

		return {
			statusCode: 200,
			message: noticeMessage.delete.success,
			data: {
				id: result.id,
			},
		};
	}

	@Post("/file")
	@ApiOperation({ summary: "공지사항 파일 업로드" })
	@ApiConsumes("multipart/form-data")
	@AuthenticationDoc()
	@FileUploadSingle()
	@DocRequestFile({
		dto: NoticeUploadFileRequestDto,
	})
	@DocResponse<FileUploadResponseDto>("공지사항 파일 업로드 성공", {
		dto: FileUploadResponseDto,
	})
	async uploadNoticeFile(
		@Req() req: AuthenticatedRequest,
		@Body() noticeUploadFileRequestDto: NoticeUploadFileRequestDto,
		@UploadedFile(
			new FileRequiredPipe(),
			new FileTypePipe([
				ENUM_FILE_MIME_DOCUMENT.PDF,
				ENUM_FILE_MIME_IMAGE.JPG,
				ENUM_FILE_MIME_IMAGE.JPEG,
				ENUM_FILE_MIME_IMAGE.PNG,
			]),
		)
		file: Express.Multer.File,
	): Promise<IResponse<FileUploadResponseDto>> {
		const s3Obj = await this.fileService.putItemInBucket(file, {
			path: "notice",
		});

		const fileRow = await this.fileService.create({
			targetTable: "notice",
			type: noticeUploadFileRequestDto.type,
			uploaderId: req.user.id,
			url: s3Obj.url,
			originalName: Buffer.from(file.originalname.normalize("NFC"), "ascii").toString("utf8"),
			mimeType: file.mimetype,
			size: file.size,
		});

		return {
			statusCode: 200,
			message: "공지사항 파일 업로드 성공",
			data: { id: fileRow.id, url: s3Obj.url },
		};
	}
}
