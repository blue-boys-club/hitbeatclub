"use client";
import { CloseMosaic, ArrowLeftMosaic } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Image from "next/image";
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import PlaylistItem from "./PlaylistItem";
import { useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPlayerListInfiniteQueryOptions } from "@/apis/player/query/player.query-options";
import { PlayerListResponse } from "@hitbeatclub/shared-types";
import { DropContentWrapper } from "@/features/dnd/components/DropContentWrapper";
import blankCdImage from "@/assets/images/blank-cd.png";
import { usePlayTrack } from "@/hooks/use-play-track";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

const PlaylistRightSidebar = () => {
	const { data: userMe } = useQuery({ ...getUserMeQueryOption(), retry: false });

	const { isOpen, setRightSidebar, currentTrackId } = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			currentTrackId: state.player.trackId,
		})),
	);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
		...getPlayerListInfiniteQueryOptions(),
		enabled: !!userMe?.id,
	});

	// 무한 스크롤을 위한 ref와 observer 설정
	const observerRef = useRef<HTMLDivElement>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target?.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	useEffect(() => {
		const element = observerRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, [handleObserver]);

	const handleToggleOpen = useCallback(() => {
		setRightSidebar(!isOpen);
	}, [setRightSidebar, isOpen]);

	// 재생 훅: { play }
	const { play } = usePlayTrack();

	// 모든 페이지의 플레이리스트 데이터를 평탄화 - useMemo로 최적화
	const allPlaylists: PlayerListResponse[] = useMemo(() => {
		return data?.pages.flat() ?? [];
	}, [data?.pages]);

	// 현재 선택된 플레이리스트 찾기 - useMemo로 최적화
	const selectedPlaylist = useMemo(() => {
		return allPlaylists.find((playlist) => playlist.productId === currentTrackId);
	}, [allPlaylists, currentTrackId]);

	const albumImage = useMemo(() => {
		return selectedPlaylist?.coverImage?.url || blankCdImage;
	}, [selectedPlaylist]);

	return (
		<>
			<div
				className={cn(
					"fixed right-0 top-87px h-[calc(100vh-92px-72px-15px)] transition-all duration-500 ease-in-out",
					isOpen ? "w-[275px]" : "w-0",
				)}
			>
				{/* 열기 버튼 - 닫혀있을 때만 보임 */}
				{!isOpen && (
					<button
						onClick={handleToggleOpen}
						className="absolute top-0 -left-8 cursor-pointer hover:opacity-80 transition-opacity"
					>
						<ArrowLeftMosaic />
					</button>
				)}

				<DropContentWrapper
					id={"player"}
					asChild
				>
					<div className="flex flex-col h-full overflow-hidden border-l-2 border-black w-[275px] pb-15 bg-white">
						{/* 닫기 버튼 - 열려있을 때만 보임 */}
						{isOpen && (
							<button
								onClick={handleToggleOpen}
								className="absolute top-0 right-0 cursor-pointer border p-[2px]"
							>
								<CloseMosaic />
							</button>
						)}

						<div className="px-6 pt-4">
							<h2 className="py-[6px] border-b-4 text-black font-bold text-[32px] leading-[32px] tracking-[0.32px] mb-7">
								Playlist
							</h2>

							{selectedPlaylist ? (
								<div className="flex gap-4 mb-7">
									<Image
										src={albumImage}
										alt="앨범 표지"
										width={54}
										height={54}
										className="rounded-[8px]"
									/>
									<div className="pt-1 flex flex-col gap-[2px]">
										<div className="text-black font-bold text-[24px] leading-[28px] tracking-[0.24px] truncate w-[155px]">
											{selectedPlaylist.productName}
										</div>
										<div className="text-black font-bold text-[16px] leading-[16px] tracking-[-0.32px] w-[155px]">
											{selectedPlaylist.seller.stageName}
										</div>
									</div>
								</div>
							) : (
								<div className="h-[54px] mb-7" />
							)}
						</div>

						<div className="flex-1 min-h-0 px-6">
							<h3 className="py-[6px] border-y-[3px] text-black font-bold text-[20px] leading-[20px] mb-5">Recent</h3>

							{!userMe?.id ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-gray-500">로그인 후 이용해주세요.</div>
								</div>
							) : isLoading ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-gray-500">로딩 중...</div>
								</div>
							) : isError ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
								</div>
							) : allPlaylists.length > 0 ? (
								<div className="overflow-auto h-full">
									<ul className="flex flex-col gap-[10px]">
										{allPlaylists.map((playlist) => (
											<PlaylistItem
												key={playlist.id}
												{...playlist}
												isSelected={playlist.productId === currentTrackId}
												onClick={play}
											/>
										))}
									</ul>

									{/* 무한 스크롤 트리거 */}
									<div
										ref={observerRef}
										className="h-4"
									>
										{isFetchingNextPage && (
											<div className="flex justify-center py-4">
												<div className="text-gray-500 text-sm">더 많은 플레이리스트를 불러오는 중...</div>
											</div>
										)}
									</div>
								</div>
							) : (
								<p className="text-center pt-10">곡 목록이 없습니다.</p>
							)}
						</div>
					</div>
				</DropContentWrapper>
			</div>
		</>
	);
};

export default PlaylistRightSidebar;
