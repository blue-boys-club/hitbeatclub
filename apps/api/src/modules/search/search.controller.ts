import { Controller, Get, Req, Query, Logger } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiConsumes } from "@nestjs/swagger";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DocAuth, DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { IResponsePaging } from "~/common/response/interfaces/response.interface";
import { searchMessage } from "./search.message";
import { AuthenticatedRequest } from "../auth/dto/request/auth.dto.request";
import { SearchResultResponseDto } from "./dto/response/search.list.response.dto";
import { ProductSearchQueryRequestDto } from "./dto/request/search.request.dto";
import { SearchQueryDecorator } from "./decorators/search.decorator";
import { AuthJwtAccessOptional } from "../auth/decorators/auth.jwt.decorator";
import { ArtistService } from "../artist/artist.service";
import { ProductLike } from "@prisma/client";
import { ProductService } from "../product/product.service";

@Controller("search")
@ApiTags("search")
@ApiBearerAuth()
export class SearchController {
	private readonly logger = new Logger(SearchController.name);
	constructor(
		private readonly productService: ProductService,
		private readonly artistService: ArtistService,
	) {}

	@Get("/")
	@ApiOperation({ summary: "상품 검색 목록 조회" })
	@DocAuth({ jwtAccessToken: true })
	@AuthJwtAccessOptional()
	@SearchQueryDecorator()
	@DocResponsePaging<SearchResultResponseDto>(searchMessage.find.success, {
		dto: SearchResultResponseDto,
	})
	async findAllBySearch(
		@Req() req: AuthenticatedRequest,
		@Query() productSearchQueryRequestDto: ProductSearchQueryRequestDto,
	): Promise<IResponsePaging<SearchResultResponseDto>> {
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = productSearchQueryRequestDto;
		const userId = req?.user?.id;

		const productWhere = {
			...(productSearchQueryRequestDto.category === "null" ? {} : { category }),
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
			...(productSearchQueryRequestDto.keyword
				? {
						OR: [
							{ productName: { contains: productSearchQueryRequestDto.keyword } },
							// { productDescription: { contains: productSearchQueryRequestDto.keyword } },
						],
					}
				: {}),
			isPublic: 1,
			deletedAt: null,
		};

		const products = await this.productService.findAll(productWhere, productSearchQueryRequestDto, [], userId);
		// this.logger.log({ products }, "products");

		// 아티스트 검색 - keyword가 없으면 검색하지 않음 (no-findall)
		// 아티스트는 keyword 기반으로만 검색하고, 전체 조회는 하지 않음
		let artists = [];
		let artistTotal = 0;

		if (productSearchQueryRequestDto.keyword) {
			const { artists: artistsData, total } = await this.artistService.findAllBySearch(
				productSearchQueryRequestDto.keyword,
			);
			artists = artistsData;
			artistTotal += total;
		}

		// 아티스트 수 보정 로직 - 최대 10명으로 제한
		if (artists.length < 10) {
			// 상품에서 고유한 판매자들 추출
			const uniqueSellers = new Map();

			// 기존 아티스트 ID들을 Set으로 저장 (중복 방지)
			const existingArtistIds = new Set(artists.map((artist) => artist.id));

			products.forEach((product) => {
				if (product.seller && !existingArtistIds.has(product.seller.id)) {
					uniqueSellers.set(product.seller.id, {
						id: product.seller.id,
						stageName: product.seller.stageName,
						slug: product.seller.slug,
						profileImageUrl: product.seller.profileImageUrl,
						isVerified: product.seller.isVerified,
					});
				}
			});

			// 부족한 아티스트 수만큼 판매자를 추가 (최대 10명까지)
			const sellersArray = Array.from(uniqueSellers.values());
			const neededCount = Math.max(0, 10 - artists.length);
			const sellersToAdd = sellersArray.slice(0, neededCount);

			// 아티스트 배열에 판매자 추가
			artistTotal += sellersToAdd.length;
			artists = [...artists, ...sellersToAdd];
		}

		// 아티스트 배열을 최대 10개로 제한
		artists = artists.slice(0, 10);

		const productTotal = await this.productService.getTotal(productWhere);
		const viewTotal = productTotal + artistTotal;

		return {
			statusCode: 200,
			message: searchMessage.find.success,
			_pagination: {
				page: productSearchQueryRequestDto.page,
				limit: productSearchQueryRequestDto.limit,
				totalPage: Math.ceil(productTotal / productSearchQueryRequestDto.limit),
				total: productTotal, // 상품 총 개수
			},
			data: {
				products,
				artists,
				total: viewTotal, // 상품 + 아티스트 총 개수
			},
		};
	}
}
