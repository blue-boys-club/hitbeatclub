import type { Meta, StoryObj } from "@storybook/react";
import { PurchaseButton } from "./PurchaseButton";

const meta: Meta<typeof PurchaseButton> = {
	title: "UI/PurchaseButton",
	component: PurchaseButton,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary"],
		},
		size: {
			control: "select",
			options: ["small", "medium", "large"],
		},
		iconColor: {
			control: "color",
		},
		children: {
			control: "text",
		},
		className: {
			control: "text",
			description: "추가적인 스타일링을 위한 className",
		},
	},
};

export default meta;
type Story = StoryObj<typeof PurchaseButton>;

export const Primary: Story = {
	args: {
		variant: "primary",
		size: "small",
		children: "15,000 KRW",
		iconColor: "#FFFFFF",
		className: "",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		size: "small",
		children: "15,000 KRW",
		iconColor: "#000000",
		className: "",
	},
};

export const Small: Story = {
	args: {
		variant: "primary",
		size: "small",
		children: "15,000 KRW",
		iconColor: "#FFFFFF",
		className: "",
	},
};

export const Medium: Story = {
	args: {
		variant: "primary",
		size: "medium",
		children: "15,000 KRW",
		iconColor: "#FFFFFF",
		className: "",
	},
};

export const Large: Story = {
	args: {
		variant: "primary",
		size: "large",
		children: "15,000 KRW",
		iconColor: "#FFFFFF",
		className: "",
	},
};
