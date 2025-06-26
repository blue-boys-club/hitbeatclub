import { cn } from "@/common/utils";
import { memo } from "react";
import FollowItem from "./FollowItem";
import { UserFollowArtistListResponse } from "@hitbeatclub/shared-types";

interface FollowItemsProps {
	search?: string;
	sort?: "RECENT" | "NAME";
	followedArtists: UserFollowArtistListResponse[];
}

const FollowItems = memo(
	({
		search,
		sort,
		followedArtists,
		hasNextPage,
		loadMoreRef,
	}: FollowItemsProps & { hasNextPage: boolean; loadMoreRef: (node?: Element | null) => void }) => {
		return (
			<div
				className={cn(
					"gap-1 h-full mt-3px py-6px overflow-y-auto",
					"flex flex-col flex-1 gap-10px content-start",
					"transition-all duration-300",
					"ml-20px @200px/sidebar:ml-0px",
					"@200px/sidebar:w-300px w-135px pl-2",
					"@200px/sidebar:overflow-x-hidden overflow-x-auto",
				)}
			>
				{followedArtists?.map((item) => (
					<FollowItem
						key={item.artistId}
						follow={item}
					/>
				))}
				{hasNextPage && (
					<div
						ref={loadMoreRef}
						className="h-4"
					/>
				)}
			</div>
		);
	},
);

FollowItems.displayName = "FollowItems";
export default FollowItems;
