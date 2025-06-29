"use client";
import { CloseMosaic, CartPause, CartPlay } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Image from "next/image";
import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import PlaylistItem from "./PlaylistItem";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";
import { useQuery } from "@tanstack/react-query";
import { DropContentWrapper } from "@/features/dnd/components/DropContentWrapper";
import blankCdImage from "@/assets/images/blank-cd.png";
import { usePlayTrack } from "@/hooks/use-play-track";
import { usePlaylist } from "@/hooks/use-playlist";
import { getProductsByIdsQueryOption } from "@/apis/product/query/product.query-option";
import { useAudioStore } from "@/stores/audio";
import Link from "next/link";

const PlaylistRightSidebar = () => {
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

	// 새로운 플레이리스트 시스템 사용 (guest 지원)
	const { trackIds } = usePlaylist();

	// 플레이리스트의 각 트랙에 대한 상품 정보를 한 번에 조회
	const {
		data: products = [],
		isLoading,
		isError,
	} = useQuery({
		...getProductsByIdsQueryOption(trackIds),
		enabled: trackIds.length > 0,
	});

	const handleClose = useCallback(() => {
		setRightSidebar(false);
	}, [setRightSidebar]);

	// 재생 훅: { play }
	const { play } = usePlayTrack();

	// 오디오 상태 가져오기
	const { status } = useAudioStore(useShallow((state) => ({ status: state.status })));

	const effectiveStatus: "playing" | "paused" | "default" = (() => {
		if (currentTrackId == null || currentTrackId === 0) return "default";
		if (status === "playing" || status === "paused") return status;
		return "default";
	})();

	// 플레이리스트 데이터를 PlayerListResponse 형태로 변환
	const allPlaylists = useMemo(() => {
		// trackIds 순서를 유지하기 위해 Map 으로 정렬
		const productMap = new Map(products.map((p) => [p.id, p]));
		return trackIds
			.map((trackId) => {
				const product = productMap.get(trackId);
				if (!product) return null;
				return {
					id: product.id,
					productId: product.id,
					productName: product.productName,
					seller: {
						id: product.seller?.id || 0,
						stageName: product.seller?.stageName || "",
						profileImageUrl: product.seller?.profileImageUrl || "",
						slug: product.seller?.slug || "",
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
	}, [products, trackIds]);

	// 현재 선택된 플레이리스트 찾기 - useMemo로 최적화
	const selectedPlaylist = useMemo(() => {
		return allPlaylists.find((playlist) => playlist?.productId === currentTrackId);
	}, [allPlaylists, currentTrackId]);

	const albumImage = useMemo(() => {
		return selectedPlaylist?.coverImage?.url || blankCdImage;
	}, [selectedPlaylist]);

	// ====== Title marquee animation ======
	const titleRef = useRef<HTMLDivElement>(null);
	const titleContainerRef = useRef<HTMLDivElement>(null);
	const [shouldAnimate, setShouldAnimate] = useState(false);

	useEffect(() => {
		// when selected playlist or its name changes, decide animation
		const checkAndSetAnimation = () => {
			const titleElement = titleRef.current;
			const containerElement = titleContainerRef.current;

			if (titleElement && containerElement && selectedPlaylist?.productName) {
				// temporarily remove animation class to measure
				titleElement.classList.remove("animate-marquee");

				// create temp span to measure single text width
				const tempSpan = document.createElement("span");
				tempSpan.textContent = selectedPlaylist.productName;
				tempSpan.style.visibility = "hidden";
				tempSpan.style.position = "absolute";
				tempSpan.style.whiteSpace = "nowrap";
				tempSpan.style.fontSize = "24px"; // matches text-[24px]
				tempSpan.style.fontWeight = "bold";
				containerElement.appendChild(tempSpan);

				const textWidth = tempSpan.offsetWidth;
				const containerWidth = containerElement.clientWidth;

				containerElement.removeChild(tempSpan);

				if (textWidth > containerWidth) {
					const scrollDistance = textWidth + 32; // 32px gap same as mr-8
					const duration = Math.max(6, Math.min(15, scrollDistance / 40));
					titleElement.style.setProperty("--scroll-distance", `-${scrollDistance}px`);
					titleElement.style.setProperty("--marquee-duration", `${duration}s`);
					setShouldAnimate(true);
					requestAnimationFrame(() => {
						titleElement.classList.add("animate-marquee");
					});
				} else {
					setShouldAnimate(false);
				}
			}
		};

		const timeoutId = setTimeout(checkAndSetAnimation, 50);
		return () => clearTimeout(timeoutId);
	}, [selectedPlaylist?.productName]);

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
									<div
										className="relative w-[54px] h-[54px] flex-shrink-0 cursor-pointer"
										onClick={() => {
											if (selectedPlaylist) {
												play(selectedPlaylist.productId);
											}
										}}
									>
										<Image
											src={albumImage}
											alt="앨범 표지"
											width={54}
											height={54}
											className="object-cover aspect-square rounded-[8px] w-full h-full"
										/>

										{effectiveStatus !== "default" && (
											<div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-[8px]">
												{effectiveStatus === "playing" ? <CartPause /> : <CartPlay />}
											</div>
										)}
									</div>
									<div className="pt-1 flex flex-col gap-[2px] w-[155px]">
										{/* Title with marquee animation */}
										<div
											ref={titleContainerRef}
											className="w-full overflow-hidden"
										>
											<div
												ref={titleRef}
												className="whitespace-nowrap"
											>
												{shouldAnimate ? (
													<>
														<Link
															href={`/product/${selectedPlaylist.id}`}
															className="text-black font-bold text-[24px] leading-[28px] tracking-[0.24px] hover:underline mr-8"
														>
															{selectedPlaylist.productName}
														</Link>
														<Link
															href={`/product/${selectedPlaylist.id}`}
															className="text-black font-bold text-[24px] leading-[28px] tracking-[0.24px] hover:underline mr-8"
														>
															{selectedPlaylist.productName}
														</Link>
													</>
												) : (
													<Link
														href={`/product/${selectedPlaylist.id}`}
														className="text-black font-bold text-[24px] leading-[28px] tracking-[0.24px] hover:underline"
													>
														{selectedPlaylist.productName}
													</Link>
												)}
											</div>
										</div>
										<Link
											href={`/artists/${selectedPlaylist.seller.slug}`}
											className="text-black font-bold text-[16px] leading-[16px] tracking-[-0.32px] w-[155px] hover:underline"
										>
											{selectedPlaylist.seller.stageName}
										</Link>
									</div>
								</div>
							) : (
								<div className="h-[54px] mb-7" />
							)}
						</div>

						<div className="flex-1 min-h-0 px-6">
							<h3 className="py-[6px] border-y-[3px] text-black font-bold text-[20px] leading-[20px] mb-5">Recent</h3>

							{isLoading ? (
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
													// isSelected={playlist.productId === currentTrackId}
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
