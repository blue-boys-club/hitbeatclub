import type { Meta, StoryObj } from "@storybook/react";
import { AlbumAvatar } from "./AlbumAvatar";

const meta: Meta<typeof AlbumAvatar> = {
	title: "UI/Avatar/AlbumAvatar",
	component: AlbumAvatar,
	tags: ["autodocs"],
	argTypes: {
		src: {
			control: "text",
			description: "앨범 아바타 이미지 소스",
		},
		alt: {
			control: "text",
			description: "이미지 대체 텍스트",
		},
		className: {
			control: "text",
			description: "이미지에 적용될 추가 클래스",
		},
		wrapperClassName: {
			control: "text",
			description: "래퍼 div에 적용될 추가 클래스",
		},
	},
};

export default meta;
type Story = StoryObj<typeof AlbumAvatar>;

export const Default: Story = {
	args: {
		src: "https://picsum.photos/200",
		alt: "Sample album cover",
	},
};

export const CustomSize: Story = {
	args: {
		src: "https://picsum.photos/200",
		alt: "Custom sized album cover",
		wrapperClassName: "w-[100px] h-[100px]",
	},
};

export const WithCustomBorder: Story = {
	args: {
		src: "https://picsum.photos/200",
		alt: "Album cover with custom border",
		className: "border-[6px] border-blue-500",
	},
};
