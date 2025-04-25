import { ShopBanner } from "./components/ShopBanner";
import { ShopSection } from "./components/ShopSection";
import Footer from "./components/Footer";

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

export default function ShopMainPage() {
	return (
		<div className="flex flex-col gap-15px">
			<ShopBanner />

			<ShopSection
				sectionHeader={{
					title: "ALL",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ShopSection
				sectionHeader={{
					title: "Beat",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ShopSection
				sectionHeader={{
					title: "Acappella",
					goTo: {
						label: "Show All",
						href: "#",
					},
				}}
				products={mockProducts}
			/>

			<ShopSection
				sectionHeader={{
					title: "Recommended",
					subtitle: "당신을 위한 오늘의 추천곡",
				}}
				products={mockProducts}
			/>

			<ShopSection
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
