"use client";

import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";
import { ProductSection } from "@/features/product/components/ProductSection";
import { Footer } from "@/components/layout/Footer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductListQueryOption } from "@/apis/product/query/product.query-option";
import { useDevice } from "@/hooks/use-device";
import { Button } from "@/components/ui/Button";
import { ProductSectionMobile } from "@/features/product/components/ProductSectionMobile";

export default function ProductMainPage() {
	const { data: products = [] } = useQuery({
		...getProductListQueryOption(),
		placeholderData: keepPreviousData,
	});
	const { isPC } = useDevice();

	return isPC ? (
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
						href: "#",
					},
				}}
				products={products}
			/>

			<ProductSection
				sectionHeader={{
					title: "Beat",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={products}
			/>

			<ProductSection
				sectionHeader={{
					title: "Acappella",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={products}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recommended",
					subtitle: "당신을 위한 오늘의 추천곡",
				}}
				products={products}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recent",
					subtitle: "최근 재생한 항목",
				}}
				products={products}
			/>

			<Footer />
		</div>
	) : (
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
						className="rounded-none border-4 bg-black text-white px-2"
					>
						ALL
					</Button>
					<Button
						size={"sm"}
						variant={"outline"}
						rounded={"full"}
						className="border-4 px-2"
					>
						BEAT
					</Button>
					<Button
						size={"sm"}
						variant={"outline"}
						rounded={"full"}
						className="border-4 px-2"
					>
						ACAPELLA
					</Button>
				</div>
				<ProductSectionMobile
					title="Recommended"
					description="당신을 위한 오늘의 추천곡"
					href="#"
				/>
				<ProductSectionMobile
					title="Recent"
					description="최근 재생한 항목"
					href="#"
				/>
				<ProductSectionMobile
					title="Beat"
					href="#"
				/>
				<ProductSectionMobile
					title="Acappella"
					href="#"
				/>
			</div>
		</div>
	);
}
