"use client";

import { NoticeHeader } from "@/features/notice/components/NoticeHeader";
import { NoticeSearchBar } from "@/features/notice/components/NoticeSearchBar";
import { NoticeList } from "@/features/notice/components/NoticeList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNoticeListQueryOptions } from "@/apis/notice/query/notice.query-option";
import { SortOption } from "@/features/notice/notice.types";

const NoticePage = () => {
	const [searchValue, setSearchValue] = useState("");
	const [selectedSort, setSelectedSort] = useState<SortOption>("TITLE");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchParams, setSearchParams] = useState({
		search: "",
		searchType: "TITLE" as SortOption,
	});

	const { data, isPending, isError } = useQuery(
		useNoticeListQueryOptions({
			page: currentPage,
			limit: 15,
			search: searchParams.search,
			searchType: searchParams.searchType,
		}),
	);

	const handleSearch = () => {
		setSearchParams({
			search: searchValue,
			searchType: selectedSort,
		});
		setCurrentPage(1); // 검색 시 첫 페이지로 이동
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isPending || isError) return <></>;

	return (
		<>
			<NoticeHeader />
			<NoticeSearchBar
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				onSearch={handleSearch}
			/>
			<NoticeList
				data={data}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</>
	);
};

export default NoticePage;
