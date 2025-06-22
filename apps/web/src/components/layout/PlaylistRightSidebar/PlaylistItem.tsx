import React, { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/common/utils";
import { PlayerListResponse } from "@hitbeatclub/shared-types";
import blankCdImage from "@/assets/images/blank-cd.png";

interface PlaylistItemProps extends PlayerListResponse {
	isSelected: boolean;
	onClick: (id: number) => void;
}

const PlaylistItem = ({ id, productId, coverImage, seller, productName, isSelected, onClick }: PlaylistItemProps) => {
	const albumImage = useMemo(() => {
		return coverImage?.url || blankCdImage;
	}, [coverImage]);

	return (
		<div
			onClick={() => onClick(productId)}
			data-id={id}
			data-product-id={productId}
			className={cn(
				"flex gap-4 pr-[1px] rounded-[5px] cursor-pointer overflow-hidden",
				isSelected ? "bg-[#DFDFDF]" : "bg-white",
			)}
		>
			<Image
				src={albumImage}
				alt="커버 이미지"
				width={48}
				height={48}
				className="rounded-[4px] aspect-square object-cover flex-shrink-0"
			/>
			<div className="flex flex-col min-w-0 flex-1 overflow-hidden">
				<span className="text-black font-suisse text-base font-bold leading-normal truncate">{productName}</span>
				<span className="text-black font-suisse text-base font-normal leading-normal truncate">{seller.stageName}</span>
			</div>
		</div>
	);
};

export default PlaylistItem;
