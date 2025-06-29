"use client";
import { CloseMosaic, ArrowLeftMosaic } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import PlaylistItem from "./PlaylistItem";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";
import { useQueries, useQuery } from "@tanstack/react-query";
import { DropContentWrapper } from "@/features/dnd/components/DropContentWrapper";
import blankCdImage from "@/assets/images/blank-cd.png";
import { usePlayTrack } from "@/hooks/use-play-track";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { usePlaylist } from "@/hooks/use-playlist";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";

const PlaylistRightSidebar = () => {
	const { data: userMe } = useQuery({ ...getUserMeQueryOption(), retry: false });

	const { isOpen, currentType, setRightSidebar, currentTrackId } = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			currentType: state.rightSidebar.currentType,
			setRightSidebar: state.setRightSidebar,
			currentTrackId: state.player.trackId,
		})),
	);

	// 플레이리스트 사이드바가 열려있는지 여부
	const isPlaylistOpen = isOpen && currentType === SidebarType.PLAYLIST;

	// 새로운 플레이리스트 시스템 사용
	const { trackIds, currentIndex, isLoggedIn } = usePlaylist();

	// 플레이리스트의 각 트랙에 대한 상품 정보 조회
	const trackQueries = useQueries({
		queries: trackIds.map((trackId) => ({
			...getProductQueryOption(trackId),
			enabled: !!trackId && isLoggedIn,
		})),
	});

	const handleClose = useCallback(() => {
		setRightSidebar(false);
	}, [setRightSidebar]);

	// 재생 훅: { play }
	const { play } = usePlayTrack();

	// 플레이리스트 데이터를 PlayerListResponse 형태로 변환
	const allPlaylists = useMemo(() => {
		return trackQueries
			.map((query, index) => {
				if (!query.data) return null;

				const product = query.data;
				return {
					id: product.id,
					productId: product.id,
					productName: product.productName,
					seller: {
						id: product.seller?.id || 0,
						stageName: product.seller?.stageName || "",
						profileImageUrl: product.seller?.profileImageUrl || "",
					},
					coverImage: {
						id: product.coverImage?.id || 0,
						url: product.coverImage?.url || "",
						originName: product.coverImage?.originName || "",
					},
					audioFile: {
						id: product.audioFile?.id || 0,
						url: product.audioFile?.url || "",
						originName: product.audioFile?.originName || "",
					},
				};
			})
			.filter(Boolean);
	}, [trackQueries]);

	// 현재 선택된 플레이리스트 찾기 - useMemo로 최적화
	const selectedPlaylist = useMemo(() => {
		return allPlaylists.find((playlist) => playlist?.productId === currentTrackId);
	}, [allPlaylists, currentTrackId]);

	const albumImage = useMemo(() => {
		return selectedPlaylist?.coverImage?.url || blankCdImage;
	}, [selectedPlaylist]);

	// 로딩 상태 확인
	const isLoading = trackQueries.some((query) => query.isLoading);
	const isError = trackQueries.some((query) => query.isError);

	return (
		<>
			<div
				className={cn(
					"fixed right-0 top-87px h-[calc(100vh-92px-72px-15px)] transition-all duration-500 ease-in-out",
					isPlaylistOpen ? "w-[275px]" : "w-0",
				)}
			>
				{/* 플레이리스트 사이드바는 FooterPlayer의 플레이리스트 버튼으로만 열립니다. */}

				<DropContentWrapper
					id={"player"}
					asChild
				>
					<div className="flex flex-col h-full overflow-hidden border-l-2 border-black w-[275px] pb-15 bg-white">
						{/* 닫기 버튼 */}
						{isPlaylistOpen && (
							<button
								onClick={handleClose}
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
							<h3 className="py-[6px] border-y-[3px] text-black font-bold text-[20px] leading-[20px] mb-5">
								Current Playlist
							</h3>

							{!isLoggedIn ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-gray-500">로그인 후 이용해주세요.</div>
								</div>
							) : isLoading ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-gray-500">로딩 중...</div>
								</div>
							) : isError ? (
								<div className="flex justify-center items-center h-20">
									<div className="text-red-500">플레이리스트를 불러오는데 실패했습니다.</div>
								</div>
							) : allPlaylists.length > 0 ? (
								<div className="overflow-auto h-full">
									<ul className="flex flex-col gap-[10px]">
										{allPlaylists.map((playlist, index) =>
											playlist ? (
												<PlaylistItem
													key={playlist.id}
													{...playlist}
													isSelected={playlist.productId === currentTrackId}
													onClick={play}
												/>
											) : null,
										)}
									</ul>
								</div>
							) : (
								<p className="text-center pt-10">플레이리스트가 비어있습니다.</p>
							)}
						</div>
					</div>
				</DropContentWrapper>
			</div>
		</>
	);
};

export default PlaylistRightSidebar;
