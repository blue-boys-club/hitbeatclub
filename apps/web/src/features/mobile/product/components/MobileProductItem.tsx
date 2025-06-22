"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { Acapella, Beat, Like } from "@/assets/svgs";
import { Heart } from "@/assets/svgs/Heart";
import { ProductSearchResponse } from "@/apis/search/search.type";
import { useCreateCartItemMutation } from "@/apis/user/mutations/useCreateCartItemMutation";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { ProductLikeResponse } from "@hitbeatclub/shared-types";

interface SearchProduct {
	type: "search";
	product: ProductSearchResponse["products"][number];
}

interface LikeProduct {
	type: "like";
	product: ProductLikeResponse;
}

type MobileProductItemProps = SearchProduct | LikeProduct;

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const MobileProductItem = memo(({ type, product }: MobileProductItemProps) => {
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	// 사용자 ID 가져오기
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	// 장바구니 추가 mutation
	const createCartItemMutation = useCreateCartItemMutation(userId!);

	// 좋아요 관련 mutations
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	// 좋아요 상태 확인
	const isLiked = type === "like" ? !!product.likedAt : !!product.isLiked;

	// BPM 표시 로직: minBpm과 maxBpm이 같으면 단일 값, 다르면 범위로 표시
	const bpmDisplay =
		product.minBpm === product.maxBpm ? `${product.minBpm}BPM` : `${product.minBpm}BPM - ${product.maxBpm}BPM`;

	// 기본 라이센스 선택 (첫 번째 라이센스 또는 MASTER 타입 우선)
	// licenseInfo에서 label과 price만 있으므로, 임시로 ID를 생성해야 함
	const defaultLicense =
		product.licenseInfo?.find((license) => license.label.toUpperCase() === "MASTER") || product.licenseInfo?.[0];

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

	// 장바구니 추가 핸들러
	const handleAddToCart = async () => {
		// 로그인 체크
		if (!userId) {
			alert("로그인이 필요합니다");
			return;
		}

		// 라이센스 정보 체크
		if (!defaultLicense) {
			alert("라이센스 정보를 찾을 수 없습니다");
			return;
		}

		setIsAddingToCart(true);

		try {
			// TODO: 실제 API에서 licenseId를 제공받아야 함
			// 현재는 label 기반으로 임시 ID를 생성
			const tempLicenseId = defaultLicense.label.toUpperCase() === "MASTER" ? 1 : 2;

			await createCartItemMutation.mutateAsync({
				productId: product.id,
				licenseId: tempLicenseId,
			});

			alert("장바구니에 추가되었습니다");
		} catch (error) {
			console.error("장바구니 추가 실패:", error);
			alert("장바구니 추가에 실패했습니다");
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<div className="bg-[#dadada] p-2 rounded-5px flex justify-between hover:bg-[#D9D9D9] cursor-pointer">
			<div className="flex-1 flex gap-2">
				<div className="relative w-70px h-70px rounded-5px overflow-hidden">
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
				<div className="flex flex-col items-end font-semibold">
					<button className="bg-black text-white h-13px px-6px rounded-15px text-8px">Buy</button>
					<button
						className="bg-black text-white h-13px px-6px rounded-15px text-8px disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleAddToCart}
						disabled={isAddingToCart || !userId || !defaultLicense}
					>
						{isAddingToCart ? "추가중..." : "Add to Cart"}
					</button>
				</div>
			</div>
		</div>
	);
});

MobileProductItem.displayName = "MobileProductItem";
