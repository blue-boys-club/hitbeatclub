import { useCallback, useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useLikeProductMutation } from "@/apis/product/mutations";
import { useUpdateFollowedArtistMutation } from "@/apis/user/mutations";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useToast } from "@/hooks/use-toast";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlayTrack } from "@/hooks/use-play-track";
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

	// 새로운 플레이리스트 시스템 사용
	const { addTrackToPlaylist, playTrackAtIndex, trackIds } = usePlaylist();
	const { play } = usePlayTrack();

	// 라이센스 모달 상태 관리
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		console.log("DragStart", event);
		console.log(event.active?.data.current);
		const { active } = event;
		if (active?.data.current?.type === "PRODUCT") {
			const { productName, seller } = active.data.current.meta;
			console.log(productName, seller?.stageName);
		}
	}, []);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			console.log("DragEnd", event, user);

			// PRODUCT 드래그 처리
			if (event?.active?.data.current?.type === "PRODUCT") {
				const productId = event.active?.data.current?.productId;

				if (event.over?.id === "cart") {
					// 비회원도 라이센스 모달을 열 수 있다.
					if (productId) {
						setSelectedProductId(productId);
						setIsLicenseModalOpen(true);
					}
					return;
				}

				// 아래 작업은 로그인 필요
				if (!user) {
					toast({ description: "로그인 후 이용해주세요." });
					return;
				}

				if (event.over?.id === "like-follow") {
					likeProduct(productId)
						.then(() => {
							toast({ description: "좋아요가 완료되었습니다." });
						})
						.catch((error: Error) => {
							const message = error instanceof AxiosError ? error.response?.data.detail : "좋아요에 실패했습니다.";
							toast({ description: message });
						});
				} else if (event.over?.id === "player") {
					// 새로운 플레이리스트 시스템 사용
					try {
						// 트랙이 이미 플레이리스트에 있는지 확인
						const existingIndex = trackIds.indexOf(productId);

						if (existingIndex !== -1) {
							// 이미 플레이리스트에 있으면 해당 인덱스로 이동
							playTrackAtIndex(existingIndex);
						} else {
							// 플레이리스트에 없으면 추가하고 재생
							addTrackToPlaylist(productId);
							// 새로 추가된 트랙은 마지막 인덱스에 위치
							const newIndex = trackIds.length;
							playTrackAtIndex(newIndex);
						}

						toast({ description: "재생이 시작되었습니다." });
					} catch (error) {
						const message = error instanceof Error ? error.message : "재생에 실패했습니다.";
						toast({ description: message, variant: "destructive" });
					}
				}
			}

			// ARTIST 드래그 처리 (로그인 필요)
			if (event?.active?.data.current?.type === "ARTIST") {
				if (!user) {
					toast({ description: "로그인 후 이용해주세요." });
					return;
				}
				if (event.over?.id === "like-follow") {
					followArtist(event.active?.data.current?.artistId)
						.then(() => {
							toast({ description: "팔로우가 완료되었습니다." });
						})
						.catch((error: Error) => {
							const message = error instanceof AxiosError ? error.response?.data.detail : "팔로우에 실패했습니다.";
							toast({ description: message });
						});
				}
			}
		},
		[likeProduct, followArtist, user, toast, addTrackToPlaylist, playTrackAtIndex, trackIds],
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
