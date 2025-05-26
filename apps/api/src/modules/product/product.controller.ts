import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UploadedFile } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags, ApiConsumes } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocRequestFile, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { AuthJwtAccessProtected } from "../auth/decorators/auth.jwt.decorator";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { productMessage } from "./product.message";
import { DatabaseIdResponseDto } from "src/common/response/dtos/response.dto";
import { ProductCreateDto } from "./dto/request/product.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import {
	ENUM_FILE_MIME_AUDIO,
	ENUM_FILE_MIME_DOCUMENT,
	ENUM_FILE_MIME_VIDEO,
} from "src/common/file/constants/file.enum.constant";
import { AuthenticationDoc } from "src/common/doc/decorators/auth.decorator";
import { FileUploadSingle } from "src/common/file/decorators/file.decorator";
import { FileSingleDto } from "src/common/file/dtos/file.single.dto";
import { ENUM_FILE_MIME_IMAGE } from "src/common/file/constants/file.enum.constant";
import { FileRequiredPipe } from "src/common/file/pipes/file.required.pipe";
import { FileTypePipe } from "src/common/file/pipes/file.type.pipe";
import { FileUploadResponseDto } from "../file/dto/response/file.upload.response.dto";
import { FileService } from "../file/file.service";
import { FileSingleUploadDto } from "src/common/file/dtos/request/file.upload.dto";

@Controller("product")
@ApiTags("product")
@ApiBearerAuth()
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly fileService: FileService,
	) {}

	@Get()
	@ApiOperation({ summary: "상품 목록 조회" })
	async findAll() {
		return this.productService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "상품 상세 조회" })
	async findOne(@Param("id") id: number) {
		return this.productService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "상품 생성" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createProductDto: ProductCreateDto,
	): Promise<IResponse<{ id: number }>> {
		delete createProductDto?.imageFileId;
		delete createProductDto?.audioFileFileId;
		delete createProductDto?.coverImageFileId;
		delete createProductDto?.zipFileId;

		const product = await this.productService.create(req.user.id, createProductDto);

		return {
			statusCode: 201,
			message: productMessage.create.success,
			data: {
				id: product.id,
			},
		};
	}

	@Patch(":id")
	@ApiOperation({ summary: "상품 정보 수정" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async update(@Param("id") id: number, @Body() updateProductDto: any): Promise<IResponse<{ id: number }>> {
		const product = await this.productService.update(id, updateProductDto);

		return {
			statusCode: 200,
			message: productMessage.update.success,
			data: {
				id: Number(product.id),
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "상품 삭제" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessProtected()
	@DocResponse<DatabaseIdResponseDto>(productMessage.delete.success, {
		dto: DatabaseIdResponseDto,
	})
	async softDelete(@Param("id") id: number): Promise<IResponse<{ id: number }>> {
		await this.productService.softDelete(id);

		return {
			statusCode: 200,
			message: productMessage.delete.success,
			data: {
				id,
			},
		};
	}

	@Post("/file")
	@ApiOperation({ summary: "상품 파일 업로드" })
	@ApiConsumes("multipart/form-data")
	@AuthenticationDoc()
	@FileUploadSingle()
	@DocRequestFile({
		dto: FileSingleDto,
	})
	@DocResponse<FileUploadResponseDto>("success user photo upload", {
		dto: FileUploadResponseDto,
	})
	async uploadProductFile(
		@Req() req: AuthenticatedRequest,
		@Body() fileSingleUploadDto: FileSingleUploadDto,
		@UploadedFile(
			new FileRequiredPipe(),
			new FileTypePipe([
				ENUM_FILE_MIME_DOCUMENT.PDF,
				ENUM_FILE_MIME_IMAGE.JPG,
				ENUM_FILE_MIME_IMAGE.JPEG,
				ENUM_FILE_MIME_IMAGE.PNG,
				ENUM_FILE_MIME_AUDIO.MPEG,
				ENUM_FILE_MIME_AUDIO.MP3,
				ENUM_FILE_MIME_AUDIO.WAV,
				ENUM_FILE_MIME_VIDEO.M4A,
				ENUM_FILE_MIME_VIDEO.MP4,
			]),
		)
		file: Express.Multer.File,
	): Promise<IResponse<FileUploadResponseDto>> {
		const s3Obj = await this.fileService.putItemInBucket(file, {
			path: "product",
		});

		const fileRow = await this.fileService.create({
			targetTable: "product",
			type: fileSingleUploadDto.type,
			uploaderId: req.user.id,
			url: s3Obj.url,
			originalName: Buffer.from(file.originalname.normalize("NFC"), "ascii").toString("utf8"),
			mimeType: file.mimetype,
			size: file.size,
		});

		return {
			statusCode: 200,
			message: "success user photo upload",
			data: { id: fileRow.id, url: s3Obj.url },
		};
	}
}
