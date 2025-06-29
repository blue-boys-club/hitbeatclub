"use client";

import { memo, useCallback, useMemo } from "react";
import { Acapella, Beat, Like, PauseCircle, PlayCircle, ShoppingBag, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard } from "@/components/ui";
import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/common/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PurchaseWithCartTrigger } from "./PurchaseWithCartTrigger";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { usePlaylist } from "@/hooks/use-playlist";
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

interface ProductItemProps {
	productId?: number;
	title: string;
	artist: string;
	albumImgSrc: string;
	tags?: string[];
	type: "BEAT" | "ACAPELLA";
	isLiked?: boolean;
	onPlay?: () => void;
	onLike?: () => void;
	/** 컨텍스트 기반 자동 플레이리스트 설정 (옵션) */
	autoPlaylistConfig?: PlaylistAutoRequest;
	/** 원본 리스트상의 인덱스 (옵션) */
	trackIndex?: number;
}

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const ProductItem = memo(
	({
		productId,
		title,
		artist,
		albumImgSrc,
		tags = [],
		type,
		isLiked = false,
		onPlay,
		onLike,
		autoPlaylistConfig,
		trackIndex,
	}: ProductItemProps) => {
		const router = useRouter();
		const { status, currentProductId } = useAudioStore(
			useShallow((state) => ({
				status: state.status,
				currentProductId: state.productId,
			})),
		);

		const { play } = usePlayTrack();
		const { createAutoPlaylistAndPlay } = usePlaylist();

		const effectiveStatus = currentProductId === productId ? status : "paused";

		const onClickProduct = () => {
			router.push(`/products/${productId}`);
		};

		const onClickLike = () => {
			onLike?.();
		};

		const togglePlay = async () => {
			if (autoPlaylistConfig) {
				try {
					await createAutoPlaylistAndPlay(autoPlaylistConfig, trackIndex ?? 0);
					play(productId);
					onPlay?.();
					return;
				} catch (error) {
					// 실패 시 기본 재생 로직으로 폴백
					console.error("[ProductItem] createAutoPlaylistAndPlay failed", error);
				}
			}

			// 기본 재생 로직
			play(productId);
			onPlay?.();
		};

		return (
			<div className="flex justify-between items-center hover:bg-[#D9D9D9] cursor-pointer">
				<div className="flex items-center gap-5">
					<div className="flex items-center">
						<div
							className={cn(
								"transition-all duration-300",
								effectiveStatus === "playing" ? "opacity-100 translate-x-0 mr-3" : "opacity-0 -translate-x-2 w-0",
							)}
						>
							<SmallEqualizer />
						</div>

						<div
							className="relative group cursor-pointer"
							onClick={togglePlay}
						>
							<AlbumCoverCard
								albumImgSrc={albumImgSrc}
								size="lg"
								productId={productId}
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
								{effectiveStatus === "playing" ? <PauseCircle /> : <PlayCircle />}
							</div>
						</div>
					</div>

					<div
						className="flex flex-col"
						onClick={onClickProduct}
					>
						<p className="flex items-center gap-2.5 text-16px font-bold hover:underline">
							{title}
							{type === "BEAT" ? <Beat /> : <Acapella />}
						</p>
						<p className="text-16px">{artist}</p>
					</div>
				</div>

				<div className="flex gap-2">
					{tags.map((tag, index) => (
						<TagButton
							key={tag}
							name={tag}
							isClickable={false}
						/>
					))}
				</div>

				<div className="flex justify-between items-center gap-[10px]">
					<div
						className="w-8 h-8 flex justify-center items-center cursor-pointer"
						onClick={onClickLike}
					>
						{isLiked ? (
							<Image
								className="w-5 h-5"
								src="/assets/ActiveLike.png"
								alt="active like"
								width={20}
								height={20}
							/>
						) : (
							<Like />
						)}
					</div>
					<PurchaseWithCartTrigger productId={Number(productId)}>
						{(isInCart) => <ShoppingBag color={isInCart ? "#3884FF" : "white"} />}
					</PurchaseWithCartTrigger>
				</div>
			</div>
		);
	},
);

ProductItem.displayName = "ProductItem";
