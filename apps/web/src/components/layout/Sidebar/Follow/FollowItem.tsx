import { SmallAuthBadge } from "@/assets/svgs";
import { FollowItem as FollowItemType } from "../types";
import { UserAvatar } from "@/components/ui";

export interface FollowItemProps {
	follow: FollowItemType;
}

export const FollowItem = ({ follow }: FollowItemProps) => {
	return (
		<div className="flex items-center justify-start gap-16px w-87px h-87px @200px/sidebar:w-280px @200px/sidebar:h-51px group/follow-item hover:cursor-pointer">
			<div className="flex-shrink-0 w-87px @200px/sidebar:w-51px">
				<UserAvatar
					size="sidebar"
					src={follow.imageUrl}
					alt={follow.name}
					isNotification={follow.isNotification}
				/>
			</div>
			<div className="hidden @200px/sidebar:flex  flex-row w-full h-full gap-3px">
				<div className="flex flex-col items-center justify-center h-full font-suit text-16px text-hbc-black leading-100% max-w-200px">
					<div className="w-full font-bold truncate group-hover/follow-item:underline decoration-solid decoration-2 underline-offset-[3.2px] [text-underline-position:from-font]">
						{follow.name}
					</div>
				</div>
				{follow.isVerified && (
					<div className="flex items-center justify-center h-full py-4px ">
						<SmallAuthBadge />
					</div>
				)}
			</div>
		</div>
	);
};

export default FollowItem;
