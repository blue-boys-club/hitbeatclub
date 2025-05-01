import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";
import { ProductSection } from "@/features/product/components/ProductSection";
import { Footer } from "@/components/layout/Footer";

const mockProducts = [
	{
		id: 1,
		title: "Product 1",
		artist: "Artist 1",
		isHit: true,
		albumCoverUrl: "https://placehold.co/180x180.png",
	},
	...Array.from({ length: 4 }, (_, index) => ({
		id: index + 2,
		title: `Product ${index + 2}`,
		artist: `Artist ${index + 2}`,
		isHit: false,
		albumCoverUrl: "https://placehold.co/180x180.png",
	})),
];

export default function ProductMainPage() {
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
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ProductSection
				sectionHeader={{
					title: "Beat",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ProductSection
				sectionHeader={{
					title: "Acappella",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recommended",
					subtitle: "당신을 위한 오늘의 추천곡",
				}}
				products={mockProducts}
			/>

			<ProductSection
				sectionHeader={{
					title: "Recent",
					subtitle: "최근 재생한 항목",
				}}
				products={mockProducts}
			/>

			<Footer />
		</div>
	);
}
