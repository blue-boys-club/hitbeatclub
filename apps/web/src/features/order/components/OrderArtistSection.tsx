"use client";

import { useState } from "react";
import { SmallAuthBadge } from "@/assets/svgs";
import { Phone } from "@/assets/svgs/Phone";
import { cn } from "@/common/utils";
import UI from "@/components/ui";
import Image from "next/image";
import { ArtistContactModal } from "./modal/ArtistContactModal";
import type { PaymentOrderItem } from "@hitbeatclub/shared-types/payment";

type OrderArtistSectionProps = {
	seller: PaymentOrderItem["product"]["seller"];
};

/**
 * 아티스트(판매자) 정보 헤더 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderArtistSection = ({ seller }: OrderArtistSectionProps) => {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	return (
		<>
			<div className={cn("self-stretch inline-flex justify-between items-center")}>
				<div className="flex items-center gap-17px">
					<Image
						className={cn("size-12 rounded-full outline-2 outline-offset-[-1px] outline-hbc-black")}
						src={seller.profileImageUrl || "https://placehold.co/51x51"}
						alt={`${seller.stageName} icon`}
						width={48}
						height={48}
					/>
					<div className={cn("flex items-center justify-center gap-5px ")}>
						<span className="font-bold text-hbc-black text-16px font-suisse">{seller.stageName}</span>
						{seller.isVerified === 1 && <SmallAuthBadge />}
					</div>
				</div>

				{/* TODO: Add seller ID or other identification if needed */}
				<div className={cn("w-auto flex justify-start items-center gap-16")}>
					<div className={cn("text-hbc-gray-400 text-12px font-bold font-suit leading-none tracking-tight")}>
						ID: {seller.id}
					</div>
				</div>

				{/* TODO: Add location information if available in seller data */}
				{/* <div className={cn("flex items-center justify-center gap-6px")}>
					<UI.BodySmall>{seller.country}</UI.BodySmall>
					<UI.BodySmall>{seller.city}</UI.BodySmall>
				</div> */}

				<div
					className={cn("size-6 relative overflow-hidden group cursor-pointer")}
					onClick={() => setIsContactModalOpen(true)}
				>
					<Phone className="group-hover:[&_path]:fill-[#2BAC3F]" />
				</div>
			</div>

			<ArtistContactModal
				isOpen={isContactModalOpen}
				onClose={() => setIsContactModalOpen(false)}
				links={[]} // TODO: Need to get seller contact links from somewhere else
			/>
		</>
	);
};
