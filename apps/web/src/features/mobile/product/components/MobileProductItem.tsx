"use client";

import { memo, useState, useCallback } from "react";
import Image from "next/image";
import { Acapella, Beat, Like } from "@/assets/svgs";
import { Heart } from "@/assets/svgs/Heart";
import { ProductSearchResponse } from "@/apis/search/search.type";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { ProductLikeResponse, ProductListPagingResponse } from "@hitbeatclub/shared-types";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlayTrack } from "@/hooks/use-play-track";
import { MobilePurchaseWithCartTrigger } from "./MobilePurchaseWithCartTrigger";

interface SearchProduct {
	type: "search";
	product: ProductSearchResponse["products"][number];
}

interface LikeProduct {
	type: "like";
	product: ProductLikeResponse;
}

interface FollowProduct {
	type: "follow";
	product: ProductListPagingResponse["data"][number];
}

type MobileProductItemProps = SearchProduct | LikeProduct | FollowProduct;

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const MobileProductItem = memo(({ type, product }: MobileProductItemProps) => {
	// 사용자 ID 가져오기
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	// Playlist control via hook
	const { setCurrentTrackIds } = usePlaylist();
	const { play } = usePlayTrack();

	// 좋아요 관련 mutations
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	// 좋아요 상태 확인
	const isLiked = type === "like" ? !!product.likedAt : !!product.isLiked;

	// BPM 표시 로직: minBpm과 maxBpm이 같으면 단일 값, 다르면 범위로 표시
	const bpmDisplay =
		product.minBpm === product.maxBpm ? `${product.minBpm}BPM` : `${product.minBpm}BPM - ${product.maxBpm}BPM`;

	// 앨범 커버 클릭 핸들러 (재생)
	const handleAlbumClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			// 플레이리스트에 단일 트랙 설정
			setCurrentTrackIds([product.id], 0);
			play(product.id);
		},
		[product, setCurrentTrackIds, play],
	);

	// 좋아요 토글 핸들러
	const handleLikeToggle = async () => {
		// 로그인 체크
		if (!userId) {
			alert("로그인이 필요합니다");
			return;
		}

		try {
			if (isLiked) {
				await unlikeProductMutation.mutateAsync(product.id);
			} else {
				await likeProductMutation.mutateAsync(product.id);
			}
		} catch (error) {
			console.error("좋아요 처리 중 오류:", error);
			alert("좋아요 처리에 실패했습니다");
		}
	};

	return (
		<div className="bg-[#dadada] p-2 rounded-5px flex justify-between hover:bg-[#D9D9D9] cursor-pointer">
			<div className="flex-1 flex gap-2">
				<div
					className="relative w-70px h-70px rounded-5px overflow-hidden cursor-pointer"
					onClick={handleAlbumClick}
				>
					<Image
						alt="album image"
						src={product.coverImage?.url || ""}
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col justify-between">
					<div className="flex flex-col">
						<span className="font-semibold text-xs">{product.productName}</span>
						<span className="text-10px leading-10px mt-1px">{product.seller.stageName}</span>
						<div className="mt-5px">{product.category === "ACAPELA" ? <Acapella /> : <Beat />}</div>
					</div>
					<div className="flex gap-2 text-10px leading-100%">
						<div className="flex flex-col">
							<span>{bpmDisplay}</span>
							<span>{product.musicKey}</span>
						</div>
						<div className="flex flex-col">
							{/* 라이센스 가격 정보 표시 */}
							{product.licenseInfo?.map((license, index) => (
								<span key={index}>
									{license.label[0]?.toUpperCase() + license.label.slice(1).toLowerCase()} :{" "}
									{license.price?.toLocaleString()} KRW
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-between">
				<div className="flex justify-end">
					<button
						onClick={handleLikeToggle}
						disabled={likeProductMutation.isPending || unlikeProductMutation.isPending}
						className="disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Heart active={isLiked} />
					</button>
				</div>

				<MobilePurchaseWithCartTrigger product={product}>
					<div className="flex flex-col items-end font-semibold">
						<button
							className="bg-black text-white h-13px px-6px rounded-15px text-8px disabled:opacity-50 disabled:cursor-not-allowed"
							// disabled={!userId}
						>
							Buy
						</button>
						<button
							className="bg-black text-white h-13px px-6px rounded-15px text-8px disabled:opacity-50 disabled:cursor-not-allowed"
							// disabled={!userId}
						>
							Add to Cart
						</button>
					</div>
				</MobilePurchaseWithCartTrigger>
			</div>
		</div>
	);
});

MobileProductItem.displayName = "MobileProductItem";
