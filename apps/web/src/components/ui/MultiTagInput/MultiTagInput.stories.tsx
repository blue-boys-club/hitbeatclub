import type { Meta, StoryObj } from "@storybook/react";
import MultiTagInput from "./MultiTagInput";

const meta: Meta<typeof MultiTagInput> = {
	title: "UI/MultiTagInput",
	component: MultiTagInput,
	tags: ["autodocs"],
	argTypes: {
		maxTags: {
			control: "number",
			description: "최대 태그 개수",
		},
		placeholder: {
			control: "text",
			description: "입력 필드의 플레이스홀더 텍스트",
		},
		allowDirectInput: {
			control: "boolean",
			description: "직접 입력 허용 여부",
		},
		tagColor: {
			control: "text",
			description: "태그 배경색",
		},
		tagTextColor: {
			control: "text",
			description: "태그 텍스트 색상",
		},
	},
};

export default meta;
type Story = StoryObj<typeof MultiTagInput>;

const suggestedTags = [
	{ tag: "음악", count: 120 },
	{ tag: "댄스", count: 85 },
	{ tag: "힙합", count: 65 },
	{ tag: "재즈", count: 45 },
	{ tag: "클래식", count: 30 },
];

export const Default: Story = {
	args: {
		maxTags: 5,
		placeholder: "태그를 입력하세요",
		allowDirectInput: true,
		suggestedTags,
		tagColor: "bg-hbc-black",
		tagTextColor: "text-hbc-white",
	},
};

export const WhiteTheme: Story = {
	args: {
		maxTags: 5,
		placeholder: "태그를 입력하세요",
		allowDirectInput: true,
		suggestedTags,
		tagColor: "bg-white",
		tagTextColor: "text-hbc-black",
	},
};

export const LimitedTags: Story = {
	args: {
		maxTags: 3,
		placeholder: "최대 3개의 태그만 입력 가능합니다",
		allowDirectInput: true,
		suggestedTags,
		tagColor: "bg-hbc-black",
		tagTextColor: "text-hbc-white",
	},
};

export const NoDirectInput: Story = {
	args: {
		maxTags: 5,
		placeholder: "제안된 태그만 선택 가능합니다",
		allowDirectInput: false,
		suggestedTags,
		tagColor: "bg-hbc-black",
		tagTextColor: "text-hbc-white",
	},
};
