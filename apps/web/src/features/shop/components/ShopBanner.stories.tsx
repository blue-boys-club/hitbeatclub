import type { Meta, StoryObj } from "@storybook/react";
import { ShopBanner } from "./ShopBanner";

const meta: Meta<typeof ShopBanner> = {
	title: "Features/Shop/ShopBanner",
	component: ShopBanner,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ShopBanner>;

// Use placeholder images for stories
export const Default: Story = {
	args: {},
};
