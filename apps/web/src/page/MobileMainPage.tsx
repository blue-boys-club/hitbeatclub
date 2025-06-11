"use client";

import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductListQueryOption } from "@/apis/product/query/product.query-option";
import { Button } from "@/components/ui/Button";
import { MobileProductSection } from "@/features/mobile/product/components/MobileProductSection";
import { useState } from "react";
import { cn } from "@/common/utils";
import { Footer } from "@/components/layout/Footer";

export default function MobileMainPage() {
	const { data: products = [] } = useQuery({
		...getProductListQueryOption({
			page: 1,
			limit: 10,
		}),
		placeholderData: keepPreviousData,
	});

	const [currentTab, setCurrentTab] = useState<"ALL" | "BEAT" | "ACAPELLA">("ALL");

	const tabContent = {
		ALL: (
			<>
				<MobileProductSection
					type="carousel"
					title="ALL"
					description="당신을 위한 오늘의 추천곡"
					href="#"
				/>
				<MobileProductSection
					type="carousel"
					title="Beat"
					href="#"
				/>
				<MobileProductSection
					type="carousel"
					title="Acappella"
					href="#"
				/>
			</>
		),
		BEAT: (
			<MobileProductSection
				type="gallery"
				title="Beat"
				href="#"
			/>
		),
		ACAPELLA: (
			<MobileProductSection
				type="gallery"
				title="Acappella"
				href="#"
			/>
		),
	};

	return (
		<div className="flex flex-col">
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
			<Footer />
		</div>
	);
}
