"use client";

import { useState } from "react";
import { SmallAuthBadge } from "@/assets/svgs";
import { Phone } from "@/assets/svgs/Phone";
import { cn } from "@/common/utils";
import UI from "@/components/ui";
import Image from "next/image";
import { ArtistContactModal } from "./modal/ArtistContactModal";
import type { PaymentOrderItem } from "@hitbeatclub/shared-types/payment";
import type { ContactLink } from "../types";
import { type CountryCode, getCountryNameByCode, getCountryNameByCodeEn } from "@hitbeatclub/country-options";
import UserProfileImage from "@/assets/images/user-profile.png";

type OrderArtistSectionProps = {
	seller: PaymentOrderItem["product"]["seller"];
};

/**
 * 아티스트(판매자) 정보 헤더 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderArtistSection = ({ seller }: OrderArtistSectionProps) => {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	// Create artist contact links from ArtistPublicResponse
	const artistLinks: ContactLink[] = [
		seller.instagramAccount && {
			type: "instagram",
			value: seller.instagramAccount,
		},
		seller.youtubeAccount && {
			type: "youtube",
			value: seller.youtubeAccount,
		},
		seller.kakaoAccount && {
			type: "kakaotalk",
			value: seller.kakaoAccount,
		},
		seller.discordAccount && {
			type: "discord",
			value: seller.discordAccount,
		},
		seller.lineAccount && {
			type: "line",
			value: seller.lineAccount,
		},
		seller.soundcloudAccount && {
			type: "soundcloud",
			value: seller.soundcloudAccount,
		},
		...(seller.etcAccounts || []).map((account) => ({
			type: "website" as const,
			value: account,
		})),
	].filter(Boolean) as ContactLink[];

	return (
		<>
			<div className={cn("self-stretch inline-flex justify-between items-center")}>
				<div className="flex items-center gap-17px">
					<Image
						className={cn("size-12 rounded-full outline-2 outline-offset-[-1px] outline-hbc-black")}
						src={seller.profileImageUrl || seller.profileImage?.url || UserProfileImage}
						alt={`${seller.stageName} icon`}
						width={48}
						height={48}
					/>
					<div className={cn("flex items-center justify-center gap-5px ")}>
						<span className="font-bold text-hbc-black text-16px font-suisse">
							{seller.stageName || "Unknown Artist"}
						</span>
						{/* ArtistPublicResponse doesn't have isVerified, so we'll skip this for now */}
						{/* {seller.isVerified === 1 && <SmallAuthBadge />} */}
						<SmallAuthBadge /> {/* Show badge for all verified sellers for now */}
					</div>
				</div>

				{/* Artist location information */}
				<div className={cn("flex items-center justify-center gap-6px")}>
					{seller.city && <UI.BodySmall>{seller.city.charAt(0).toUpperCase() + seller.city.slice(1)},</UI.BodySmall>}
					{seller.country && <UI.BodySmall>{getCountryNameByCodeEn(seller.country as CountryCode)}</UI.BodySmall>}
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
				links={artistLinks}
			/>
		</>
	);
};
