import { Controller, Get, Param, Query, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DocResponsePaging } from "~/common/doc/decorators/doc.decorator";
import { IResponsePaging } from "~/common/response/interfaces/response.interface";
import { AuthenticationDoc } from "~/common/doc/decorators/auth.decorator";
import { ProductListResponseDto } from "../product/dto/response/product.list.response.dto";
import { productMessage } from "../product/product.message";
import { ProductService } from "../product/product.service";
import { ArtistProductListQueryRequestDto } from "./dto/request/artist.product-list.request.dto";
import { ProductFindQuery } from "../product/decorators/product.decorator";

@Controller("artists")
@ApiTags("artist.public")
export class ArtistPublicController {
	constructor(private readonly productService: ProductService) {}

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
}
