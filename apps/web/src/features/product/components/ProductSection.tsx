"use client";

import { SectionHeader } from "@/components/ui";
import { SectionHeaderProps } from "@/components/ui/SectionHeader/SectionHeader";
import { Carousel, CarouselContent, CarouselItem, type CarouselPlugin } from "@/components/ui/Carousel/Carousel";
import { memo, useEffect, useState } from "react";
import { ProductTrackCarouselItem } from "./ProductTrackCarouselItem";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import { useDndContext } from "@dnd-kit/core";

interface ShopSectionProps {
	sectionHeader: Omit<SectionHeaderProps, "size">;
	products: ProductRowByDashboardResponse[];
}

export const ProductSection = memo(({ sectionHeader, products }: ShopSectionProps) => {
	// Dynamic import for client-side only
	const [wheelPlugin, setWheelPlugin] = useState<CarouselPlugin | null>(null);

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
		<div className="flex flex-col items-center justify-start w-full gap-12px">
			<SectionHeader
				{...sectionHeader}
				size="large"
			/>
			<Carousel
				className="w-full"
				opts={{
					align: "start",
					dragFree: true,
					containScroll: "trimSnaps",
				}}
				plugins={wheelPlugin ? [wheelPlugin] : undefined}
			>
				<CarouselContent>
					{products.length === 0 ? (
						<div className="w-full h-110px flex justify-center items-center">
							<span className="text-hbc-gray-300">상품이 없습니다.</span>
						</div>
					) : (
						products.map((product) => (
							<CarouselItem
								key={product.id}
								className="p-1 pr-8px basis-auto"
							>
								<ProductTrackCarouselItem track={product} />
							</CarouselItem>
						))
					)}
				</CarouselContent>
			</Carousel>
		</div>
	);
});

ProductSection.displayName = "ProductSection";
