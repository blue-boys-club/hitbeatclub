"use client";

import { Search } from "@/assets/svgs";
import {
	MobileNoticeSelect,
	MobileNoticeList,
	MobileNoticePagination,
	MobileNoticePageTitle,
} from "@/features/mobile/notice/components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNoticeListQueryOption } from "@/apis/notice/query/notice.query-options";

const MobileNoticePage = () => {
	const [sortBy, setSortBy] = useState<"제목" | "날짜" | "조회수">("제목");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	// sortBy를 sort type으로 매핑
	const getSearchType = (sortBy: "제목" | "날짜" | "조회수") => {
		switch (sortBy) {
			case "제목":
				return "title";
			case "날짜":
				return "date";
			case "조회수":
				return "view";
			default:
				return "title";
		}
	};

	const noticeQuery = useQuery(
		getNoticeListQueryOption({
			page: currentPage,
			limit: 10,
			search: searchQuery || undefined,
			sort: getSearchType(sortBy),
		}),
	);

	const handleSearch = () => {
		setSearchQuery(searchTerm);
		setCurrentPage(1);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="px-4 pb-50px">
			<MobileNoticePageTitle title="Notice" />
			<div className="mt-13px flex flex-col">
				<div className="flex justify-between">
					<div className="h-19px flex items-center gap-1 border-b border-black">
						<input
							className="w-100px text-12px leading-100% font-medium focus:outline-none"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="검색어 입력"
						/>
						<button onClick={handleSearch}>
							<Search
								width="10px"
								height="10px"
							/>
						</button>
					</div>
					<MobileNoticeSelect
						value={sortBy}
						onChange={setSortBy}
					/>
				</div>
				<div className="mt-6px">
					<MobileNoticeList
						notices={noticeQuery.data?.data || []}
						isLoading={noticeQuery.isLoading}
						error={noticeQuery.error}
					/>
				</div>
				<div className="mt-28px">
					<MobileNoticePagination
						currentPage={currentPage}
						totalPages={noticeQuery.data?._pagination.totalPage || 1}
						onPageChange={setCurrentPage}
					/>
				</div>
			</div>
		</div>
	);
};

export default MobileNoticePage;
