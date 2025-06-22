import React from "react";
import Image from "next/image";
import { cn } from "@/common/utils";
import { PlayerListResponse } from "@hitbeatclub/shared-types";

interface PlaylistItemProps extends PlayerListResponse {
	isSelected: boolean;
	onClick: (id: number) => void;
}

const PlaylistItem = ({ id, coverImage, seller, productName, isSelected, onClick }: PlaylistItemProps) => {
	return (
		<li
			onClick={() => onClick(id)}
			className={cn("flex gap-4 pr-[1px] rounded-[5px] cursor-pointer", isSelected ? "bg-[#DFDFDF]" : "bg-white")}
		>
			<Image
				src={coverImage.url}
				alt="커버 이미지"
				width={48}
				height={48}
				className="rounded-[4px]"
			/>
			<div className="flex flex-col">
				<span className="text-black font-suisse text-base font-bold leading-normal">{productName}</span>
				<span className="text-black font-suisse text-base font-normal leading-normal">{seller.stageName}</span>
			</div>
		</li>
	);
};

export default PlaylistItem;
