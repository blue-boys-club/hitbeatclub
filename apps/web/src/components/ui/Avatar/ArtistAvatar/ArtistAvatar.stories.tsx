import type { Meta, StoryObj } from "@storybook/react";
import { ArtistAvatar } from "./ArtistAvatar";

const meta: Meta<typeof ArtistAvatar> = {
	title: "UI/Avatar/ArtistAvatar",
	component: ArtistAvatar,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["small", "large"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ArtistAvatar>;

export const Small: Story = {
	args: {
		src: "https://picsum.photos/200",
		alt: "Small user avatar",
		size: "small",
	},
};

export const Large: Story = {
	args: {
		src: "https://picsum.photos/300",
		alt: "Large user avatar",
		size: "large",
	},
};
