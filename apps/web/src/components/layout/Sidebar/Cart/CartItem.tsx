import { cn } from "@/common/utils";
import * as React from "react";
import { memo } from "react";
import Image from "next/image";
import { CartPause, CartPlay } from "@/assets/svgs";
interface CartItemProps {
	type: "single" | "artist";
	status?: "playing" | "paused" | "default";
	imageUrl?: string;
	alt?: string;
}

const CartItem = memo(function CartItem({ status = "default", type, imageUrl, alt }: CartItemProps) {
	return (
		<div
			className={cn("relative @200px/sidebar:h-66px @200px/sidebar:w-66px w-62px h-62px")}
			role="button"
			tabIndex={0}
			aria-label={`Media control - ${status}`}
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
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
							"@200px/sidebar:w-55px @200px/sidebar:h-55px w-50px h-50px",
							type === "single" && "rounded-6px",
							type === "artist" && "rounded-full",
						)}
					/>
				)}

				{status !== "default" && (
					<div
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10",
							"@200px/sidebar:w-55px @200px/sidebar:h-55px w-50px h-50px",
							type === "single" && "rounded-6px",
							type === "artist" && "rounded-full",
						)}
					>
						<div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
							{status === "playing" ? <CartPlay /> : <CartPause />}
						</div>
					</div>
				)}
			</div>
		</div>
	);
});

CartItem.displayName = "CartItem";

export default CartItem;
