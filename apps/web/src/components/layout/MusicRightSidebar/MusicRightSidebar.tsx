"use client";

import { memo, useEffect, useState, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { cn } from "@/common/utils";

import { Acapella, ArrowLeftMosaic, ArrowRightMosaic, Beat, Like } from "@/assets/svgs";
import { FreeDownloadButton } from "@/components/ui/FreeDownloadButton";
import { useShallow } from "zustand/react/shallow";
import { useLayoutStore } from "@/stores/layout";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import { useToast } from "@/hooks/use-toast";
import { useAudioStore } from "@/stores/audio";
import { PurchaseWithCartTrigger } from "@/features/product/components";
import { GenreButton } from "@/components/ui/GenreButton";
import { TagButton } from "@/components/ui/TagButton";
import { AlbumAvatar } from "@/components/ui/Avatar/AlbumAvatar";
import { usePlayTrack } from "@/hooks/use-play-track";

/**
 * 음악 상세 정보를 보여주는 우측 사이드바 컴포넌트
 * - 트랙 정보 표시 (제목, 아티스트, 설명, 장르 등)
 * - 좋아요 기능
 * - 무료 다운로드 및 구매 기능
 * - 사이드바 열기/닫기 기능
 */
export const MusicRightSidebar = memo(() => {
	const router = useRouter();
	const { data: user } = useQuery(getUserMeQueryOption());

	const titleRef = useRef<HTMLDivElement>(null);
	const titleContainerRef = useRef<HTMLDivElement>(null);
	const [shouldAnimate, setShouldAnimate] = useState(false);

	const { toast } = useToast();
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	const { isPlaying } = useAudioStore(
		useShallow((state) => ({
			isPlaying: state.isPlaying,
		})),
	);

	const { isOpen, setRightSidebar, currentTrackId } = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			currentTrackId: state.player.trackId,
		})),
	);

	const { data: currentTrack } = useQuery({
		...getProductQueryOption(Number(currentTrackId)),
		enabled: !!currentTrackId,
		select: (data) => data.data,
	});

	const { play } = usePlayTrack();

	// 제목 텍스트가 컨테이너를 넘어가는지 확인하고 애니메이션 설정
	useEffect(() => {
		const checkAndSetAnimation = () => {
			const titleElement = titleRef.current;
			const containerElement = titleContainerRef.current;

			if (titleElement && containerElement && currentTrack?.productName) {
				// 임시로 애니메이션을 제거하고 실제 너비 측정
				titleElement.classList.remove("animate-marquee");

				// 한 개의 텍스트만으로 너비 측정을 위해 임시 span 생성
				const tempSpan = document.createElement("span");
				tempSpan.textContent = currentTrack.productName;
				tempSpan.style.visibility = "hidden";
				tempSpan.style.position = "absolute";
				tempSpan.style.whiteSpace = "nowrap";
				tempSpan.style.fontSize = "32px";
				tempSpan.style.fontFamily = "inherit";
				tempSpan.style.fontWeight = "bold";
				containerElement.appendChild(tempSpan);

				const textWidth = tempSpan.offsetWidth;
				const containerWidth = containerElement.clientWidth;

				containerElement.removeChild(tempSpan);

				if (textWidth > containerWidth) {
					// 스크롤해야 할 거리 계산 (텍스트 전체 길이 + 여백)
					const scrollDistance = textWidth + 32; // 32px는 mr-8 (2rem)

					// 애니메이션 지속 시간을 텍스트 길이에 비례해서 계산 (적절한 속도 유지)
					const duration = Math.max(6, Math.min(15, scrollDistance / 40)); // 6초~15초 사이

					titleElement.style.setProperty("--scroll-distance", `-${scrollDistance}px`);
					titleElement.style.setProperty("--marquee-duration", `${duration}s`);

					setShouldAnimate(true);

					// 다음 프레임에서 애니메이션 클래스 추가
					requestAnimationFrame(() => {
						titleElement.classList.add("animate-marquee");
					});
				} else {
					setShouldAnimate(false);
				}
			}
		};

		// DOM이 업데이트된 후에 실행
		const timeoutId = setTimeout(checkAndSetAnimation, 100);
		return () => clearTimeout(timeoutId);
	}, [currentTrack?.productName]);

	const handleToggleOpen = () => {
		setRightSidebar(!isOpen);
	};

	const onLikeClick = () => {
		if (!user) {
			toast({
				description: "로그인 후 이용해주세요.",
			});
			return;
		}

		if (!currentTrack) {
			return;
		}

		// 현재 좋아요 상태에 따라 적절한 mutation 실행
		if (currentTrack?.isLiked) {
			unlikeProductMutation.mutate(currentTrack.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요 취소에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		} else {
			likeProductMutation.mutate(currentTrack.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		}
	};

	const onClickFreeDownload = () => {
		if (!user?.subscribedAt) {
			router.push("/subscribe");
		} else {
			alert("준비중입니다.");
			// window.open(currentTrack?.downloadUrl, "_blank");
		}
	};

	return (
		<div
			className={cn(
				"fixed right-0 top-87px h-[calc(100vh-92px-72px-15px)] transition-all duration-500 ease-in-out",
				isOpen ? "w-80" : "w-0",
			)}
		>
			<div className="flex flex-col h-full overflow-hidden border-l-2 border-black w-80 pb-15 bg-hbc-white">
				<button
					onClick={handleToggleOpen}
					className={cn(
						"absolute top-0 cursor-pointer hover:opacity-80 transition-opacity",
						isOpen ? "left-0" : "-left-8",
					)}
				>
					{isOpen ? <ArrowRightMosaic /> : <ArrowLeftMosaic />}
				</button>

				<div className="flex items-center justify-center mt-12 mb-6">
					{currentTrack && (
						<AlbumAvatar
							src={currentTrack?.coverImage?.url || "https://placehold.co/360x360.png"}
							onClick={() => play(currentTrack.id)}
							className="cursor-pointer"
							isPlaying={isPlaying}
						/>
					)}
				</div>

				<div className="px-6">
					<div
						ref={titleContainerRef}
						className="w-full mb-2 text-hbc-black text-[32px] font-suisse font-bold tracking-[0.32px] leading-[40px] overflow-hidden"
					>
						<div
							ref={titleRef}
							className="whitespace-nowrap"
						>
							{shouldAnimate ? (
								<>
									<span className="whitespace-nowrap mr-8">{currentTrack?.productName}</span>
									<span className="whitespace-nowrap mr-8">{currentTrack?.productName}</span>
								</>
							) : (
								<span className="whitespace-nowrap">{currentTrack?.productName}</span>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between gap-2 mb-4">
						<div
							className="text-lg font-suisse cursor-pointer"
							onClick={() => {
								router.push(`/artists/${currentTrack?.seller.id}`);
							}}
						>
							{currentTrack?.seller.stageName}
						</div>
						<div>
							{currentTrack?.category === "BEAT" && <Beat className="w-16 h-4" />}
							{currentTrack?.category === "ACAPELA" && <Acapella className="w-16 h-4" />}
						</div>
					</div>

					{/* divider */}
					<div className="w-full h-[1px] bg-hbc-black outline-[4px] outline-HBC-Black"></div>
				</div>

				<ScrollArea.Root className="flex-1 min-h-0 px-6 my-4">
					<ScrollArea.Viewport className="p-2 size-full">
						<div className="mb-3 text-base font-bold leading-snug font-suit">곡 정보</div>
						<div className="mb-6 text-base font-bold leading-relaxed text-hbc-gray-300 font-suit">
							{currentTrack?.description}
						</div>

						<div className="flex flex-col gap-2">
							<div className="flex flex-wrap gap-2">
								{currentTrack?.musicKey && (
									<GenreButton
										name={`${currentTrack?.musicKey || ""} ${(currentTrack?.scaleType || "").toLowerCase()}`}
										showDeleteButton={false}
									/>
								)}
								{currentTrack?.minBpm && (
									<GenreButton
										name={
											currentTrack?.minBpm === currentTrack?.maxBpm
												? `BPM ${currentTrack?.minBpm || 0}`
												: `BPM ${currentTrack?.minBpm || 0} - ${currentTrack?.maxBpm || 0}`
										}
										showDeleteButton={false}
									/>
								)}
							</div>
							<div className="flex flex-wrap gap-2">
								{currentTrack?.genres?.map((genre) => (
									<GenreButton
										key={genre.id}
										name={genre.name}
									/>
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								{currentTrack?.tags?.map((tag) => (
									<TagButton
										key={tag.id}
										name={tag.name}
									/>
								))}
							</div>
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation="vertical"
						className={cn(
							"flex select-none touch-none transition-colors duration-[160ms] ease-out",
							"data-[orientation=vertical]:w-2 bg-black/5",
							"hover:bg-black/10",
						)}
					>
						<ScrollArea.Thumb className="flex-1 bg-hbc-gray-200 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>

				<div className="px-6">
					{/* divider */}
					<div className="w-full h-[1px] bg-hbc-black outline-[4px] outline-HBC-Black mb-4"></div>

					<div className="flex justify-between pb-4">
						<div className="flex flex-col gap-0.5">
							{!!currentTrack?.isFreeDownload && (
								<FreeDownloadButton
									variant="secondary"
									className="outline-4 outline-hbc-black px-2.5 font-suisse"
									onClick={onClickFreeDownload}
								>
									Free Download
								</FreeDownloadButton>
							)}

							{currentTrackId && <PurchaseWithCartTrigger productId={Number(currentTrackId)} />}
						</div>

						<div
							onClick={onLikeClick}
							className="flex items-center justify-center w-8 h-8 transition-opacity cursor-pointer hover:opacity-80"
						>
							{currentTrack?.isLiked ? (
								<Image
									src="/assets/ActiveLike.png"
									alt="active like"
									width={20}
									height={20}
								/>
							) : (
								<Like />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

MusicRightSidebar.displayName = "MusicRightSidebar";
