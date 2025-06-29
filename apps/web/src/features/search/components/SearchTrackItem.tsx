"use client";

import { memo, useCallback, useMemo } from "react";
import { Beat, Like, PauseCircle, PlayCircle, ShoppingBag, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard } from "@/components/ui";
import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/common/utils";
import Image from "next/image";
import { ProductResponse } from "@hitbeatclub/shared-types/product";
import blankCdImage from "@/assets/images/blank-cd.png";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import { useToast } from "@/hooks/use-toast";
import { useAudioStore } from "@/stores/audio";
import { useQuery } from "@tanstack/react-query";
import { useCartListQueryOptions } from "@/apis/user/query/user.query-option";
import { PurchaseWithCartTrigger } from "@/features/product/components/PurchaseWithCartTrigger";
import { DraggableProductWrapper } from "@/features/dnd/components/DraggableProductWrapper";
import Link from "next/link";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useShallow } from "zustand/react/shallow";

interface TrackItemProps {
	product: ProductResponse;
	onPlay?: () => void;
	onLike?: () => void;
	onAddToCart?: (id: number) => void;
}

/**
 * 검색 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능 (인증 및 API 연동)
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const SearchTrackItem = memo(({ product, onPlay, onLike, onAddToCart }: TrackItemProps) => {
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	const { play } = usePlayTrack();

	const { data: user } = useQuery(getUserMeQueryOption());
	const { data: cart } = useQuery(useCartListQueryOptions(user?.id ?? 0));
	const { toast } = useToast();
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	const onClickLike = useCallback(() => {
		if (!user) {
			toast({
				description: "로그인 후 이용해주세요.",
			});
			return;
		}

		// 현재 좋아요 상태에 따라 적절한 mutation 실행
		if (product.isLiked) {
			unlikeProductMutation.mutate(product.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요 취소에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		} else {
			likeProductMutation.mutate(product.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		}
	}, [product.isLiked, likeProductMutation, unlikeProductMutation, toast, onLike, user]);

	const hasCart = useMemo(() => {
		return cart?.length && cart.length > 0 && cart.some((item) => item.product.id === product.id);
	}, [cart]);

	const togglePlay = useCallback(() => {
		play(product.id);
		onPlay?.();
	}, [play, product.id, onPlay]);

	const effectiveStatus = currentProductId === product.id ? status : "paused";

	return (
		<DraggableProductWrapper
			productId={product.id}
			meta={product}
		>
			<div className="flex justify-between items-center hover:bg-[#D9D9D9] rounded-lg cursor-pointer">
				<div className="flex items-center gap-5">
					<div className="flex items-center">
						<div
							className={cn(
								"transition-all duration-300",
								effectiveStatus === "playing" ? "opacity-100 translate-x-0 mr-3" : "opacity-0 -translate-x-2 w-0",
							)}
						>
							<SmallEqualizer />
						</div>

						<div
							className="relative cursor-pointer group"
							onClick={togglePlay}
						>
							<AlbumCoverCard
								albumImgSrc={product.coverImage?.url || blankCdImage}
								size="lg"
								border={false}
								padding={false}
								productId={product.id}
							/>
							<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/20 group-hover:opacity-100">
								{effectiveStatus === "playing" ? <PauseCircle /> : <PlayCircle />}
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<Link
							href={`/products/${product.id}`}
							className="flex items-center gap-2.5 text-16px font-bold hover:underline"
						>
							{product.productName}
							<Beat />
						</Link>
						<Link
							href={`/artists/${product.seller?.slug || product.seller?.id}`}
							className="text-16px hover:underline"
						>
							{product.seller?.stageName}
						</Link>
					</div>
				</div>

				<div className="flex gap-2">
					{product.tags.map((tag) => (
						<TagButton
							key={tag.id}
							name={tag.name}
							isClickable={false}
						/>
					))}
				</div>

				<div className="flex justify-between items-center gap-[10px] @right-side-bar:hidden">
					<div
						className="flex items-center justify-center w-8 h-8 cursor-pointer"
						onClick={onClickLike}
					>
						{product.isLiked ? (
							<Image
								className="w-5 h-5"
								src="/assets/ActiveLike.png"
								alt="active like"
								width={20}
								height={20}
							/>
						) : (
							<Like />
						)}
					</div>
					{/* <div
					onClick={onClickCart}
					className="cursor-pointer"
				>
					<ShoppingBag color={hasCart ? "#3884FF" : "white"} />
				</div> */}
					<PurchaseWithCartTrigger productId={product.id}>
						{({ isOnCart }) => <ShoppingBag color={isOnCart ? "#3884FF" : "white"} />}
					</PurchaseWithCartTrigger>
				</div>
			</div>
		</DraggableProductWrapper>
	);
});

SearchTrackItem.displayName = "SearchTrackItem";
