import type { Meta, StoryObj } from "@storybook/react";
import { SubscribeButton } from "./SubscribeButton";

const meta: Meta<typeof SubscribeButton> = {
	title: "UI/SubscribeButton",
	component: SubscribeButton,
	tags: ["autodocs"],
	argTypes: {
		isSubscribed: {
			control: "boolean",
			description: "구독 상태를 표시합니다",
		},
		className: {
			control: "text",
			description: "추가 스타일링을 위한 클래스명",
		},
		onClick: { action: "clicked" },
	},
};

export default meta;
type Story = StoryObj<typeof SubscribeButton>;

export const Default: Story = {
	args: {
		isSubscribed: false,
	},
};

export const Subscribed: Story = {
	args: {
		isSubscribed: true,
	},
};

export const WithCustomClassName: Story = {
	args: {
		isSubscribed: false,
		className: "w-[200px]",
	},
};
