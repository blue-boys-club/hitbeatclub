"use client";

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { SearchTrackItem } from "./SearchTrackItem";
import { useGetSearchQueryOptions } from "../hooks/useSearchQuery";

export const SearchTracks = () => {
	const searchQueryOptions = useGetSearchQueryOptions();
	const { data, isLoading } = useQuery({
		...searchQueryOptions,
		placeholderData: keepPreviousData,
		select: (response) => response?.data?.products || [],
	});

	// TODO: 트랙 아이템 제대로 구현
	return (
		<div className="flex flex-col gap-2.5 mb-3">
			{data?.map((product: any, index: number) => <SearchTrackItem key={product.id || index} />)}
		</div>
	);
};
