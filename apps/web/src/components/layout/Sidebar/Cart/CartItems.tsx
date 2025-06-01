import { cn } from "@/common/utils";
import { useQueries, useQuery } from "@tanstack/react-query";
import { memo } from "react";
import CartItem from "./CartItem";
import { useCartStore } from "@/stores/cart";
import { useShallow } from "zustand/react/shallow";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";

const CartItems = memo(() => {
	// const items = useQuery({
	// 	/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
	// 	/* @ts-ignore TODO: Implement proper cart items query */
	// 	queryKey: ["demo", "cart", "items"],
	// 	queryFn: () => {
	// 		return Promise.resolve(
	// 			Array.from({ length: 0 }, (_, i) => ({
	// 				id: i,
	// 				imageUrl: "https://placehold.co/60x60.png",
	// 			})),
	// 		);
	// 	},
	// });
	const { items } = useCartStore(
		useShallow((state) => ({
			items: state.items,
		})),
	);

	const productQueries = useQueries({
		queries: items.map((item) => ({
			...getProductQueryOption(item.id),
		})),
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
			{productQueries.map((query, index) => (
				<CartItem
					key={`${index}-${query.data?.id}`}
					// TODO: Implement proper status
					status={"default"}
					// TODO: Implement proper type
					type={"single"}
					imageUrl={query.data?.coverImage?.url}
					alt={query.data?.productName}
				/>
			))}
		</div>
	);
});

CartItems.displayName = "CartItems";
export default CartItems;
