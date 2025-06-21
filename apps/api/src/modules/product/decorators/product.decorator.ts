import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ENUM_PRODUCT_CATEGORY } from "../product.enum";

export const ProductFindQuery = () => {
	return applyDecorators(
		ApiQuery({
			name: "category",
			type: String,
			required: false,
			description: "상품 타입 (null 가능)",
			example: ENUM_PRODUCT_CATEGORY.BEAT,
			nullable: true,
		}),
		ApiQuery({
			name: "sort",
			type: String,
			required: false,
			description: "정렬 기준",
			example: "RECENT",
			nullable: true,
		}),
		ApiQuery({
			name: "genreIds",
			type: String,
			required: false,
			description: "장르",
			example: "1",
			nullable: true,
		}),
		ApiQuery({
			name: "tagIds",
			type: String,
			required: false,
			description: "태그",
			example: "1",
			nullable: true,
		}),
		ApiQuery({
			name: "musicKey",
			type: String,
			required: false,
			description: "음계",
			example: "C",
			nullable: true,
		}),
		ApiQuery({
			name: "scaleType",
			type: String,
			required: false,
			description: "조성",
			example: "MAJOR",
			nullable: true,
		}),
		ApiQuery({
			name: "minBpm",
			type: Number,
			required: false,
			description: "최소 BPM",
			example: 100,
			nullable: true,
		}),
		ApiQuery({
			name: "maxBpm",
			type: Number,
			required: false,
			description: "최대 BPM",
			example: 120,
			nullable: true,
		}),
	);
};

export const ProductSearchQuery = () => {
	return applyDecorators(
		ApiQuery({
			name: "keyword",
			type: String,
			required: false,
			description: "검색어",
			example: "Search for artists, beats, acappellas",
			nullable: true,
		}),
		ProductFindQuery(),
	);
};
