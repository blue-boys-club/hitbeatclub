import { cn } from "@/common/utils";
import { memo, useMemo } from "react";
import CartItem from "./CartItem";
import { useUnifiedCart } from "@/hooks/use-unified-cart";

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
	// 통합 카트 훅 사용
	const { products, isLoading, isError } = useUnifiedCart();
	// 트랙 ID 배열 계산
	const trackIds = useMemo(() => (products ? products.map((p) => p.id) : []), [products]);

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
			{products.map((product, index) => (
				<CartItem
					key={product.id}
					productId={product.id}
					type={"single"}
					imageUrl={product.coverImage?.url}
					alt={product.productName}
					index={index}
					trackIds={trackIds}
				/>
			))}
		</div>
	);
});

CartItems.displayName = "CartItems";
export default CartItems;
