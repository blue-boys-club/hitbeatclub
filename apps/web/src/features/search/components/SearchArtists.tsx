"use client";

import { ArtistAvatar } from "@/components/ui";
import { Carousel, CarouselContent, CarouselItem, type CarouselPlugin } from "@/components/ui/Carousel/Carousel";
import { useEffect, useState } from "react";
import { useSearchInfiniteQuery } from "../hooks/useSearchInfiniteQuery";

export const SearchArtists = () => {
	const { data, isLoading } = useSearchInfiniteQuery();

	// 첫 번째 페이지의 artists만 사용
	const artists = data?.pages?.[0]?.artists || [];

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

	if (isLoading) {
		return (
			<div className="overflow-hidden border-b-2 border-hbc-black">
				<div className="flex gap-6 pl-4">
					{Array.from({ length: 5 }).map((_, index) => (
						<div
							key={index}
							className="flex-shrink-0 min-w-[180px]"
						>
							<div className="flex flex-col items-center gap-5px">
								<div className="w-[174px] h-[174px] rounded-full bg-gray-200 animate-pulse"></div>
								<div className="w-20 h-4 mt-4 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!artists?.length) return null;

	return (
		<Carousel
			className="border-b-2 border-hbc-black"
			opts={{
				align: "start",
				dragFree: true,
				containScroll: "trimSnaps",
			}}
			plugins={wheelPlugin ? [wheelPlugin] : undefined}
		>
			<CarouselContent>
				{artists?.map((artist) => (
					<CarouselItem
						key={artist.id}
						className="basis-auto pl-0 pr-6 min-w-[180px] group"
					>
						<div className="flex flex-col items-center gap-5px pb-3px">
							<div className="p-1 transition-all duration-300 rounded-full">
								<ArtistAvatar
									src={artist.profileImageUrl || ""}
									alt={`${artist.stageName} avatar`}
									className="transition-opacity cursor-pointer hover:opacity-90"
								/>
							</div>
							<div className="font-bold text-center text-20px leading-28px tracking-02px font-suit group-hover:underline group-hover:decoration-solid group-hover:decoration-2 group-hover:decoration-offset-4">
								{artist.stageName}
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
