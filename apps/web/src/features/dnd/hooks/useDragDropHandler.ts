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
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

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
	const { addTrackToPlaylist, playTrackAtIndex, trackIds, createAutoPlaylist } = usePlaylist();
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
				const originalIndex: number | undefined = event.active?.data.current?.index;
				const playlistConfig: PlaylistAutoRequest | undefined = event.active?.data.current?.playlistConfig;

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
					// 컨텍스트 인식 재생 로직
					(async () => {
						try {
							if (playlistConfig) {
								// 컨텍스트(리스트) 기반 자동 플레이리스트 생성
								await createAutoPlaylist(playlistConfig);
								// 상태가 업데이트된 이후 인덱스로 이동 (마이크로 딜레이 활용)
								setTimeout(() => {
									playTrackAtIndex(originalIndex ?? 0);
								}, 0);
								toast({ description: "재생이 시작되었습니다." });
								return;
							}

							// 기존 로직 유지
							const existingIndex = trackIds.indexOf(productId);

							if (existingIndex !== -1) {
								playTrackAtIndex(existingIndex);
							} else {
								addTrackToPlaylist(productId);
								const newIndex = trackIds.length;
								playTrackAtIndex(newIndex);
							}

							toast({ description: "재생이 시작되었습니다." });
						} catch (error) {
							const message = error instanceof Error ? error.message : "재생에 실패했습니다.";
							toast({ description: message, variant: "destructive" });
						}
					})();
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
		[likeProduct, followArtist, user, toast, addTrackToPlaylist, playTrackAtIndex, trackIds, createAutoPlaylist],
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
