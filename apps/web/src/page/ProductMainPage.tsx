"use client";

import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";
import { ProductSection } from "@/features/product/components/ProductSection";
import { Footer } from "@/components/layout/Footer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductListForDashboardQueryOption } from "@/apis/product/query/product.query-option";

export default function ProductMainPage() {
	const { data } = useQuery({
		...getProductListForDashboardQueryOption(),
		placeholderData: keepPreviousData,
	});

	return (
		<div className="flex flex-col gap-15px">
			<div className="flex items-center justify-center w-full h-150px">
				<div className="w-full h-150px relative">
					<Image
						src={bannerBackground}
						alt="banner background"
						fill
						className="absolute inset-0 object-cover object-top"
					/>
					<div className="absolute top-9px right-20px font-suisse text-32px font-regular">Music of the Year 2025</div>
				</div>
			</div>
			<ProductSection
				sectionHeader={{
					title: "ALL",
					goTo: {
						label: "Show All",
						href: "/search",
					},
				}}
				category="ALL"
				products={data?.all || []}
			/>

			<ProductSection
				sectionHeader={{
					title: "Beat",
					goTo: {
						label: "Show All",
						href: "/search?category=BEAT",
					},
				}}
				category="BEAT"
				products={data?.beat || []}
			/>

			<ProductSection
				sectionHeader={{
					title: "Acappella",
					goTo: {
						label: "Show All",
						href: "/search?category=ACAPELA",
					},
				}}
				category="ACAPELLA"
				products={data?.acappella || []}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recommended",
					subtitle: "당신을 위한 오늘의 추천곡",
				}}
				category="RECOMMEND"
				products={data?.recommended || []}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recent",
					subtitle: "최근 재생한 항목",
				}}
				category="RECENT"
				products={data?.recent || []}
			/>

			<Footer />
		</div>
	);
}
