import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
	title: "UI/Badge",
	component: Badge,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive", "secondary", "outline"],
			description: "배지의 스타일을 지정합니다",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "배지의 크기를 지정합니다",
		},
		bold: {
			control: "select",
			options: ["semibold", "bold", "extrabold"],
			description: "폰트 두께를 지정합니다",
		},
		outline: {
			control: "boolean",
			description: "테두리 여부를 지정합니다",
		},
		rounded: {
			control: "boolean",
			description: "모서리 둥글기 여부를 지정합니다",
		},
		className: {
			control: "text",
			description: "추가적인 스타일링을 위한 className",
		},
		children: {
			control: "text",
			description: "배지 내부 텍스트를 지정합니다",
		},
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		variant: "default",
		size: "md",
		bold: "bold",
		children: "기본 배지",
		className: "",
	},
};

export const Small: Story = {
	args: {
		variant: "default",
		size: "sm",
		bold: "bold",
		children: "작은 배지",
		className: "",
	},
};

export const Large: Story = {
	args: {
		variant: "default",
		size: "lg",
		bold: "bold",
		children: "큰 배지",
		className: "",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		size: "md",
		bold: "semibold",
		rounded: true,
		children: "경고 배지",
		className: "",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		size: "md",
		bold: "extrabold",
		rounded: true,
		children: "보조 배지",
		className: "",
	},
};

export const RoundedOutlineWithbold: Story = {
	args: {
		variant: "outline",
		size: "md",
		bold: "bold",
		outline: true,
		rounded: true,
		children: "굵은 아웃라인 배지",
		className: "",
	},
};

export const OutlineWithbold: Story = {
	args: {
		variant: "outline",
		size: "md",
		bold: "bold",
		outline: true,
		children: "얇은 아웃라인 배지",
		className: "",
	},
};
