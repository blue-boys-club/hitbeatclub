import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import FollowItem from "./FollowItem";
import { FollowItem as FollowItemType } from "../types";

interface FollowItemsProps {
	search?: string;
	sort?: "recent" | "name";
}

const FollowItems = memo(({ search, sort }: FollowItemsProps) => {
	const items = useQuery<FollowItemType[]>({
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore TODO: Implement proper follow items query */
		queryKey: ["demo", "follow", "items", search, sort],
		queryFn: () => {
			return Promise.resolve<FollowItemType[]>(
				Array.from({ length: 0 }, (_, i) => ({
					id: i,
					name: `La Vie En Rose ${i}`,
					imageUrl: "https://placehold.co/60x60.png",
					isNotification: (i % 2) - 1 === 0,
					isVerified: i % 2 === 0,
				})),
			);
		},
	});

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
			{items.data?.map((item) => (
				<FollowItem
					key={item.id}
					follow={item}
				/>
			))}
		</div>
	);
});

FollowItems.displayName = "FollowItems";
export default FollowItems;
