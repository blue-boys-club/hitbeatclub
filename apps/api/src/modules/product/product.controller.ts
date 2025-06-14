import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Req,
	UploadedFile,
	NotFoundException,
	Query,
	Inject,
	forwardRef,
	Logger,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags, ApiConsumes } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocRequestFile, DocResponse, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";
import { productMessage } from "./product.message";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { ProductCreateDto } from "./dto/request/product.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import {
	ENUM_FILE_MIME_AUDIO,
	ENUM_FILE_MIME_DOCUMENT,
	ENUM_FILE_MIME_VIDEO,
} from "~/common/file/constants/file.enum.constant";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { FileUploadSingle } from "~/common/file/decorators/file.decorator";
import { ENUM_FILE_MIME_IMAGE } from "~/common/file/constants/file.enum.constant";
import { FileRequiredPipe } from "~/common/file/pipes/file.required.pipe";
import { FileTypePipe } from "~/common/file/pipes/file.type.pipe";
import { FileUploadResponseDto } from "../file/dto/response/file.upload.response.dto";
import { FileService } from "../file/file.service";
import { ProductUpdateDto } from "./dto/request/product.update.dto";
import { ProductDetailResponseDto } from "./dto/response/product.detail.response.dto";
import { PRODUCT_NOT_FOUND_ERROR } from "./product.error";
import { ARTIST_NOT_FOUND_ERROR } from "../artist/artist.error";
import { ProductListResponseDto } from "./dto/response/product.list.response.dto";
import { ProductListQueryRequestDto } from "./dto/request/project.list.request.dto";
import { ProductUploadFileRequestDto } from "./dto/request/product.upload-file.request.dto";
import { ProductFindQuery, ProductSearchQuery } from "./decorators/product.decorator";
import { ProductSearchInfoResponseDto } from "./dto/response/product.search-info.response.dto";
import { TagService } from "../tag/tag.service";
import { GenreService } from "../genre/genre.service";
import { ArtistService } from "../artist/artist.service";
import { ENUM_PRODUCT_CATEGORY, ENUM_PRODUCT_SORT } from "./product.enum";
import { ProductListDashboardResponse } from "./dto/response/product.list-dashboard.response.dto";

@Controller("products")
@ApiTags("product")
@ApiBearerAuth()
export class ProductController {
	private readonly logger = new Logger(ProductController.name);
	constructor(
		private readonly productService: ProductService,
		private readonly fileService: FileService,
		private readonly tagService: TagService,
		private readonly genreService: GenreService,
		@Inject(forwardRef(() => ArtistService))
		private readonly artistService: ArtistService,
	) {}

	@Get()
	@ApiOperation({ summary: "상품 목록 조회" })
	@DocAuth({ jwtAccessToken: true })
	@ProductFindQuery()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() productListQueryRequestDto: ProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = productListQueryRequestDto;

		const where = {
			...(productListQueryRequestDto.category === "null" ? {} : { category }),
			...(musicKey === "null" ? {} : { musicKey }),
			...(scaleType === "null" ? {} : { scaleType }),
			...(minBpm ? { minBpm: { lte: minBpm }, maxBpm: { gte: minBpm } } : {}),
			...(maxBpm ? { minBpm: { lte: maxBpm }, maxBpm: { gte: maxBpm } } : {}),
			...(genreIds
				? {
						productGenre: {
							some: {
								deletedAt: null,
								genreId: { in: genreIds.split(",").map((id) => parseInt(id)) },
							},
						},
					}
				: {}),
			...(tagIds
				? {
						productTag: {
							some: {
								deletedAt: null,
								tagId: { in: tagIds.split(",").map((id) => parseInt(id)) },
							},
						},
					}
				: {}),
			isPublic: 1,
		};
		const products = await this.productService.findAll(where, productListQueryRequestDto);

