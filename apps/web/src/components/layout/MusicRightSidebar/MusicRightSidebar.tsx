"use client";

import { memo, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { cn } from "@/common/utils";

import { Acapella, ArrowLeftMosaic, ArrowRightMosaic, Beat, Like } from "@/assets/svgs";
import { FreeDownloadButton } from "@/components/ui/FreeDownloadButton";
import { PurchaseButton } from "@/components/ui/PurchaseButton";
import { useShallow } from "zustand/react/shallow";
import { useLayoutStore } from "@/stores/layout";
import { useRouter } from "next/navigation";
import { PurchaseModal } from "./PurchaseModal";
import { useQuery } from "@tanstack/react-query";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import { useToast } from "@/hooks/use-toast";
import { useAudioStore } from "@/stores/audio";

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

	const { toast } = useToast();
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	const { audioStoreId, audioStoreIsLiked, updateIsLiked } = useAudioStore(
		useShallow((state) => ({
			audioStoreId: state.id,
			audioStoreIsLiked: state.isLiked,
			updateIsLiked: state.updateIsLiked,
		})),
	);

	const {
		isOpen,
		setRightSidebar,
		currentTrackId = 12,
	} = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			currentTrackId: state.rightSidebar.trackId,
		})),
	);

	const { data: currentTrack } = useQuery({
		...getProductQueryOption(Number(currentTrackId)),
		enabled: !!currentTrackId,
		select: (data) => data.data,
	});

	const isLiked = audioStoreId === Number(currentTrackId) ? audioStoreIsLiked : currentTrack?.isLiked;

	// TODO: 라이센스 가격 조회 로직 추가
	// const cheapestLicensePrice = currentTrack?.licenses.reduce((min, license) => Math.min(min, license.price), Infinity);
	const cheapestLicensePrice = 10000;

	const handleToggleOpen = () => {
		setRightSidebar(!isOpen);
	};

	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
		if (isLiked) {
			unlikeProductMutation.mutate(currentTrack.id, {
				onSuccess: () => {
					// 현재 트랙이 스토어의 트랙과 같으면 스토어도 업데이트
					if (audioStoreId === currentTrack.id) {
						updateIsLiked(false);
					}
				},
				onError: () => {
					toast({
						description: "좋아요 취소에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		} else {
			likeProductMutation.mutate(currentTrack.id, {
				onSuccess: () => {
					// 현재 트랙이 스토어의 트랙과 같으면 스토어도 업데이트
					if (audioStoreId === currentTrack.id) {
						updateIsLiked(true);
					}
				},
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
					{/* <AlbumAvatar src={currentTrack?.albumImgSrc || "https://placehold.co/360x360.png"} /> */}
				</div>

				<div className="px-6">
					<div className="w-full mb-2 text-hbc-black text-[32px] font-suisse font-bold tracking-[0.32px] leading-[40px]">
						{currentTrack?.productName}
					</div>

					<div className="flex items-center justify-between gap-2 mb-4">
						<div className="text-lg font-suisse">{currentTrack?.seller.stageName}</div>
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

						<div className="flex flex-wrap gap-2">
							{/* {currentTrack?.genres?.map((genre) => (
								<GenreButton
									key={genre}
									name={genre}
								/>
							))} */}
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

							<PurchaseButton
								iconColor="white"
								className="outline-4 outline-hbc-black"
								onClick={() => setIsPaymentModalOpen(true)}
							>
								{cheapestLicensePrice?.toLocaleString()} KRW
							</PurchaseButton>
						</div>

						<div
							onClick={onLikeClick}
							className="flex items-center justify-center w-8 h-8 transition-opacity cursor-pointer hover:opacity-80"
						>
							{isLiked ? (
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
			<PurchaseModal
				isOpen={isPaymentModalOpen}
				onClose={() => setIsPaymentModalOpen(false)}
				productId={Number(currentTrackId)}
			/>
		</div>
	);
});

MusicRightSidebar.displayName = "MusicRightSidebar";
