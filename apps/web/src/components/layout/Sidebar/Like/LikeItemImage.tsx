"use client";
import * as React from "react";
import { memo } from "react";
import Image from "next/image";
import { CartPause, CartPlay } from "@/assets/svgs";

interface LikeItemImageProps {
	status?: "playing" | "paused" | "default";
	imageUrl?: string;
	alt?: string;
}

const LikeItemImage = memo(function LikeItemImage({ status = "default", alt, imageUrl }: LikeItemImageProps) {
	return (
		<div
			className="relative w-[40px] h-[40px]"
			role="button"
			tabIndex={0}
			aria-label={alt || `Media control - ${status}`}
		>
			{imageUrl && (
				<Image
					src={imageUrl}
					alt="Media thumbnail"
					width={240}
					height={240}
					className="object-cover w-full h-full rounded-lg"
				/>
			)}

			{status !== "default" && (
				<div className="absolute inset-0 rounded-lg bg-black/10">
					<div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
						{status === "playing" ? <CartPlay /> : <CartPause />}
					</div>
				</div>
			)}
		</div>
	);
});

LikeItemImage.displayName = "LikeItemImage";

export default LikeItemImage;
