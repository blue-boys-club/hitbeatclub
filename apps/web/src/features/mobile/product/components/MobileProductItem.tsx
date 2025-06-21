"use client";

import { memo } from "react";
import Image from "next/image";
import { Acapella, Beat, Like } from "@/assets/svgs";
import { Heart } from "@/assets/svgs/Heart";
import { ProductSearchResponse } from "@/apis/search/search.type";

interface MobileProductItemProps {
	product: ProductSearchResponse["products"][number];
}

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const MobileProductItem = memo(({ product }: MobileProductItemProps) => {
	// BPM 표시 로직: minBpm과 maxBpm이 같으면 단일 값, 다르면 범위로 표시
	const bpmDisplay =
		product.minBpm === product.maxBpm ? `${product.minBpm}BPM` : `${product.minBpm}BPM - ${product.maxBpm}BPM`;

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
							{/* TODO: 가격 표시 로직 추가 */}
							<span>Basic: 50,000KRW</span>
							<span>Pro: 120,000KRW</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-between">
				<div className="flex justify-end">
					<Heart active={!!product.isLiked} />
				</div>
				<div className="flex flex-col items-end font-semibold">
					<button className="bg-black text-white h-13px px-6px rounded-15px text-8px">Buy</button>
					<button className="bg-black text-white h-13px px-6px rounded-15px text-8px">Add to Cart</button>
				</div>
			</div>
		</div>
	);
});

MobileProductItem.displayName = "MobileProductItem";
