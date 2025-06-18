"use client";
import { memo, useEffect, useMemo, useState } from "react";
import FollowItems from "./FollowItems";
import { SidebarSearch } from "../SidebarSearch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
	useFollowedArtistsInfiniteQueryOptions,
	useFollowedArtistsQueryOptions,
} from "@/apis/user/query/user.query-option";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useInView } from "react-intersection-observer";

const FollowSection = memo(() => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<"RECENT" | "NAME">("RECENT");
	const { data: user } = useQuery(getUserMeQueryOption());
	// const { data: followedArtists, refetch } = useQuery(
	// 	useFollowedArtistsQueryOptions(user?.id ?? 0, { limit: 8, search, sort }),
	// );
	const {
		data: followedArtists,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery(useFollowedArtistsInfiniteQueryOptions(user?.id ?? 0, { limit: 8, search, sort }));

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
		<div className="flex flex-col flex-1 h-full overflow-hidden">
			<div className="flex-none hidden @200px/sidebar:block flex-shrink-0 px-2">
				<SidebarSearch
					search={search}
					onSearchChange={setSearch}
					sort={sort}
					onSortChange={setSort}
				/>
			</div>

			<FollowItems
				search={search}
				sort={sort}
				followedArtists={followedArtists?.data ?? []}
				hasNextPage={hasNextPage}
				loadMoreRef={loadMoreRef}
			/>
		</div>
	);
});

FollowSection.displayName = "FollowSection";

export default FollowSection;
