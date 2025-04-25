"use client";

import { SectionHeader } from "@/components/ui";
import { SectionHeaderProps } from "@/components/ui/SectionHeader/SectionHeader";
import { Track } from "../types/track";
import { ShopTrackItem } from "./ShopTrackItem";
import { Carousel, CarouselContent, CarouselItem, type CarouselPlugin } from "@/components/ui/Carousel/Carousel";
import { memo, useEffect, useState } from "react";

interface ShopSectionProps {
	sectionHeader: Omit<SectionHeaderProps, "size">;
	products: Track[];
}

export const ShopSection = memo(({ sectionHeader, products }: ShopSectionProps) => {
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
					{products.map((product) => (
						<CarouselItem
							key={product.id}
							className="p-1 pr-8px basis-auto"
						>
							<ShopTrackItem track={product} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
});

ShopSection.displayName = "ShopSection";
