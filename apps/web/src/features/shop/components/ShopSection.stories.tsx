import type { Meta, StoryObj } from "@storybook/react";
import { ShopSection } from "./ShopSection";
import { Track } from "../types/track";

const meta: Meta<typeof ShopSection> = {
	title: "Features/Shop/ShopSection",
	component: ShopSection,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ShopSection>;

// Mock data for stories
const mockProducts: Track[] = [
	{
		id: 1,
		title: "Album One",
		artist: "Artist Name",
		albumCoverUrl: "https://placehold.co/180x180",
		isHit: true,
	},
	{
		id: 2,
		title: "앨범 투",
		artist: "아티스트 이름",
		albumCoverUrl: "https://placehold.co/180x180",
	},
	{
		id: 3,
		title: "Album Three",
		artist: "Artist Name",
		albumCoverUrl: "https://placehold.co/180x180",
	},
	{
		id: 4,
		title: "Album Four",
		artist: "Another Artist",
		albumCoverUrl: "https://placehold.co/180x180",
		isHit: true,
	},
	{
		id: 5, // This won't show up as we only display 4 items
		title: "Album Five",
		artist: "Extra Artist",
		albumCoverUrl: "https://placehold.co/180x180",
	},
];

export const Default: Story = {
	args: {
		sectionHeader: {
			title: "Featured Albums",
		},
		products: mockProducts,
	},
};

export const WithSubtitle: Story = {
	args: {
		sectionHeader: {
			title: "New Releases",
			subtitle: "Fresh this week",
		},
		products: mockProducts,
	},
};

export const WithLink: Story = {
	args: {
		sectionHeader: {
			title: "베스트셀러",

			goTo: {
				label: "더보기",
				href: "/shop/bestsellers",
			},
		},
		products: mockProducts.slice(0, 3),
	},
};

export const SmallHeader: Story = {
	args: {
		sectionHeader: {
			title: "Recommendations",

			goTo: {
				label: "See all",
				href: "/shop/recommendations",
			},
		},
		products: mockProducts.filter((product) => product.isHit),
	},
};
