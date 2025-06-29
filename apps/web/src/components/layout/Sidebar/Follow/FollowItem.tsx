"use client";

import { cn } from "@/common/utils";
import { UserAvatar } from "@/components/ui";
import UserProfileImage from "@/assets/images/user-profile.png";
import { useMemo } from "react";
import Link from "next/link";
import { UserFollowArtistListResponse } from "@hitbeatclub/shared-types";

export interface FollowItemProps {
	follow: UserFollowArtistListResponse;
}

export const FollowItem = ({ follow }: FollowItemProps) => {
	const artistProfileImageUrl = useMemo(() => {
		return follow.profileImageUrl || UserProfileImage;
	}, [follow.profileImageUrl]);

	return (
		<Link
			className="flex items-center justify-start gap-16px w-87px h-87px @200px/sidebar:w-280px @200px/sidebar:h-51px group/follow-item hover:cursor-pointer"
			href={`/artists/${follow.slug}`}
		>
			<div className="flex-shrink-0 w-87px @200px/sidebar:w-51px">
				<UserAvatar
					size="sidebar"
					src={artistProfileImageUrl}
					alt={follow.stageName ?? ""}
					isNotification={false}
					className={cn("bg-hbc-black", artistProfileImageUrl === UserProfileImage && "bg-hbc-white")}
				/>
			</div>
			<div className="hidden @200px/sidebar:flex  flex-row w-full h-full gap-3px">
				<div className="flex flex-col items-center justify-center h-full font-suit text-16px text-hbc-black leading-100% max-w-200px">
					<div className="w-full hover:underline text-black font-suit text-16px font-bold leading-normal truncate underline-offset-[1px] [text-underline-position:from-font]">
						{follow.stageName ?? ""}
					</div>
				</div>
				{/* {follow.isVerified && (
					<div className="flex items-center justify-center h-full py-4px ">
						<SmallAuthBadge />
					</div>
				)} */}
			</div>
		</Link>
	);
};

export default FollowItem;
