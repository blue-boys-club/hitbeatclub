import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Req,
	NotFoundException,
	UploadedFile,
	ForbiddenException,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocRequestFile, DocResponse, DocResponseList } from "~/common/doc/decorators/doc.decorator";
import { IResponse, IResponsePaging } from "~/common/response/interfaces/response.interface";
import { artistMessage } from "./artist.message";
import { DatabaseIdResponseDto } from "~/common/response/dtos/response.dto";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";
import { ENUM_FILE_MIME_IMAGE } from "~/common/file/constants/file.enum.constant";
import { FileRequiredPipe } from "~/common/file/pipes/file.required.pipe";
import { FileTypePipe } from "~/common/file/pipes/file.type.pipe";
import { FileUploadResponseDto } from "../file/dto/response/file.upload.response.dto";
import { FileService } from "../file/file.service";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { FileUploadSingle } from "~/common/file/decorators/file.decorator";
import { ARTIST_NOT_FOUND_ERROR } from "./artist.error";
import { ArtistUploadProfileRequestDto } from "./dto/request/artist.upload-profile.request.dto";
import settlementMessage from "../settlement/settlement.message";
import { SettlementCreateDto } from "../settlement/dto/request/settlement.create.dto";
import { SettlementService } from "../settlement/settlement.service";
import { SettlementUpdateDto } from "../settlement/dto/request/settlement.update.dto";
import { ArtistListResponseDto } from "./dto/response/artist.list.response.dto";
import { ProductListResponseDto } from "../product/dto/response/product.list.response.dto";
import { productMessage } from "../product/product.message";
import { ProductService } from "../product/product.service";
import { ArtistProductListQueryRequestDto } from "./dto/request/artist.product-list.request.dto";
import { PrismaService } from "~/common/prisma/prisma.service";
import { ArtistBlockResponseDto } from "./dto/response/artist.block.response.dto";
import { ArtistReportRequestDto } from "./dto/request/artist.report.request.dto";
import { ArtistReportResponseDto } from "./dto/response/artist.report.response.dto";

@Controller("artists")
@ApiTags("artist")
@ApiBearerAuth()
export class ArtistController {
	constructor(
		private readonly artistService: ArtistService,
		private readonly fileService: FileService,
		private readonly settlementService: SettlementService,
		private readonly productService: ProductService,
		private readonly prisma: PrismaService,
	) {}

	@Get()
	@ApiOperation({ summary: "아티스트 목록 조회" })
	@DocResponseList<ArtistListResponseDto>(artistMessage.find.success, {
		dto: ArtistListResponseDto,
	})
	async findAll(): Promise<IResponse<ArtistListResponseDto[]>> {
		const artists = await this.artistService.findAll();

		return {
			statusCode: 200,
			message: artistMessage.find.success,
			data: artists,
		};
	}

	@Get("me")
	@ApiOperation({ summary: "내 아티스트 정보 조회" })
	@AuthenticationDoc()
	@DocResponse<ArtistDetailResponseDto>(artistMessage.findMe.success, {
		dto: ArtistDetailResponseDto,
	})
	async findMe(@Req() req: AuthenticatedRequest): Promise<IResponse<ArtistDetailResponseDto>> {
		const artist = await this.artistService.findMe(req.user.id);

		return {
			statusCode: 200,
			message: artistMessage.findMe.success,
			data: artist,
		};
	}

