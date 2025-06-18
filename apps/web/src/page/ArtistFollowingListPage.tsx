"use client";

import React, { useEffect, useMemo, useState } from "react";
import ArtistHeader from "@/features/artist/components/ArtistHeader";
import ArtistSearchBar from "@/features/artist/components/ArtistSearchBar";
import ArtistCardSection from "@/features/artist/components/ArtistCardSection";
import { SortOption } from "@/features/artist/artist.types";
import { ViewType } from "@/features/artist/artist.types";
import { useSearchParams } from "next/navigation";
import { infiniteQueryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
	useFollowedArtistsInfiniteQueryOptions,
	useFollowedArtistsQueryOptions,
} from "@/apis/user/query/user.query-option";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useInView } from "react-intersection-observer";

const ArtistFollowingListPage = ({ view }: { view: string }) => {
	const [activeView, setActiveView] = useState<ViewType>(ViewType.GRID);
	const [selectedSort, setSelectedSort] = useState<SortOption>("RECENT");
	const [searchValue, setSearchValue] = useState("");
	const { data: user } = useQuery(getUserMeQueryOption());

	const {
		data: followedArtists,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery(
		useFollowedArtistsInfiniteQueryOptions(user?.id ?? 0, { limit: 8, search: searchValue, sort: selectedSort }),
	);

	const { ref: loadMoreRef, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	useMemo(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	return (
		<>
			<ArtistHeader following={followedArtists?.total} />
			<ArtistSearchBar
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				activeView={activeView}
				setActiveView={setActiveView}
			/>
			<ArtistCardSection
				artists={followedArtists?.data ?? []}
				activeView={activeView}
				hasNextPage={hasNextPage}
				loadMoreRef={loadMoreRef}
			/>
		</>
	);
};

export default ArtistFollowingListPage;
