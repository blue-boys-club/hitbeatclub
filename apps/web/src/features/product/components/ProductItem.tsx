"use client";

import { useState, memo } from "react";
import { Acapella, Beat, Like, PauseCircle, PlayCircle, ShoppingBag, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard } from "@/components/ui";
import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/common/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PurchaseWithCartTrigger } from "./PurchaseWithCartTrigger";

interface ProductItemProps {
	productId?: string;
	title?: string;
	artist?: string;
	albumImgSrc?: string;
	tags?: string[];
	type?: "BEAT" | "ACAPELLA";
	isLiked?: boolean;
	onPlay?: () => void;
	onLike?: () => void;
}

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const ProductItem = memo(
	({
		productId = "123",
		title = "La Vie En Rose",
		artist = "Moon River",
		albumImgSrc = "https://placehold.co/70x70.png",
		tags = ["G-funk", "Trippy", "Flower"],
		type = "BEAT",
		isLiked = false,
		onPlay,
		onLike,
	}: ProductItemProps) => {
		const router = useRouter();
		const [status, setStatus] = useState<"playing" | "paused" | "default">("paused");

		const onClickProduct = () => {
			router.push(`/products/${productId}`);
		};

		const onClickLike = () => {
			onLike?.();
		};

		const togglePlay = () => {
			setStatus(status === "playing" ? "paused" : "playing");
			onPlay?.();
		};

		return (
			<div className="flex justify-between items-center hover:bg-[#D9D9D9] cursor-pointer">
				<div className="flex items-center gap-5">
					<div className="flex items-center">
						<div
							className={cn(
								"transition-all duration-300",
								status === "playing" ? "opacity-100 translate-x-0 mr-3" : "opacity-0 -translate-x-2 w-0",
							)}
						>
							<SmallEqualizer />
						</div>

						<div
							className="relative group cursor-pointer"
							onClick={togglePlay}
						>
							<AlbumCoverCard
								albumImgSrc={albumImgSrc}
								size="lg"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
								{status === "playing" ? <PauseCircle /> : <PlayCircle />}
							</div>
						</div>
					</div>

					<div
						className="flex flex-col"
						onClick={onClickProduct}
					>
						<p className="flex items-center gap-2.5 text-16px font-bold">
							{title}
							{type === "BEAT" ? <Beat /> : <Acapella />}
						</p>
						<p className="text-16px">{artist}</p>
					</div>
				</div>

				<div className="flex gap-2">
					{tags.map((tag, index) => (
						<TagButton
							key={tag}
							name={tag}
							isClickable={false}
						/>
					))}
				</div>

				<div className="flex justify-between items-center gap-[10px]">
					<div
						className="w-8 h-8 flex justify-center items-center cursor-pointer"
						onClick={onClickLike}
					>
						{isLiked ? (
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
					<PurchaseWithCartTrigger productId={Number(productId)}>
						{(isInCart) => <ShoppingBag color={isInCart ? "#3884FF" : "white"} />}
					</PurchaseWithCartTrigger>
				</div>
			</div>
		);
	},
);

ProductItem.displayName = "ProductItem";
