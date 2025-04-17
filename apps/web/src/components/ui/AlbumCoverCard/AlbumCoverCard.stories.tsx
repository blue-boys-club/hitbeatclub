import { Meta, StoryObj } from "@storybook/react";
import { AlbumCoverCard, AlbumCoverCardProps } from "./AlbumCoverCard";

const meta: Meta<typeof AlbumCoverCard> = {
	title: "UI/AlbumCoverCard",
	component: AlbumCoverCard,
	tags: ["autodocs"],
	argTypes: {
		albumImgSrc: {
			description: "앨범 커버 이미지 URL 입니다.",
			control: "text",
		},
		size: {
			description: "앨범의 크기를 지정합니다.",
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl"],
		},
		rounded: {
			description: "앨범 모서리 둥글기 여부를 지정합니다",
			control: "select",
			options: ["none", "small", "large"],
		},
		border: {
			description: "테두리 여부를 지정합니다",
			control: "boolean",
		},
		padding: {
			description: "앨범 커버 주변에 패딩을 추가할지 여부를 지정합니다.",
			control: "boolean",
		},
		onClick: { action: "clicked" },
	},
	args: {
		albumImgSrc: "https://via.placeholder.com/180", // 기본 이미지
		size: "lg",
		rounded: "large",
		border: true,
		padding: true,
	},
};

export default meta;

type Story = StoryObj<typeof AlbumCoverCard>;

export const Default: Story = {
	args: {},
};

export const ExtraLargeBorder: Story = {
	args: {
		size: "xl",
		rounded: "none",
		border: true,
		padding: true,
	},
};

export const MediumBorder: Story = {
	args: {
		size: "md",
		rounded: "large",
		border: true,
		padding: false,
	},
};

export const LargeSize: Story = {
	args: {
		size: "lg",
		rounded: "small",
		border: false,
		padding: false,
	},
};

export const ExtraSmall: Story = {
	args: {
		size: "xs",
		rounded: "small",
		border: false,
		padding: false,
	},
};

export const MediumPaddingBorder: Story = {
	args: {
		size: "md",
		rounded: "large",
		border: true,
		padding: true,
	},
};

export const SmallPaddingBorder: Story = {
	args: {
		size: "sm",
		rounded: "large",
		border: true,
		padding: true,
	},
};
