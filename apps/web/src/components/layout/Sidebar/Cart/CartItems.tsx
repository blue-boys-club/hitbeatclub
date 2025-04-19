import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import CartItem from "./CartItem";

const CartItems = memo(() => {
	const items = useQuery({
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		/* @ts-ignore TODO: Implement proper cart items query */
		queryKey: ["demo", "cart", "items"],
		queryFn: () => {
			return Promise.resolve(
				Array.from({ length: 15 }, (_, i) => ({
					id: i,
					imageUrl: "https://placehold.co/60x60.png",
				})),
			);
		},
	});

	return (
		<div
			className={cn(
				"gap-1 h-227px my-3px py-6px overflow-y-auto",
				"flex flex-wrap gap-4px content-start",
				"transition-all duration-300",
				"@200px/sidebar:w-291px w-139px",
			)}
		>
			{items.data?.map((item, index) => (
				<CartItem
					key={item.id}
					// TODO: Implement proper status
					status={index === 0 ? "playing" : index === 1 ? "paused" : "default"}
					// TODO: Implement proper type
					type={index % 2 === 0 ? "single" : "artist"}
					imageUrl={item.imageUrl}
					alt={`Cart item ${item.id}`}
				/>
			))}
		</div>
	);
});

CartItems.displayName = "CartItems";
export default CartItems;
