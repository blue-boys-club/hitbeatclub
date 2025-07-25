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
	BadRequestException,
	ForbiddenException,
	Headers,
	Ip,
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
	ENUM_FILE_MIME_ARCHIVE,
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
import { PRODUCT_FILE_FORBIDDEN_ERROR, PRODUCT_NOT_FOUND_ERROR } from "./product.error";
import { ARTIST_NOT_FOUND_ERROR } from "../artist/artist.error";
import { ProductListResponseDto } from "./dto/response/product.list.response.dto";
import { ProductListQueryRequestDto } from "./dto/request/project.list.request.dto";
import { ProductUploadFileRequestDto } from "./dto/request/product.upload-file.request.dto";
import { ProductFindQuery } from "./decorators/product.decorator";
import { AuthJwtAccessOptional } from "../auth/decorators/auth.jwt.decorator";
import { ProductSearchInfoResponseDto } from "./dto/response/product.search-info.response.dto";
import { TagService } from "../tag/tag.service";
import { GenreService } from "../genre/genre.service";
import { ArtistService } from "../artist/artist.service";
import { ENUM_PRODUCT_CATEGORY, ENUM_PRODUCT_SORT } from "./product.enum";
import { ProductListDashboardResponse } from "./dto/response/product.list-dashboard.response.dto";
import { ProductLike } from "@prisma/client";
import { FILE_NOT_SUPPORTED_MIME_TYPE_ERROR } from "../file/file.error";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { FileUrlRequestDto } from "./dto/request/product.file-url.request.dto";
import { PaymentService } from "../payment/payment.service";
import { AwsCloudfrontService } from "~/common/aws/services/aws.cloudfront.service";
import { ProductIdsRequestDto } from "./dto/request/product.ids.request.dto";
import { PlaylistService } from "../playlist/playlist.service";
import { Throttle } from "@nestjs/throttler";
import { NotificationService } from "../notification/notification.service";

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
		@Inject(forwardRef(() => PaymentService))
		private readonly paymentService: PaymentService,
		private readonly cloudFrontService: AwsCloudfrontService,
		private readonly playlistService: PlaylistService,
		private readonly notificationService: NotificationService,
	) {}

	@Get()
	@ApiOperation({ summary: "상품 목록 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessOptional()
	@ProductFindQuery()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() productListQueryRequestDto: ProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = productListQueryRequestDto;
		const userId = req?.user?.id;

		const where = {
			...(productListQueryRequestDto.category === "null" ? {} : { category }),
			...(musicKey === "null" ? {} : { musicKey }),
			...(scaleType === "null" ? {} : { scaleType }),
			...(minBpm ? { minBpm: { lte: minBpm }, maxBpm: { gte: minBpm } } : {}),
			...(maxBpm ? { minBpm: { lte: maxBpm }, maxBpm: { gte: maxBpm } } : {}),
			...(genreIds && genreIds.length > 0
				? {
						productGenre: {
							some: {
								deletedAt: null,
								genreId: { in: genreIds },
							},
						},
					}
				: {}),
			...(tagIds && tagIds.length > 0
				? {
						productTag: {
							some: {
								deletedAt: null,
								tagId: { in: tagIds },
							},
						},
					}
				: {}),
			isPublic: 1,
		};
		const products = (await this.productService.findAll(where, productListQueryRequestDto, [], userId)).map(
			(product) => {
				if (product.productLike) {
					const isLiked = product.productLike.some((like: ProductLike) => BigInt(like.userId) === BigInt(userId));
					product.isLiked = isLiked;
					delete product.productLike;
				} else {
					product.isLiked = null;
				}
				return product;
			},
		);

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

	@Get("/ids")
	@ApiOperation({ summary: "상품 목록 조회" })
	@AuthenticationDoc({ optional: true })
	@DocResponse<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findItems(@Req() req: AuthenticatedRequest, @Query() productIdsRequestDto: ProductIdsRequestDto) {
		const userId = req?.user?.id;
		const productIdsNumbers =
			typeof productIdsRequestDto.productIds === "number"
				? [productIdsRequestDto.productIds]
				: productIdsRequestDto.productIds;
		const productIds = productIdsNumbers.map((id) => Number(BigInt(id)));
		this.logger.log(productIds, "productIds");
		const products = await this.productService.findItemByProductIds(productIds, userId);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: products,
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "상품 상세 조회" })
	@AuthJwtAccessOptional()
	@DocResponse<ProductDetailResponseDto>(productMessage.find.success, {
		dto: ProductDetailResponseDto,
	})
	async findOne(@Req() req: AuthenticatedRequest, @Param("id") id: number) {
		const userId = req?.user?.id;
		const product = await this.productService.findOne(id, userId);

		if (product?.productLike) {
			const isLiked = product.productLike.some((like: ProductLike) => BigInt(like.userId) === BigInt(userId));
			product.isLiked = isLiked;
			delete product.productLike;
		} else {
			product.isLiked = null;
		}

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}

		const productFiles = await this.productService.findProductFiles(id);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: {
				...product,
				// audioFile: productFiles.audioFile,
				coverImage: productFiles.coverImage,
				// zipFile: productFiles.zipFile,
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

		try {
			await this.notificationService.create(req.user.id, {
				type: "UPLOAD_BEAT_SUCCESS",
				receiverId: req.user.id,
				templateData: {
					beatName: product.productName,
				},
			});
		} catch (e) {
			console.error(e);
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
				ENUM_FILE_MIME_ARCHIVE.ZIP,
				ENUM_FILE_MIME_VIDEO.M4A,
				ENUM_FILE_MIME_VIDEO.MP4,
			]),
		)
		file: Express.Multer.File,
	): Promise<IResponse<FileUploadResponseDto>> {
		const filePath = (() => {
			switch (productUploadFileRequestDto.type) {
				case ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE:
					return "product";
				case ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE:
					return "product/audio";
				case ENUM_FILE_TYPE.PRODUCT_ZIP_FILE:
					return "product/archive";
				default:
					throw new BadRequestException(FILE_NOT_SUPPORTED_MIME_TYPE_ERROR);
			}
		})();

		// 압축 파일 / 음원 파일인 경우 Downloadable - Content-Disposition 헤더 설정
		const contentDisposition =
			productUploadFileRequestDto.type === ENUM_FILE_TYPE.PRODUCT_ZIP_FILE ||
			productUploadFileRequestDto.type === ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE
				? `attachment; filename="${file.originalname}"`
				: undefined;

		const s3Obj = await this.fileService.putItemInBucket(file, {
			path: filePath,
			contentDisposition,
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

	@Get(":id/file-url")
	@ApiOperation({ summary: "상품 파일 다운로드 링크 조회" })
	@AuthenticationDoc({ optional: true })
	@DocResponse<FileUploadResponseDto>(productMessage.find.success, {
		dto: FileUploadResponseDto,
	})
	async findFile(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Query() fileUrlRequestDto: FileUrlRequestDto,
	): Promise<IResponse<FileUploadResponseDto>> {
		const userId = req?.user?.id;
		if (fileUrlRequestDto.type === ENUM_FILE_TYPE.PRODUCT_ZIP_FILE) {
			if (!userId) {
				throw new ForbiddenException(PRODUCT_FILE_FORBIDDEN_ERROR);
			}

			const orderedItems = await this.paymentService.getOrderedItemsByProductId(userId, id, true);
			if (orderedItems.length === 0) {
				throw new ForbiddenException(PRODUCT_FILE_FORBIDDEN_ERROR);
			}
		}

		const file = await this.productService.findFile(id, fileUrlRequestDto.type);

		const url = await this.cloudFrontService.createSignedUrl(file.url);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: { id: Number(file.id), url, originalName: file.originName },
		};
	}

	@Post(":id/view-count")
	@Throttle({ default: { limit: 1, ttl: 25 * 1000 } })
	@ApiOperation({ summary: "상품 조회수 증가" })
	@AuthenticationDoc({ optional: true })
	@DocResponse<DatabaseIdResponseDto>(productMessage.find.success, {
		dto: DatabaseIdResponseDto,
	})
	async increaseViewCount(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Ip() ip: string,
		@Headers("CloudFront-Viewer-Country-Region") countryRegion?: string,
	): Promise<DatabaseIdResponseDto> {
		this.logger.log({ context: { ip, user: req?.user, countryRegion } }, "increaseViewCount");
		const product = await this.productService.increaseViewCount(id);

		if (req?.user?.id) {
			await this.playlistService.savePlaylistLog(req.user.id, product.sellerId, product.id, countryRegion || null);
		}

		return {
			statusCode: 200,
			message: productMessage.find.success,
			data: { id: Number(product.id) },
		};
	}
}
