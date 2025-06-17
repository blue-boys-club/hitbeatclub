"use client";

import { cn } from "@/common/utils";
import { OrderArtistSection } from "./OrderArtistSection";
import { OrderProductItem } from "./OrderProductItem";
import type { PaymentOrderItem } from "@hitbeatclub/shared-types/payment";

type OrderProductInfoProps = {
	items: PaymentOrderItem[];
};

/**
 * 상품 정보 전체 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderProductInfo = ({ items }: OrderProductInfoProps) => {
	const totalTracks = items.length;

	// Group items by seller (artist) for display
	const itemsBySeller = items.reduce(
		(acc, item) => {
			const sellerId = item.product.seller.id;
			if (!acc[sellerId]) {
				acc[sellerId] = {
					seller: item.product.seller,
					items: [],
				};
			}
			acc[sellerId].items.push(item);
			return acc;
		},
		{} as Record<number, { seller: PaymentOrderItem["product"]["seller"]; items: PaymentOrderItem[] }>,
	);

	return (
		<div className={cn("self-stretch flex flex-col justify-start items-start")}>
			{/* TODO: Revisit outline-white */}
			<div className={cn("self-stretch h-11 pb-2.5 inline-flex justify-between items-end")}>
				<div className={cn("text-hbc-black text-16px font-bold font-suit leading-normal")}>상품 정보</div>
				<div className={cn("text-hbc-black text-12px font-medium font-suisse leading-none tracking-tight")}>
					{totalTracks} Track{totalTracks > 1 ? "s" : ""}
				</div>
			</div>

			{/* --- SELLER GROUPED Product List --- */}
			<div className={cn("self-stretch flex flex-col justify-start items-start gap-2.5")}>
				{Object.entries(itemsBySeller).map(([sellerId, { seller, items: sellerItems }]) => (
					<div
						key={sellerId}
						className={cn(
							"self-stretch px-2 py-3 rounded-10px outline-1 outline-hbc-black flex flex-col justify-start items-start gap-8px",
						)}
					>
						<OrderArtistSection seller={seller} />

						{/* Individual Product Items for this Seller */}
						{sellerItems.map((item) => (
							<OrderProductItem
								key={item.product.id}
								item={item}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
