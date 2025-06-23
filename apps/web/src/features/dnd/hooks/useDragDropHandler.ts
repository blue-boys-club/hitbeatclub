import { useCallback, useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useLikeProductMutation } from "@/apis/product/mutations";
import { useUpdateFollowedArtistMutation } from "@/apis/user/mutations";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useToast } from "@/hooks/use-toast";
import { useStartPlayerMutation } from "@/apis/player/mutations";
import { AxiosError } from "axios";

/**
 * 드래그 앤 드롭 핸들러를 관리하는 커스텀 훅
 * 상품 드래그 시작/종료 시의 동작을 처리합니다.
 */
export const useDragDropHandler = () => {
	const { toast } = useToast();
	const { data: user } = useQuery(getUserMeQueryOption());
	const { mutateAsync: likeProduct } = useLikeProductMutation();
	const { mutateAsync: followArtist } = useUpdateFollowedArtistMutation(user?.id ?? 0);
	const { mutateAsync: startPlayer } = useStartPlayerMutation();
	// const { mutate: followArtist } = useFollowArtistMutation();
	// const { mutate: addToCart } = useAddToCartMutation();

	// 라이센스 모달 상태 관리
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		console.log("DragStart", event);
		console.log(event.active?.data.current);
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
					likeProduct(event.active?.data.current?.productId)
						.then(() => {
							toast({
								description: "좋아요가 완료되었습니다.",
							});
						})
						.catch((error: Error) => {
							const message = error instanceof AxiosError ? error.response?.data.detail : "좋아요에 실패했습니다.";
							toast({
								description: message,
							});
						});
				} else if (event.over?.id === "cart") {
					// 라이센스 모달 열기
					const productId = event.active?.data.current?.productId;
					if (productId) {
						setSelectedProductId(productId);
						setIsLicenseModalOpen(true);
					}
				} else if (event.over?.id === "player") {
					startPlayer({
						userId: user.id,
						productId: event.active?.data.current?.productId,
					})
						.then(() => {
							toast({
								description: "재생이 시작되었습니다.",
							});
						})
						.catch((error: Error) => {
							const message = error instanceof AxiosError ? error.response?.data.detail : "재생에 실패했습니다.";
							toast({
								description: message,
							});
						});
				}
			} else if (event?.active?.data.current?.type === "ARTIST") {
				if (event.over?.id === "like-follow") {
					followArtist(event.active?.data.current?.artistId)
						.then(() => {
							toast({
								description: "팔로우가 완료되었습니다.",
							});
						})
						.catch((error: Error) => {
							const message = error instanceof AxiosError ? error.response?.data.detail : "팔로우에 실패했습니다.";
							toast({
								description: message,
							});
						});
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
