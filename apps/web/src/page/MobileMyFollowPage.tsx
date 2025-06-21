"use client";

import { Search } from "@/assets/svgs";
import { StarInCircle } from "@/assets/svgs/StarInCircle";
import { MobileMyFollowArtistItem, MobileMyPageTitle } from "@/features/mobile/my/components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFollowedArtistsInfiniteQueryOptions, getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useInView } from "react-intersection-observer";
import { useMemo, useState } from "react";

export const MobileMyFollowPage = () => {
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
		useFollowedArtistsInfiniteQueryOptions(user?.id ?? 0, {
			limit: 12,
			search: searchValue,
			sort: "RECENT",
		}),
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

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col">
				<MobileMyPageTitle
					icon={<StarInCircle />}
					title="My Artists"
					right={"Loading..."}
				/>
				<div className="flex justify-center items-center h-40">
					<span>로딩 중...</span>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col">
				<MobileMyPageTitle
					icon={<StarInCircle />}
					title="My Artists"
					right={"Error"}
				/>
				<div className="flex justify-center items-center h-40">
					<span>데이터를 불러오는 중 오류가 발생했습니다.</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<MobileMyPageTitle
				icon={<StarInCircle />}
				title="My Artists"
				right={`${followedArtists?.total ?? 0} Following`}
			/>
			<div className="bg-hbc-gray-100 h-8 px-4 rounded-30px flex items-center mb-7">
				<input
					className="flex-1 placeholder:text-hbc-gray-400 focus:outline-none bg-transparent"
					placeholder="My Artists 검색하기"
					value={searchValue}
					onChange={handleSearchChange}
				/>
				<Search
					width={19}
					height={19}
					fill="#4D4D4F"
				/>
			</div>
			<div className="grid grid-cols-3 gap-x-6 gap-y-3 w-full">
				{followedArtists?.data?.map((artist) => (
					<MobileMyFollowArtistItem
						key={artist.artistId}
						stageName={artist.stageName}
						profileImageUrl={artist.profileImageUrl}
						followerCount={artist.followerCount}
					/>
				))}
				{hasNextPage && (
					<div
						ref={loadMoreRef}
						className="col-span-3 h-4 flex justify-center items-center"
					>
						{isFetchingNextPage && <span className="text-sm text-gray-500">더 불러오는 중...</span>}
					</div>
				)}
			</div>
			{followedArtists?.data?.length === 0 && (
				<div className="flex justify-center items-center h-40">
					<span className="text-gray-500">팔로우한 아티스트가 없습니다.</span>
				</div>
			)}
		</div>
	);
};
