"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Like, ShoppingBag } from "@/assets/svgs";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControl } from "./VolumeControl";
import Image from "next/image";
import { assetImageLoader } from "@/common/utils/image-loader";
import { useLikeProductMutation, useUnlikeProductMutation } from "@/apis/product/mutations";
import { useShallow } from "zustand/react/shallow";
import { useAudioStore } from "@/stores/audio";
import { PurchaseWithCartTrigger } from "@/features/product/components/PurchaseWithCartTrigger";

export const FooterPlayer = () => {
	const { id, productName, seller, isLiked, audioFile, coverImage, updateIsLiked } = useAudioStore(
		useShallow((state) => ({
			id: state.id,
			productName: state.productName,
			seller: state.seller,
			isLiked: state.isLiked,
			audioFile: state.audioFile,
			coverImage: state.coverImage,
			updateIsLiked: state.updateIsLiked,
		})),
	);

	// Audio player state and controls
	const audioPlayerState = useAudioPlayer();

	const { mutate: likeMutation } = useLikeProductMutation();
	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	const onClickLike = () => {
		if (!id) return;

		if (!isLiked) {
			likeMutation(id, {
				onSuccess: () => {
					updateIsLiked(true);
				},
			});
		} else {
			unlikeProduct(id, {
				onSuccess: () => {
					updateIsLiked(false);
				},
			});
		}
	};

	// URL이 변경될 때마다 자동 재생
	useEffect(() => {
		if (audioFile?.url) {
			audioPlayerState.stop();

			const timer = setTimeout(() => {
				audioPlayerState.autoPlay();
			}, 200);

			return () => clearTimeout(timer);
		}
	}, [audioFile?.url]);

	return (
		<div className="relative w-full h-20 bg-white border-t-8 border-black">
			<div className="flex items-center justify-between w-full p-2">
				{/* 트랙 정보 및 좋아요/장바구니 */}
				<div className="flex items-center gap-2 w-96">
					<div className="flex items-center justify-between gap-4">
						{coverImage?.url ? (
							<Image
								width={60}
								height={60}
								alt="track-image"
								className="border-black w-14 h-14"
								src={coverImage.url}
								loader={assetImageLoader}
							/>
						) : (
							<div className="w-14 h-14 bg-gray-200 border border-black flex items-center justify-center">
								<span className="text-xs text-gray-500">No Image</span>
							</div>
						)}
						<div className="flex flex-col gap-1">
							<div className="text-xl font-bold leading-none text-black">{productName}</div>
							<div className="text-base font-bold leading-none w-36 text-black/70">{seller?.stageName}</div>
						</div>
					</div>

					<div className="flex justify-between items-center gap-[10px]">
						<div
							className="flex items-center justify-center w-8 h-8 cursor-pointer"
							onClick={onClickLike}
						>
							{isLiked ? (
								<Image
									width={20}
									height={20}
									className="w-5 h-5"
									src="/assets/ActiveLike.png"
									alt="like"
								/>
							) : (
								<Like />
							)}
						</div>

						<PurchaseWithCartTrigger productId={id ?? 0}>
							{({ isOnCart }) => <ShoppingBag color={isOnCart ? "#3884FF" : "white"} />}
						</PurchaseWithCartTrigger>
					</div>
				</div>

				{/* 재생 컨트롤 */}
				<div className="flex justify-center flex-1 ">
					<AudioPlayer
						{...audioPlayerState}
						url={audioFile?.url ?? ""}
					/>
				</div>

				{/* 볼륨 컨트롤 */}
				<div className="flex justify-end w-96">
					<VolumeControl {...audioPlayerState} />
				</div>
			</div>
		</div>
	);
};
