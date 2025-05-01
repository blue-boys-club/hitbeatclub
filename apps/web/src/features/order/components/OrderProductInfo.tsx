"use client";

import { cn } from "@/common/utils";
import { OrderArtistSection } from "./OrderArtistSection";
import { OrderProductItem } from "./OrderProductItem";
import { ProductsByArtist } from "../types";

type OrderProductInfoProps = {
	productsByArtist: ProductsByArtist;
};

/**
 * 상품 정보 전체 섹션 (아티스트별 그룹 포함)을 표시하는 컴포넌트입니다.
 */
export const OrderProductInfo = ({ productsByArtist }: OrderProductInfoProps) => {
	const totalTracks = Object.values(productsByArtist).reduce((sum, group) => sum + group.products.length, 0);

	return (
		<div className={cn("self-stretch flex flex-col justify-start items-start")}>
			{/* TODO: Revisit outline-white */}
			<div className={cn("self-stretch h-11 pb-2.5 inline-flex justify-between items-end")}>
				<div className={cn("text-hbc-black text-16px font-bold font-suit leading-normal")}>상품 정보</div>
				<div className={cn("text-hbc-black text-12px font-medium font-suisse leading-none tracking-tight")}>
					{totalTracks} Track{totalTracks > 1 ? "s" : ""}
				</div>
			</div>

			{/* --- ARTIST GROUPED Product List --- */}
			<div className={cn("self-stretch flex flex-col justify-start items-start gap-2.5")}>
				{Object.entries(productsByArtist).map(([artistId, { artistInfo, products }]) => (
					<div
						key={artistId}
						className={cn(
							"self-stretch px-2 py-3 rounded-10px outline-1 outline-hbc-black flex flex-col justify-start items-start gap-8px",
						)}
					>
						<OrderArtistSection artistInfo={artistInfo} />

						{/* Individual Product Items for this Artist */}
						{products.map((product) => (
							<OrderProductItem
								key={product.id}
								product={product}
								artistInfo={artistInfo}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
