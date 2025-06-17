import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export const NoticeSearchQuery = () => {
	return applyDecorators(
		ApiQuery({
			name: "search",
			type: String,
			required: false,
			description: "검색어",
			example: "공지",
			nullable: true,
		}),
		ApiQuery({
			name: "searchType",
			type: String,
			required: false,
			description: "검색 타입",
			example: "title",
			nullable: true,
		}),
	);
};
