import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import LikeItem from "./LikeItem";
import { ProductItem } from "../types";

interface LikeItemsProps {
	search?: string;
	sort?: "recent" | "name";
}

const LikeItems = memo(({ search, sort }: LikeItemsProps) => {
	const items = useQuery<ProductItem[]>({
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore TODO: Implement proper like items query */
		queryKey: ["demo", "like", "items", search, sort],
		queryFn: () => {
			return Promise.resolve<ProductItem[]>(
				Array.from({ length: 0 }, (_, i) => ({
					id: i,
					title: `La Vie En Rose ${i}`,
					artist: "Moon River",
					imageUrl: "https://placehold.co/60x60.png",
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
				<LikeItem
					key={item.id}
					track={item}
				/>
			))}
		</div>
	);
});

LikeItems.displayName = "LikeItems";
export default LikeItems;
