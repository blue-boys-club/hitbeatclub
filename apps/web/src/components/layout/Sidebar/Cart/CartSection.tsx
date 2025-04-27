import { CartShop } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { memo } from "react";
import CartItems from "./CartItems";
import Link from "next/link";

const CartSection = memo(() => {
	return (
		<div className="flex flex-col overflow-y-hidden">
			<div className="flex items-stretch gap-0.5 py-1">
				<CartShop />
				<span className="font-suisse text-16px text-hbc-black font-bold leading-20px tracking-[0.16px]">Cart</span>
			</div>

			<div className={cn("relative h-6px @200px/sidebar:w-261px w-102px")}>
				<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2px bg-hbc-black transition-all duration-300 w-261px hidden @200px/sidebar:block" />
				<div className={cn("absolute h-full bg-hbc-black @200px/sidebar:w-142px w-full")} />
			</div>

			<CartItems />

			<div className="mr-4px">
				<div className="w-full h-2px bg-hbc-black" />
			</div>

			{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
			{/* @ts-ignore TODO: Implement cart click handler */}
			<Link
				href="/cart"
				className="self-end leading-none bg-white border-4 border-black border-solid cursor-pointer rounded-40px mt-4px mb-5px px-10px py-4px mr-4px"
			>
				Go Cart
			</Link>
		</div>
	);
});

CartSection.displayName = "CartSection";

export default CartSection;
