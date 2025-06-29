import { cn } from "@/common/utils";
import * as React from "react";
import { memo } from "react";
import Image from "next/image";
import { CartPause, CartPlay } from "@/assets/svgs";
import { assetImageLoader } from "@/common/utils/image-loader";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";

interface CartItemProps {
	/** 상품 ID (트랙 ID) */
	productId: number;
	/** 아이템 타입 - 싱글(트랙) 또는 아티스트 */
	type: "single" | "artist";
	/** 썸네일 이미지 URL */
	imageUrl?: string;
	/** 이미지 대체 텍스트 */
	alt?: string;
}

const CartItem = memo(function CartItem({ productId, type, imageUrl, alt }: CartItemProps) {
	// 오디오 재생 상태 조회
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	// 플레이어 제어 훅
	const { play } = usePlayTrack();

	// 현재 아이템의 실제 재생 상태 계산
	const effectiveStatus: "playing" | "paused" | "default" = (() => {
		if (currentProductId !== productId) return "default";

		if (status === "playing" || status === "paused") return status;

		// idle, ended 등의 상태는 "default" 로 간주
		return "default";
	})();

	const togglePlay = () => {
		play(productId);
	};

	return (
		<div
			className={cn("relative @200px/sidebar:h-66px @200px/sidebar:w-66px w-62px h-62px")}
			role="button"
			tabIndex={0}
			aria-label={`Media control - ${effectiveStatus}`}
			onClick={togglePlay}
		>
			<div className={cn("relative @200px/sidebar:h-66px @200px/sidebar:w-66px w-62px h-62px")}>
				<div
					className={cn(
						"absolute top-0 left-0 border-2 border-hbc-black border-solid",
						"@200px/sidebar:h-66px @200px/sidebar:w-66px w-62px h-62px",
						type === "single" && "rounded-12px",
						type === "artist" && "rounded-full",
					)}
					aria-hidden="true"
				/>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt={alt || "Media thumbnail"}
						width={240}
						height={240}
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover",
							"@200px/sidebar:w-55px @200px/sidebar:h-55px w-50px h-50px",
							type === "single" && "rounded-6px",
							type === "artist" && "rounded-full",
						)}
						loader={assetImageLoader}
					/>
				)}

				{effectiveStatus !== "default" && (
					<div
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10",
							"@200px/sidebar:w-55px @200px/sidebar:h-55px w-50px h-50px",
							type === "single" && "rounded-6px",
							type === "artist" && "rounded-full",
						)}
					>
						<div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
							{effectiveStatus === "playing" ? <CartPause /> : <CartPlay />}
						</div>
					</div>
				)}
			</div>
		</div>
	);
});

CartItem.displayName = "CartItem";

export default CartItem;
