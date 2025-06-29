"use client";

import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductListForDashboardQueryOption } from "@/apis/product/query/product.query-option";
import { Button } from "@/components/ui/Button";
import { MobileProductSection } from "@/features/mobile/product/components/MobileProductSection";
import { useState } from "react";
import { cn } from "@/common/utils";
import { Footer } from "@/components/layout/Footer";
import { useMobilePlayerVisibility } from "@/hooks/use-mobile-player-visibility";
import { createPlaylistConfig } from "@/components/layout/PlaylistProvider";

export default function MobileMainPage() {
	const { data } = useQuery({
		...getProductListForDashboardQueryOption(),
		placeholderData: keepPreviousData,
	});

	const [currentTab, setCurrentTab] = useState<"ALL" | "BEAT" | "ACAPELLA">("ALL");
	const { isMobilePlayerVisible } = useMobilePlayerVisibility();

	// 동적 높이 계산
	const contentHeight = isMobilePlayerVisible
		? "h-[calc(100vh-204px)]" // FooterNav + MobilePlayer
		: "h-[calc(100vh-132px)]"; // FooterNav만

	const tabContent = {
		ALL: (
			<>
				<MobileProductSection
					type="carousel"
					title="Recent"
					description="최근 업로드된 음악"
					href="/mobile/home/products/recent"
					autoPlaylistConfig={createPlaylistConfig.main("RECENT")}
					products={data?.recent || []}
				/>
				<MobileProductSection
					type="carousel"
					title="Recommended"
					description="당신을 위한 오늘의 추천곡"
					href="/mobile/home/products/recommended"
					autoPlaylistConfig={createPlaylistConfig.main("RECOMMEND")}
					products={data?.recommended || []}
				/>
				<MobileProductSection
					type="carousel"
					title="Beat"
					href="/mobile/home/products/beat"
					autoPlaylistConfig={createPlaylistConfig.main("BEAT")}
					products={data?.beat || []}
				/>
				<MobileProductSection
					type="carousel"
					title="Acappella"
					href="/mobile/home/products/acapella"
					autoPlaylistConfig={createPlaylistConfig.main("ACAPELLA")}
					products={data?.acappella || []}
				/>
			</>
		),
		BEAT: (
			<MobileProductSection
				type="gallery"
				title="Beat"
				href="#"
				autoPlaylistConfig={createPlaylistConfig.main("BEAT")}
				products={data?.beat || []}
			/>
		),
		ACAPELLA: (
			<MobileProductSection
				type="gallery"
				title="Acappella"
				href="#"
				autoPlaylistConfig={createPlaylistConfig.main("ACAPELLA")}
				products={data?.acappella || []}
			/>
		),
	};

	return (
		<div className={`flex flex-col justify-between ${contentHeight} overflow-y-auto`}>
			<div>
				<div className="w-full h-90px relative">
					<Image
						src={bannerBackground}
						alt="banner background"
						fill
						className="absolute inset-0 object-cover object-top"
					/>
					<div className="absolute top-5px right-6px font-suisse text-base font-regular">Music of the Year 2025</div>
				</div>
				<div className="p-4 space-y-4">
					<div className="flex gap-2px">
						<Button
							size={"sm"}
							variant={"outline"}
							className={cn("rounded-none border-4 px-2", currentTab === "ALL" && "bg-black text-white")}
							onClick={() => setCurrentTab("ALL")}
						>
							ALL
						</Button>
						<Button
							size={"sm"}
							variant={"outline"}
							rounded={"full"}
							className={cn("border-4 px-2", currentTab === "BEAT" && "bg-black text-white")}
							onClick={() => setCurrentTab("BEAT")}
						>
							BEAT
						</Button>
						<Button
							size={"sm"}
							variant={"outline"}
							rounded={"full"}
							className={cn("border-4 px-2", currentTab === "ACAPELLA" && "bg-black text-white")}
							onClick={() => setCurrentTab("ACAPELLA")}
						>
							ACAPELLA
						</Button>
					</div>
					{tabContent[currentTab]}
				</div>
			</div>
			<Footer />
		</div>
	);
}
