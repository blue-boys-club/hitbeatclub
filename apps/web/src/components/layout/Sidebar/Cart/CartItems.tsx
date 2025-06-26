import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import CartItem from "./CartItem";
import { getProductsByIdsQueryOption } from "@/apis/product/query/product.query-option";
import { useCartStore } from "@/stores/cart";
import { useShallow } from "zustand/react/shallow";

// Cart Items Skeleton Component
const CartItemsSkeleton = () => (
	<div
		className={cn(
			"gap-1 h-227px my-3px py-6px overflow-y-auto",
			"flex flex-wrap gap-4px content-start",
			"transition-all duration-300",
			"@200px/sidebar:w-291px w-139px",
		)}
	>
		{Array.from({ length: 4 }, (_, i) => (
			<div
				key={i}
				className="w-60px h-60px bg-gray-200 rounded-12px animate-pulse"
			/>
		))}
	</div>
);

const CartItems = memo(() => {
	// Local cart items (persisted in localStorage)
	const cartStoreItems = useCartStore(useShallow((state) => state.items));

	// 중복 제거된 상품 ID 배열
	const productIds = useMemo(() => Array.from(new Set(cartStoreItems.map((c) => c.productId))), [cartStoreItems]);

	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		...getProductsByIdsQueryOption(productIds),
		enabled: productIds.length > 0,
	});

	// 로딩 상태
	if (isLoading) {
		return <CartItemsSkeleton />;
	}

	// 에러 상태 또는 데이터가 없는 경우
	if (isError || !products || products.length === 0) {
		return (
			<div
				className={cn(
					"gap-1 h-227px my-3px py-6px overflow-y-auto",
					"flex flex-wrap gap-4px content-start",
					"transition-all duration-300",
					"@200px/sidebar:w-291px w-139px",
				)}
			>
				{/* 빈 상태 표시 */}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"gap-1 h-227px my-3px py-6px overflow-y-auto",
				"flex flex-wrap gap-4px content-start",
				"transition-all duration-300",
				"@200px/sidebar:w-291px w-139px",
			)}
		>
			{products.map((product) => (
				<CartItem
					key={product.id}
					productId={product.id}
					type={"single"}
					imageUrl={product.coverImage?.url}
					alt={product.productName}
				/>
			))}
		</div>
	);
});

CartItems.displayName = "CartItems";
export default CartItems;
