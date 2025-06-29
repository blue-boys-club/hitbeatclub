import React, { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/common/utils";
import blankCdImage from "@/assets/images/blank-cd.png";
import Link from "next/link";
import { CartPause, CartPlay } from "@/assets/svgs";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";

type MinimalSeller = {
	id: number;
	stageName: string;
	slug?: string | null;
};

type MinimalImage = {
	id?: number;
	url?: string;
	originName?: string;
} | null;

interface PlaylistItemProps {
	id: number;
	productId: number;
	productName: string;
	seller: MinimalSeller;
	coverImage: MinimalImage;
	audioFile?: { id?: number; url?: string; originName?: string } | null;
	onClick: (id: number) => void;
}

const PlaylistItem = ({ id, coverImage, seller, productName, onClick }: PlaylistItemProps) => {
	const albumImage = useMemo(() => {
		return coverImage?.url || blankCdImage;
	}, [coverImage]);

	// 오디오 재생 상태 조회 (playlist row 별 상태 계산)
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	// 현재 아이템의 실제 재생 상태 계산
	const effectiveStatus: "playing" | "paused" | "default" = (() => {
		if (currentProductId !== id) return "default";

		if (status === "playing" || status === "paused") return status;

		// idle, ended 등의 상태는 "default" 로 간주
		return "default";
	})();

	return (
		<div
			onClick={() => onClick(id)}
			data-id={id}
			data-product-id={id}
			className={cn("flex gap-4 pr-[1px] rounded-[5px] cursor-pointer overflow-hidden bg-white hover:bg-[#DFDFDF]")}
		>
			{/* 앨범 이미지 + 상태 오버레이 */}
			<div className="relative w-[48px] h-[48px] flex-shrink-0">
				<Image
					src={albumImage}
					alt="커버 이미지"
					width={48}
					height={48}
					className="rounded-[4px] aspect-square object-cover w-[48px] h-[48px]"
				/>

				{effectiveStatus !== "default" && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-[4px]">
						{effectiveStatus === "playing" ? <CartPause /> : <CartPlay />}
					</div>
				)}
			</div>
			<div className="flex flex-col min-w-0 flex-1 overflow-hidden">
				<Link
					href={`/product/${id}`}
					className="text-black font-suisse text-base font-bold leading-normal truncate hover:underline"
					prefetch={false}
				>
					{productName}
				</Link>
				<Link
					href={`/artist/${seller.slug}`}
					className="text-black font-suisse text-base font-normal leading-normal truncate hover:underline"
					prefetch={false}
				>
					{seller.stageName}
				</Link>
			</div>
		</div>
	);
};

export default PlaylistItem;
