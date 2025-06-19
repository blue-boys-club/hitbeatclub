import { useCallback } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useLikeProductMutation } from "@/apis/product/mutations";

/**
 * 드래그 앤 드롭 핸들러를 관리하는 커스텀 훅
 * 상품 드래그 시작/종료 시의 동작을 처리합니다.
 */
export const useDragDropHandler = () => {
	const { mutate: likeProduct } = useLikeProductMutation();
	// const { mutate: followArtist } = useFollowArtistMutation();
	// const { mutate: addToCart } = useAddToCartMutation();

	const handleDragStart = useCallback((event: DragStartEvent) => {
		console.log("DragStart", event);
		const { active } = event;
		if (active?.data.current?.type === "PRODUCT") {
			const { productName, sellerStageName } = active.data.current.meta;
			console.log(productName, sellerStageName);
		}
	}, []);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			console.log("DragEnd", event);

			if (event?.active?.data.current?.type === "PRODUCT") {
				if (event.over?.id === "like") {
					likeProduct(event.active?.data.current?.productId);
				}
				// if (event.over?.id === "cart") {
				// 	addToCart(event.active?.data.current?.productId);
				// }
			}
		},
		[likeProduct],
	);

	return {
		handleDragStart,
		handleDragEnd,
	};
};
