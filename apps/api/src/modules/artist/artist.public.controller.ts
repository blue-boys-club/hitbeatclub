import { Controller, Get, Param, Query, ParseIntPipe, NotFoundException, Req, Logger } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DocResponse, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { IResponsePaging } from "~/common/response/interfaces/response.interface";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { ProductListResponseDto } from "../product/dto/response/product.list.response.dto";
import { productMessage } from "../product/product.message";
import { ProductService } from "../product/product.service";
import { ArtistProductListQueryRequestDto } from "./dto/request/artist.product-list.request.dto";
import { ProductFindQuery } from "../product/decorators/product.decorator";
import { AuthJwtAccessOptional } from "../auth/decorators/auth.jwt.decorator";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";
import { ArtistService } from "./artist.service";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { ARTIST_NOT_FOUND_ERROR } from "./artist.error";
import { artistMessage } from "./artist.message";
import { isNumber } from "../search/search.utils";

@Controller("artists")
@ApiTags("artist.public")
export class ArtistPublicController {
	private readonly logger = new Logger(ArtistPublicController.name);
	constructor(
		private readonly productService: ProductService,
		private readonly artistService: ArtistService,
	) {}

	@Get(":artistId/products")
	@ApiOperation({ summary: "특정 아티스트 제품 목록 조회" })
	@ProductFindQuery()
	@AuthenticationDoc()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findProducts(
		@Param("artistId", ParseIntPipe) artistId: number,
		@Query() artistProductListQueryRequestDto: ArtistProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = artistProductListQueryRequestDto;

		const where = {
			sellerId: artistId,
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

	@Get("slug/:slug")
	@AuthenticationDoc({ optional: true })
	@ApiOperation({ summary: "아티스트 slug로 상세 조회" })
	@DocResponse<ArtistDetailResponseDto>(artistMessage.find.success, {
		dto: ArtistDetailResponseDto,
	})
	async findBySlug(@Param("slug") slug: string) {
		this.logger.log(`findBySlug: ${slug}`);
		let artist;

		try {
			artist = await this.artistService.findBySlug(slug);
		} catch (error) {
			if (isNumber(slug)) {
				artist = await this.artistService.findOne(Number(slug));
			} else {
				throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
			}
		}

		return {
			statusCode: 200,
			message: artistMessage.find.success,
			data: artist,
		};
	}

	@Get(":id/products")
	@ApiOperation({ summary: "아티스트 제품 목록 조회 (ID 기준)" })
	@AuthenticationDoc({ optional: true })
	@ProductFindQuery()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findProductsById(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseIntPipe) id: number,
		@Query() artistProductListQueryRequestDto: ArtistProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = artistProductListQueryRequestDto;

		const artist = await this.artistService.findOne(id);

		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		const where = {
			sellerId: artist.id,
			isPublic: 1, // 공개된 제품만 조회
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

		const products = await this.productService.findAll(
			where,
			artistProductListQueryRequestDto,
			undefined,
			req?.user?.id,
		);
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

	@Get("slug/:slug/products")
	@ApiOperation({ summary: "아티스트 제품 목록 조회 (Slug 기준)" })
	@AuthenticationDoc({ optional: true })
	@ProductFindQuery()
	@DocResponsePaging<ProductListResponseDto>(productMessage.find.success, {
		dto: ProductListResponseDto,
	})
	async findProductsBySlug(
		@Req() req: AuthenticatedRequest,
		@Param("slug") slug: string,
		@Query() artistProductListQueryRequestDto: ArtistProductListQueryRequestDto,
	): Promise<IResponsePaging<ProductListResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = artistProductListQueryRequestDto;

		let artist;

		try {
			artist = await this.artistService.findBySlug(slug);
		} catch (error) {
			if (isNumber(slug)) {
				artist = await this.artistService.findOne(Number(slug));
			} else {
				throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
			}
		}

		const where = {
			sellerId: artist.id,
			isPublic: 1, // 공개된 제품만 조회
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

		const products = await this.productService.findAll(
			where,
			artistProductListQueryRequestDto,
			undefined,
			req?.user?.id,
		);
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
}
