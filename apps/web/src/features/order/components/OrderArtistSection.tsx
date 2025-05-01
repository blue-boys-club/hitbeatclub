"use client";

import { useState } from "react";
import { SmallAuthBadge } from "@/assets/svgs";
import { Phone } from "@/assets/svgs/Phone";
import { cn } from "@/common/utils";
import UI from "@/components/ui";
import Image from "next/image";
import { ArtistContactModal } from "./modal/ArtistContactModal";
import { ArtistInfo } from "../types";

type OrderArtistSectionProps = {
	artistInfo: ArtistInfo;
};

/**
 * 아티스트 정보 헤더 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderArtistSection = ({ artistInfo }: OrderArtistSectionProps) => {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	return (
		<>
			<div className={cn("self-stretch inline-flex justify-between items-center")}>
				<div className="flex items-center gap-17px">
					<Image
						className={cn("size-12 rounded-full outline-2 outline-offset-[-1px] outline-hbc-black")}
						src={artistInfo.iconUrl || "https://placehold.co/51x51"}
						alt={`${artistInfo.name} icon`}
						width={48}
						height={48}
					/>
					<div className={cn("flex items-center justify-center gap-5px ")}>
						<span className="font-bold text-hbc-black text-16px font-suisse">{artistInfo.name}</span>
						<SmallAuthBadge />
					</div>
				</div>

				<div className={cn("w-auto flex justify-start items-center gap-16")}>
					<div className={cn("text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>
						{artistInfo.realName}
					</div>
				</div>
				<div className={cn("flex items-center justify-center gap-6px")}>
					<UI.BodySmall>{artistInfo.location}</UI.BodySmall>
					<UI.BodySmall>{artistInfo.city}</UI.BodySmall>
				</div>
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
				links={artistInfo.links}
			/>
		</>
	);
};
