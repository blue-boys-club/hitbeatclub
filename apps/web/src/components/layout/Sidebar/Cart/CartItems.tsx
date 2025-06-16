import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import CartItem from "./CartItem";
import { useCartListQueryOptions, getUserMeQueryOption } from "@/apis/user/query/user.query-option";

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
	// 사용자 정보 가져오기
	const { data: user } = useQuery(getUserMeQueryOption());

	// 서버 API를 사용하여 장바구니 데이터 가져오기
	const {
		data: cartItems,
		isLoading,
		isError,
	} = useQuery({
		...useCartListQueryOptions(user?.id ?? 0),
		enabled: !!user?.id,
	});

	// 로딩 상태
	if (isLoading) {
		return <CartItemsSkeleton />;
	}

	// 에러 상태 또는 데이터가 없는 경우
	if (isError || !cartItems || cartItems.length === 0) {
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
			{cartItems.map((cartItem) => {
				const { product } = cartItem;

				// product가 없는 경우 스킵
				if (!product) {
					return null;
				}

				return (
					<CartItem
						key={cartItem.id}
						// TODO: Implement proper status
						status={"default"}
						// TODO: Implement proper type
						type={"single"}
						imageUrl={product.coverImage?.url}
						alt={product.productName}
					/>
				);
			})}
		</div>
	);
});

CartItems.displayName = "CartItems";
export default CartItems;
