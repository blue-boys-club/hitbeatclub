"use client";

import {
	getArtistDetailBySlugQueryOption,
	getArtistProductListBySlugQueryOption,
} from "@/apis/artist/query/artist.query-options";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useDeleteFollowedArtistMutation } from "@/apis/user/mutations/useDeleteFollowedArtistMutation";
import { CrossArrow } from "@/assets/svgs/CrossArrow";
import { PlayCircleBlack } from "@/assets/svgs/PlayCircleBlack";
import { MobileProductItem } from "@/features/mobile/product/components";
import { MobileBuyOrCartModal } from "@/features/mobile/search/modals";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import Image from "next/image";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useRouter } from "next/navigation";

export const MobileMyFollowArtistPage = ({ slug }: { slug: string }) => {
	const router = useRouter();
	const { data: artist } = useQuery(getArtistDetailBySlugQueryOption(slug));
	const { data: products } = useQuery(
		getArtistProductListBySlugQueryOption(slug, { page: 1, limit: 10, isPublic: true }),
	);
	const { data: user } = useQuery(getUserMeQueryOption());

	const deleteFollowedArtistMutation = useDeleteFollowedArtistMutation(user?.id ?? 0);

	// Playlist control
	const { setCurrentTrackIds } = usePlaylist();
	const { play } = usePlayTrack();

	// 모달 상태 관리
	const [isOpenBuyOrCartModal, setIsOpenBuyOrCartModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<any>(null);

	const extractTrackIds = useCallback((products: any[]) => products.map((p) => p.id), []);

	// 순서대로 재생 핸들러 (PlayCircleBlack)
	const handlePlayAll = useCallback(() => {
		if (!products?.data?.length) return;

		const trackIds = extractTrackIds(products.data);
		setCurrentTrackIds(trackIds, 0);
		play(trackIds[0]);
	}, [products?.data, extractTrackIds, setCurrentTrackIds, play]);

	// 셔플 재생 핸들러 (CrossArrow)
	const handleShufflePlay = useCallback(() => {
		if (!products?.data?.length) return;

		const trackIds = extractTrackIds(products.data);
		const shuffledIds = [...trackIds].sort(() => Math.random() - 0.5);
		setCurrentTrackIds(shuffledIds, 0);
		play(shuffledIds[0]);
	}, [products?.data, extractTrackIds, setCurrentTrackIds, play]);

	// 팔로우 취소 핸들러
	const handleUnfollow = useCallback(() => {
		if (!artist?.id || !user?.id) return;

		deleteFollowedArtistMutation.mutate(artist.id, {
			onSuccess: () => {
				// 팔로우 취소 성공 시 이전 페이지로 이동
				router.back();
			},
		});
	}, [artist?.id, user?.id, deleteFollowedArtistMutation, router]);

	// Buy/Cart 모달 열기 핸들러
	const handleBuyClick = (product: any) => {
		setSelectedProduct(product);
		setIsOpenBuyOrCartModal(true);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-3 items-center">
				<div className="overflow-hidden relative w-100px h-100px rounded-full border-6px border-black">
					{artist?.profileImageUrl && (
						<Image
							alt=""
							src={artist.profileImageUrl}
							fill
							className="object-cover"
						/>
					)}
				</div>
				<div className="flex-1 flex justify-between items-center">
					<div className="flex flex-col items-start gap-7px">
						<span className="text-22px leading-100% font-bold">{artist?.stageName}</span>
						<div className="flex gap-7px text-12px text-hbc-gray-400 leading-150% font-[450]">
							<span>{artist?.followerCount} Followers</span>
							<span>{artist?.trackCount} Tracks</span>
						</div>
						<button
							onClick={handleUnfollow}
							disabled={deleteFollowedArtistMutation.isPending}
							className="rounded-30px h-21px px-10px bg-black text-12px leading-160% text-white font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{deleteFollowedArtistMutation.isPending ? "언팔로우 중..." : "Following"}
						</button>
					</div>
					<div className="flex gap-2 items-center">
						<button
							onClick={handlePlayAll}
							className="cursor-pointer"
						>
							<PlayCircleBlack />
						</button>
						<button
							onClick={handleShufflePlay}
							className="cursor-pointer"
						>
							<CrossArrow />
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{products?.data?.map((product) => (
					<MobileProductItem
						key={product.id}
						type="follow"
						product={product}
						onBuyClick={handleBuyClick}
					/>
				))}
			</div>
			{selectedProduct && (
				<MobileBuyOrCartModal
					isOpen={isOpenBuyOrCartModal}
					onClose={() => {
						setIsOpenBuyOrCartModal(false);
						setSelectedProduct(null);
					}}
					product={selectedProduct}
				/>
			)}
		</div>
	);
};
