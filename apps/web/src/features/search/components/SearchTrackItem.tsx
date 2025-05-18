"use client";

import { useState, memo } from "react";
import { Beat, Like, PauseCircle, PlayCircle, ShoppingBag, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard } from "@/components/ui";
import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/common/utils";
import Image from "next/image";

interface TrackItemProps {
	title?: string;
	artist?: string;
	albumImgSrc?: string;
	tags?: string[];
	onPlay?: () => void;
	onLike?: () => void;
	onAddToCart?: () => void;
}

/**
 * 좋아요한 트랙 아이템 컴포넌트
 * - 트랙 재생/일시정지 기능
 * - 좋아요 토글 기능
 * - 장바구니 담기 기능
 * - 트랙 관련 태그 표시
 */
export const SearchTrackItem = memo(
	({
		title = "La Vie En Rose",
		artist = "Moon River",
		albumImgSrc = "https://placehold.co/70x70.png",
		tags = ["G-funk", "Trippy", "Flower"],
		onPlay,
		onLike,
		onAddToCart,
	}: TrackItemProps) => {
		const [status, setStatus] = useState<"playing" | "paused" | "default">("paused");
		const [isLiked, setIsLiked] = useState(false);
		const [cart, setCart] = useState(false);

		const onClickLike = () => {
			setIsLiked(!isLiked);
			onLike?.();
		};

		const onClickCart = () => {
			setCart(!cart);
			onAddToCart?.();
		};

		const togglePlay = () => {
			setStatus(status === "playing" ? "paused" : "playing");
			onPlay?.();
		};

		return (
			<div className="flex justify-between items-center hover:bg-[#D9D9D9] rounded-lg cursor-pointer">
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
							className="relative cursor-pointer group"
							onClick={togglePlay}
						>
							<AlbumCoverCard
								albumImgSrc={albumImgSrc}
								size="lg"
								border={false}
								padding={false}
							/>
							<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/20 group-hover:opacity-100">
								{status === "playing" ? <PauseCircle /> : <PlayCircle />}
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<p className="flex items-center gap-2.5 text-16px font-bold">
							{title}
							<Beat />
						</p>
						<p className="text-16px">{artist}</p>
					</div>
				</div>

				<div className="flex gap-2">
					{tags.map((tag) => (
						<TagButton
							key={tag}
							name={tag}
							isClickable={false}
						/>
					))}
				</div>

				<div className="flex justify-between items-center gap-[10px] @right-side-bar:hidden">
					<div
						className="flex items-center justify-center w-8 h-8 cursor-pointer"
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
					<div
						onClick={onClickCart}
						className="cursor-pointer"
					>
						<ShoppingBag color={cart ? "#3884FF" : "white"} />
					</div>
				</div>
			</div>
		);
	},
);

SearchTrackItem.displayName = "SearchTrackItem";
