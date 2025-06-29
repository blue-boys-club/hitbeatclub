"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselPlugin } from "@/components/ui/Carousel/Carousel";
import { memo, useEffect, useState } from "react";
import { ChevronRightSharp } from "@/assets/svgs/ChevronRightSharp";
import { useRouter } from "next/navigation";
import { MobileProductTrackGalleryItem } from "./MobileProductTrackGalleryItem";
import { MobileProductTrackCarouselItem } from "./MobileProductTrackCarouselItem";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";

interface MobileProductSectionProps {
	type: "carousel" | "gallery";
	title: string;
	href: string;
	description?: string;
	products: ProductRowByDashboardResponse[];
}

export const MobileProductSection = memo(
	({ type, title, href, description, products = [] }: MobileProductSectionProps) => {
		// Dynamic import for client-side only
		const [wheelPlugin, setWheelPlugin] = useState<CarouselPlugin | null>(null);

		const router = useRouter();

		// Load the wheel plugin only on client side
		useEffect(() => {
			const loadPlugin = async () => {
				try {
					const wheelModule = await import("embla-carousel-wheel-gestures");
					setWheelPlugin(wheelModule.WheelGesturesPlugin());
				} catch (error) {
					console.error("Failed to load wheel gestures plugin:", error);
				}
			};

			loadPlugin();
		}, []);

		return (
			<div className="flex flex-col">
				<div className="w-full border-6px border-t-black" />
				<div className="flex flex-col gap-4px mt-1">
					<div className="flex justify-between items-center">
						<span className="text-22px leading-24px font-bold">{title}</span>
						<button
							className="w-18px h-20px flex justify-center items-center"
							onClick={() => {
								if (!href) return;
								router.push(href);
							}}
						>
							<ChevronRightSharp
								width="8px"
								height="12px"
							/>
						</button>
					</div>
					{description && <span className="text-xs text-hbc-gray-300">{description}</span>}
				</div>
				<div className="mt-3">
					{type === "carousel" ? (
						<Carousel
							className="w-full"
							opts={{
								align: "start",
								dragFree: true,
								containScroll: "trimSnaps",
							}}
							plugins={wheelPlugin ? [wheelPlugin] : undefined}
						>
							<CarouselContent className="space-x-6px">
								{products.length === 0 ? (
									<div className="w-full h-110px flex justify-center items-center">
										<span className="text-12px text-hbc-gray-300">상품이 없습니다.</span>
									</div>
								) : (
									products.map((product) => (
										<CarouselItem
											key={product.id}
											className="p-0 basis-110px"
										>
											<MobileProductTrackCarouselItem track={product} />
										</CarouselItem>
									))
								)}
							</CarouselContent>
						</Carousel>
					) : (
						<div className="grid grid-cols-3 gap-x-6px gap-y-4 w-full">
							{products.length === 0 ? (
								<div className="w-full h-110px flex justify-center items-center">
									<span className="text-12px text-hbc-gray-300">상품이 없습니다.</span>
								</div>
							) : (
								products.map((product) => (
									<MobileProductTrackGalleryItem
										key={product.id}
										track={product}
									/>
								))
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

MobileProductSection.displayName = "MobileProductSection";
