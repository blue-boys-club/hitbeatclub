import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { NOTICE_SORT_TYPE_VALUES } from "@hitbeatclub/shared-types";

export const NoticeSearchQuery = () => {
	return applyDecorators(
		ApiQuery({
			name: "search",
			type: String,
			required: false,
			description: "검색어 (제목, 내용)",
			example: "공지",
			nullable: true,
		}),
		ApiQuery({
			name: "sort",
			type: String,
			required: false,
			description: "정렬 기준 (title: 제목순, date: 날짜순, view: 조회순)",
			example: "date",
			enum: NOTICE_SORT_TYPE_VALUES,
			nullable: true,
		}),
	);
};