		const total = await this.productService.getTotal(where);
		return {
			statusCode: 200,
			message: productMessage.find.success,
			_pagination: {
				page: productListQueryRequestDto.page,
				limit: productListQueryRequestDto.limit,
				totalPage: Math.ceil(total / productListQueryRequestDto.limit),
				total,
			},
			data: products,
		};
	}

	@Get("dashboard")
	@ApiOperation({ summary: "대시보드 상품 목록 조회" })
	@DocAuth({ jwtAccessToken: true })
	@DocResponse<ProductListDashboardResponse>(productMessage.find.success, {
		dto: ProductListDashboardResponse,
	})
	async findAllForDashboard(@Req() req: AuthenticatedRequest): Promise<IResponse<ProductListDashboardResponse>> {
		const commonSelects = ["id", "productName", "price", "coverImage", "audioFile", "seller", "createdAt"];
		const products = await this.productService.findAll(
			{
				isPublic: 1,
			},
			{
				page: 1,
				limit: 10,
				sort: ENUM_PRODUCT_SORT.RECENT,
			},
			commonSelects,
		);

		const beatProducts = await this.productService.findAll(
			{
				isPublic: 1,
				category: ENUM_PRODUCT_CATEGORY.BEAT,
			},
			{
				page: 1,
				limit: 10,
				sort: ENUM_PRODUCT_SORT.RECENT,
			},
			commonSelects,
		);

		const acappellaProducts = await this.productService.findAll(
			{
				isPublic: 1,
				category: ENUM_PRODUCT_CATEGORY.ACAPELA,
			},
			{
				page: 1,
				limit: 10,
				sort: ENUM_PRODUCT_SORT.RECENT,
			},
			commonSelects,
		);

		const recommendedProducts = await this.productService.findAll(
			{
				isPublic: 1,
			},
			{
				page: 1,
				limit: 10,
				sort: ENUM_PRODUCT_SORT.RECENT,
			},
			commonSelects,
		);

		const recentProducts = await this.productService.findAll(
			{
				isPublic: 1,
			},
			{
				page: 1,
				limit: 10,
				sort: ENUM_PRODUCT_SORT.RECENT,
			},
			commonSelects,
		);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: {
				all: products,
				beat: beatProducts,
				acappella: acappellaProducts,
				recommended: recommendedProducts,
				recent: recentProducts,
			},
		};
	}

	@Get("/search")
	@ApiOperation({ summary: "상품 검색 목록 조회" })
	@DocAuth({ jwtAccessToken: true })
	@ProductSearchQuery()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findAllBySearch(
		@Req() req: AuthenticatedRequest,
		@Query() productListQueryRequestDto: ProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = productListQueryRequestDto;

		const where = {
			...(productListQueryRequestDto.category === "null" ? {} : { category }),
			...(musicKey === "null" ? {} : { musicKey }),
			...(scaleType === "null" ? {} : { scaleType }),
			...(minBpm ? { minBpm: { lte: minBpm }, maxBpm: { gte: minBpm } } : {}),
			...(maxBpm ? { minBpm: { lte: maxBpm }, maxBpm: { gte: maxBpm } } : {}),
			...(genreIds
				? {
						productGenre: {
							some: {
								deletedAt: null,
								genreId: { in: genreIds.split(",").map((id) => parseInt(id)) },
							},
						},
					}
				: {}),
			...(tagIds
				? {
						productTag: {
							some: {
								deletedAt: null,
								tagId: { in: tagIds.split(",").map((id) => parseInt(id)) },
							},
						},
					}
				: {}),
		};
		const products = await this.productService.findAll(where, productListQueryRequestDto);

		const total = await this.productService.getTotal(where);
		return {
			statusCode: 200,
			message: productMessage.find.success,
			_pagination: {
				page: productListQueryRequestDto.page,
				limit: productListQueryRequestDto.limit,
				totalPage: Math.ceil(total / productListQueryRequestDto.limit),
				total,
			},
			data: products,
		};
	}

	@Get("/search-info")
	@ApiOperation({ summary: "상품 검색 정보 조회" })
	@DocAuth({ jwtAccessToken: true })
	@DocResponse<ProductSearchInfoResponseDto>(productMessage.findProductSearchInfo.success, {
		dto: ProductSearchInfoResponseDto,
	})
	async findProductSearchInfo() {
		// 장르 조회
		const genres = await this.genreService.findAllWithCount();

		// Tag 조회
		const tags = await this.tagService.findAllWithCount();
		return {
			statusCode: 200,
			message: productMessage.findProductSearchInfo.success,
			data: {
				genres,
				tags,
			},
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "상품 상세 조회" })
	@DocResponse<ProductDetailResponseDto>(productMessage.find.success, {
		dto: ProductDetailResponseDto,
	})
	async findOne(@Req() req: AuthenticatedRequest, @Param("id") id: number) {
		const product = await this.productService.findOne(id);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}

		this.logger.log(product);

		const productFiles = await this.productService.findProductFiles(id);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: {
				...product,
				audioFile: productFiles.audioFile,
				coverImage: productFiles.coverImage,
				zipFile: productFiles.zipFile,
			},
		};
	}

	@Post()
	@ApiOperation({ summary: "상품 생성" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(productMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createProductDto: ProductCreateDto,
	): Promise<DatabaseIdResponseDto> {
		const artist = await this.artistService.findMe(req.user.id);

		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		const fileIds = {
			audioFileFileId: createProductDto?.audioFileFileId || null,
			coverImageFileId: createProductDto?.coverImageFileId || null,
			zipFileId: createProductDto?.zipFileId || null,
		};

		delete createProductDto?.audioFileFileId;
		delete createProductDto?.coverImageFileId;
		delete createProductDto?.zipFileId;
		const product = await this.productService.create(artist.id, createProductDto);

		if (product?.id && Object.values(fileIds).some((id) => id !== null)) {
			await this.productService.uploadProductFile({
				uploaderId: req.user.id,
				productId: product.id,
				fileIds,
			});
		}

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
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(productMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async update(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Body() updateProductDto: ProductUpdateDto,
	): Promise<DatabaseIdResponseDto> {
		const fileIds = {
			audioFileFileId: updateProductDto?.audioFileFileId || null,
			coverImageFileId: updateProductDto?.coverImageFileId || null,
			zipFileId: updateProductDto?.zipFileId || null,
		};

		delete updateProductDto?.audioFileFileId;
		delete updateProductDto?.coverImageFileId;
		delete updateProductDto?.zipFileId;

		const product = await this.productService.update(id, updateProductDto);

		if (product?.id && Object.values(fileIds).some((id) => id !== null)) {
			await this.productService.uploadProductFile({
				uploaderId: req.user.id,
				productId: product.id,
				fileIds,
			});
		}

		return {
			statusCode: 200,
			message: productMessage.update.success,
			data: {
				id: product.id,
			},
		};
	}

	@Delete(":id")
	@ApiOperation({ summary: "상품 삭제" })
	@AuthenticationDoc()
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
		dto: ProductUploadFileRequestDto,
	})
	@DocResponse<FileUploadResponseDto>("success user photo upload", {
		dto: FileUploadResponseDto,
	})
	async uploadProductFile(
		@Req() req: AuthenticatedRequest,
		@Body() productUploadFileRequestDto: ProductUploadFileRequestDto,
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
				ENUM_FILE_MIME_AUDIO.ZIP,
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
			type: productUploadFileRequestDto.type,
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

	@Post(":id/like")
	@ApiOperation({ summary: "상품 좋아요" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(productMessage.like.success, {
		dto: DatabaseIdResponseDto,
	})
	async like(@Req() req: AuthenticatedRequest, @Param("id") id: number): Promise<DatabaseIdResponseDto> {
		const product = await this.productService.like(req.user.id, id);

		return {
			statusCode: 200,
			message: productMessage.like.success,
			data: { id: product.id },
		};
	}

	@Delete(":id/un-like")
	@ApiOperation({ summary: "상품 좋아요 취소" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(productMessage.like.success, {
		dto: DatabaseIdResponseDto,
	})
	async unlike(@Req() req: AuthenticatedRequest, @Param("id") id: number): Promise<DatabaseIdResponseDto> {
		const product = await this.productService.unlike(req.user.id, id);

		return {
			statusCode: 200,
			message: productMessage.unlike.success,
			data: { id: product.id },
		};
	}
}
