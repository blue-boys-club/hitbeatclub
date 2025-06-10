"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselPlugin } from "@/components/ui/Carousel/Carousel";
import { memo, useEffect, useState } from "react";
import { ProductListItem } from "../../../product/product.types";
import { ChevronRightSharp } from "@/assets/svgs/ChevronRightSharp";
import { useRouter } from "next/navigation";
import { MobileProductTrackGalleryItem } from "./MobileProductTrackGalleryItem";
import { MobileProductTrackCarouselItem } from "./MobileProductTrackCarouselItem";

interface MobileProductSectionProps {
	type: "carousel" | "gallery";
	title: string;
	href: string;
	description?: string;
	// products: ProductListItem[];
}

// 더미데이터 20개 생성
const dummyProducts: ProductListItem[] = Array.from({ length: 20 }, (_, index) => {
	// 인덱스에 따른 장르, 태그 등 결정
	let genre = "";
	switch (index % 5) {
		case 0:
			genre = "Hip-hop";
			break;
		case 1:
			genre = "R&B";
			break;
		case 2:
			genre = "Trap";
			break;
		case 3:
			genre = "Lo-fi";
			break;
		case 4:
			genre = "Drill";
			break;
	}

	let mood = "";
	switch (index % 4) {
		case 0:
			mood = "신나는";
			break;
		case 1:
			mood = "감성적인";
			break;
		case 2:
			mood = "어두운";
			break;
		case 3:
			mood = "밝은";
			break;
	}

	let style = "";
	switch (index % 3) {
		case 0:
			style = "댄스";
			break;
		case 1:
			style = "랩";
			break;
		case 2:
			style = "보컬";
			break;
	}

	let key = "";
	switch (index % 7) {
		case 0:
			key = "C";
			break;
		case 1:
			key = "D";
			break;
		case 2:
			key = "E";
			break;
		case 3:
			key = "F";
			break;
		case 4:
			key = "G";
			break;
		case 5:
			key = "A";
			break;
		case 6:
			key = "B";
			break;
	}

	let category: "BEAT" | "ACAPELA" | "null";
	switch (index % 3) {
		case 0:
			category = "BEAT";
			break;
		case 1:
			category = "ACAPELA";
			break;
		default:
			category = "null";
	}

	// 일부 샘플은 audioFile이나 coverImage가 null이 되도록 설정
	const hasAudioFile = index % 10 !== 9;
	const hasCoverImage = index % 10 !== 8;

	return {
		id: index + 1,
		description: `이 비트는 힙합 스타일의 트랙으로 강한 베이스와 멜로디가 특징입니다. 샘플 ${index + 1}`,
		createdAt: new Date(2025, 5, index + 1).toISOString(),
		productName: `비트 샘플 ${index + 1}`,
		price: 10000 + index * 1000,
		category,
		minBpm: 80 + (index % 40),
		maxBpm: 120 + (index % 40),
		musicKey: key,
		scaleType: index % 2 === 0 ? "MAJOR" : "MINOR",
		genres: [{ name: genre, id: (index % 5) + 1 }],
		tags: [
			{ name: mood, id: (index % 4) + 1 },
			{ name: style, id: (index % 3) + 5 },
		],
		seller: {
			id: (index % 5) + 1,
			stageName: `프로듀서${(index % 5) + 1}`,
			profileImageUrl: `https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg`,
		},
		audioFile: hasAudioFile
			? {
					id: index + 1,
					url: `https://example.com/audio${index + 1}.mp3`,
				}
			: null,
		coverImage: hasCoverImage
			? {
					id: index + 1,
					url: `https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg`,
				}
			: null,
	};
});

export const MobileProductSection = memo(
	({ type, title, href, description /* , products */ }: MobileProductSectionProps) => {
		// 실제 데이터 대신 더미데이터 사용
		const products = dummyProducts;
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
								{products.map((product) => (
									<CarouselItem
										key={product.id}
										className="p-0 basis-110px"
									>
										<MobileProductTrackCarouselItem track={product} />
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>
					) : (
						<div className="grid grid-cols-3 gap-x-6px gap-y-4 w-full">
							{products.map((product) => (
								<MobileProductTrackGalleryItem
									key={product.id}
									track={product}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		);
	},
);

MobileProductSection.displayName = "MobileProductSection";
