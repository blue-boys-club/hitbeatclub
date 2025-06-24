"use client";

import { InquiryHeader } from "@/features/support/components/InquiryHeader";
import { InquirySearchBar } from "@/features/support/components/InquirySearchBar";
import { InquiryList } from "@/features/support/components/InquiryList";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInquiryListQueryOption } from "@/apis/inquiry/query/inquiry.query-options";
import { InquirySortOption } from "@/features/support/support.types";

const InquiryListPage = () => {
	const [searchValue, setSearchValue] = useState("");
	const [selectedSort, setSelectedSort] = useState<InquirySortOption>("date");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchParams, setSearchParams] = useState({
		search: "",
	});

	useEffect(() => {
		setSearchParams({
			search: searchValue,
		});
	}, [selectedSort]);

	const { data, isPending, isError } = useQuery(getInquiryListQueryOption());

	const handleSearch = () => {
		setSearchParams({
			search: searchValue,
		});
		setCurrentPage(1); // 검색 시 첫 페이지로 이동
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isPending || isError) return <></>;

	return (
		<>
			<InquiryHeader />
			<InquirySearchBar
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				onSearch={handleSearch}
			/>
			<InquiryList
				data={data}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</>
	);
};

export default InquiryListPage;
