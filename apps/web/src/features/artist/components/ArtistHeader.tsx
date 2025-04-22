import { FollowArtistBadge } from "@/assets/svgs";
import { cn } from "@/common/utils";
import React from "react";

interface ArtistHeaderProps {
	following?: number;
}
const ArtistHeader = ({ following = 0 }: ArtistHeaderProps) => {
	return (
		<header className={cn("w-full border-b-black border-b-6px px-9 pb-4 flex justify-between items-end")}>
			<div className="flex gap-[10px]">
				<FollowArtistBadge />
				<span className="text-[32px] font-bold leading-[100%] tracking-[0.32px]">MY ARTISTS</span>
			</div>
			<div className="flex gap-2">
				<span className="text-[16px] font-semibold leading-[100%] tracking-[-0.32px]">user</span>
				<span className="text-[16px] font-semibold leading-[100%] tracking-[-0.32px] text-[#87878A]">
					{following} Following
				</span>
			</div>
		</header>
	);
};

export default ArtistHeader;
