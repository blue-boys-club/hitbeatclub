import { useCallback, useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useLikeProductMutation } from "@/apis/product/mutations";
import { useUpdateFollowedArtistMutation } from "@/apis/user/mutations";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useToast } from "@/hooks/use-toast";

/**
 * 드래그 앤 드롭 핸들러를 관리하는 커스텀 훅
 * 상품 드래그 시작/종료 시의 동작을 처리합니다.
 */
export const useDragDropHandler = () => {
	const { toast } = useToast();
	const { data: user } = useQuery(getUserMeQueryOption());
	const { mutate: likeProduct } = useLikeProductMutation();
	const { mutate: followArtist } = useUpdateFollowedArtistMutation(user?.id ?? 0);
	// const { mutate: followArtist } = useFollowArtistMutation();
	// const { mutate: addToCart } = useAddToCartMutation();

	// 라이센스 모달 상태 관리
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

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
			console.log("DragEnd", event, user);
			if (!user) {
				toast({
					description: "로그인 후 이용해주세요.",
				});
				return;
			}

			if (event?.active?.data.current?.type === "PRODUCT") {
				if (event.over?.id === "like-follow") {
					likeProduct(event.active?.data.current?.productId);
				} else if (event.over?.id === "cart") {
					// 로그인 체크

					// 라이센스 모달 열기
					const productId = event.active?.data.current?.productId;
					if (productId) {
						setSelectedProductId(productId);
						setIsLicenseModalOpen(true);
					}
				}
			} else if (event?.active?.data.current?.type === "ARTIST") {
				if (event.over?.id === "like-follow") {
					followArtist(event.active?.data.current?.artistId);
				}
			}
		},
		[likeProduct, followArtist, user, toast],
	);

	// 라이센스 모달 닫기 핸들러
	const handleCloseLicenseModal = useCallback(() => {
		setIsLicenseModalOpen(false);
		setSelectedProductId(null);
	}, []);

	return {
		handleDragStart,
		handleDragEnd,
		// 라이센스 모달 관련 상태와 핸들러 반환
		isLicenseModalOpen,
		selectedProductId,
		handleCloseLicenseModal,
	};
};
