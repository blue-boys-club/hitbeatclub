"use client";

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useSearchQueryOptions } from "../hooks/useSearchQuery";
import { SearchTrackItem } from "./SearchTrackItem";

export const SearchTracks = () => {
	const { data, isLoading } = useQuery({
		...useSearchQueryOptions(),
		placeholderData: keepPreviousData,
		select: (data) => data.tracks,
	});

	// TODO: 트랙 아이템 제대로 구현
	return (
		<div className="flex flex-col gap-2.5 mb-3">{data?.map((track, index) => <SearchTrackItem key={index} />)}</div>
	);
};