	@Get(":id")
	@AuthenticationDoc()
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
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(artistMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() createArtistDto: ArtistCreateDto,
	): Promise<DatabaseIdResponseDto> {
		const profileImageFileId = createArtistDto?.profileImageFileId || null;

		delete createArtistDto?.profileImageFileId;

		const artist = await this.prisma.$transaction(async (tx) => {
			const createdArtist = await this.artistService.create(req.user.id, createArtistDto, tx);

			if (profileImageFileId) {
				await this.artistService.uploadArtistProfile({
					uploaderId: req.user.id,
					artistId: createdArtist.id,
					profileImageFileId,
					tx,
				});
			}

			return createdArtist;
		});

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
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(artistMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async update(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: number,
		@Body() updateArtistDto: ArtistUpdateDto,
	): Promise<DatabaseIdResponseDto> {
		const profileImageFileId = updateArtistDto?.profileImageFileId || null;
		delete updateArtistDto?.profileImageFileId;

		const artist = await this.artistService.update(id, updateArtistDto);

		await this.artistService.uploadArtistProfile({
			uploaderId: req.user.id,
			artistId: artist.id,
			profileImageFileId,
		});

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
	@AuthenticationDoc()
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

	@Post("profile")
	@ApiOperation({ summary: "아티스트 프로필 업로드" })
	@ApiConsumes("multipart/form-data")
	@AuthenticationDoc()
	@FileUploadSingle()
	@DocRequestFile({
		dto: ArtistUploadProfileRequestDto,
	})
	@DocResponse<FileUploadResponseDto>("success artist photo upload", {
		dto: FileUploadResponseDto,
	})
	async uploadProfileImage(
		@Req() req: AuthenticatedRequest,
		@Body() artistUploadProfileRequestDto: ArtistUploadProfileRequestDto,
		@UploadedFile(
			new FileRequiredPipe(),
			new FileTypePipe([ENUM_FILE_MIME_IMAGE.JPG, ENUM_FILE_MIME_IMAGE.JPEG, ENUM_FILE_MIME_IMAGE.PNG]),
		)
		file: Express.Multer.File,
	): Promise<IResponse<FileUploadResponseDto>> {
		const s3Obj = await this.fileService.putItemInBucket(file, {
			path: `artist`,
		});

		const fileRow = await this.fileService.create({
			targetTable: "artist",
			type: artistUploadProfileRequestDto.type,
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

	@Post(":id/settlement")
	@ApiOperation({ summary: "아티스트 정산 정보 생성" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(settlementMessage.create.success, {
		dto: DatabaseIdResponseDto,
	})
	async createSettlement(@Param("id") id: number, @Body() createSettlementDto: SettlementCreateDto) {
		const settlement = await this.settlementService.createByArtistId(id, createSettlementDto);

		return {
			statusCode: 200,
			message: settlementMessage.create.success,
			data: settlement,
		};
	}

	@Patch(":id/settlement")
	@ApiOperation({ summary: "아티스트 정산 정보 수정" })
	@AuthenticationDoc()
	@DocResponse<DatabaseIdResponseDto>(settlementMessage.update.success, {
		dto: DatabaseIdResponseDto,
	})
	async updateSettlement(@Param("id") id: number, @Body() updateSettlementDto: SettlementUpdateDto) {
		const settlement = await this.settlementService.updateByArtistId(id, updateSettlementDto);

		return {
			statusCode: 200,
			message: settlementMessage.update.success,
			data: settlement,
		};
	}

	@Get(":id/products")
	@ApiOperation({ summary: "(자기 자신의) 아티스트 제품 목록 조회" })
	@AuthenticationDoc()
	@DocResponseList<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findProducts(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
		@Query() artistProductListQueryRequestDto: ArtistProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds, isPublic } =
			artistProductListQueryRequestDto;
		const artistMe = await this.artistService.findMe(req.user.id);

		if (artistMe.id !== id) {
			throw new ForbiddenException(ARTIST_NOT_FOUND_ERROR);
		}

		const where = {
			sellerId: id,
			...(isPublic !== undefined ? { isPublic: isPublic ? 1 : 0 } : {}),
			...(category === "null" || category === undefined ? {} : { category }),
			...(musicKey === "null" || musicKey === undefined ? {} : { musicKey }),
			...(scaleType === "null" || scaleType === undefined ? {} : { scaleType }),
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
		};

		const products = await this.productService.findAll(where, artistProductListQueryRequestDto);
		const total = await this.productService.getTotal(where);

		return {
			statusCode: 200,
			message: productMessage.find.success,
			_pagination: {
				page: artistProductListQueryRequestDto.page,
				limit: artistProductListQueryRequestDto.limit,
				totalPage: Math.ceil(total / artistProductListQueryRequestDto.limit),
				total,
			},
			data: products,
		};
	}

	@Post(":artistId/block")
	@ApiOperation({ summary: "아티스트 차단" })
	@AuthenticationDoc()
	@DocResponse<ArtistBlockResponseDto>(artistMessage.block.success, {
		dto: ArtistBlockResponseDto,
	})
	async blockArtist(
		@Req() req: AuthenticatedRequest,
		@Param("artistId", ParseIntPipe) artistId: number,
	): Promise<IResponse<ArtistBlockResponseDto>> {
		const block = await this.artistService.blockArtist(req.user.id, artistId);

		return {
			statusCode: 200,
			message: artistMessage.block.success,
			data: {
				id: Number(block.id),
				artistId: Number(block.artistId),
				isBlocked: true,
			},
		};
	}

	@Delete(":artistId/block")
	@ApiOperation({ summary: "아티스트 차단 해제" })
	@AuthenticationDoc()
	@DocResponse<ArtistBlockResponseDto>(artistMessage.unblock.success, {
		dto: ArtistBlockResponseDto,
	})
	async unblockArtist(
		@Req() req: AuthenticatedRequest,
		@Param("artistId", ParseIntPipe) artistId: number,
	): Promise<IResponse<ArtistBlockResponseDto>> {
		const unblock = await this.artistService.unblockArtist(req.user.id, artistId);

		return {
			statusCode: 200,
			message: artistMessage.unblock.success,
			data: {
				id: Number(unblock.id),
				artistId: Number(unblock.artistId),
				isBlocked: false,
			},
		};
	}

	@Post(":artistId/report")
	@ApiOperation({ summary: "아티스트 신고" })
	@DocResponse<ArtistReportResponseDto>(artistMessage.report.success, {
		dto: ArtistReportResponseDto,
	})
	async reportArtist(
		@Param("artistId", ParseIntPipe) artistId: number,
		@Body() reportData: ArtistReportRequestDto,
	): Promise<IResponse<ArtistReportResponseDto>> {
		const report = await this.artistService.reportArtist(artistId, reportData);

		return {
			statusCode: 200,
			message: artistMessage.report.success,
			data: {
				id: Number(report.id),
				artistId: Number(report.artistId),
				message: "신고가 성공적으로 접수되었습니다.",
			},
		};
	}
}
