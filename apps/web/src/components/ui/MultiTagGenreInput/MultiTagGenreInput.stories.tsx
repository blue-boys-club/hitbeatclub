import type { Meta, StoryObj } from "@storybook/react";
import MultiTagInput from "./MultiTagGenreInput";

const meta: Meta<typeof MultiTagInput> = {
	title: "UI/MultiTagInput",
	component: MultiTagInput,
	tags: ["autodocs"],
	argTypes: {
		maxItems: {
			control: "number",
			description: "최대 태그/장르 개수",
		},
		type: {
			control: "select",
			options: ["genre", "tag"],
			description: "태그/장르 타입",
		},
		placeholder: {
			control: "text",
			description: "입력 필드의 플레이스홀더 텍스트",
		},
		allowDirectInput: {
			control: "boolean",
			description: "직접 입력 허용 여부",
		},
	},
};

export default meta;
type Story = StoryObj<typeof MultiTagInput>;

const suggestedTags = [
	{ value: "음악", count: 120 },
	{ value: "댄스", count: 85 },
	{ value: "힙합", count: 65 },
	{ value: "재즈", count: 45 },
	{ value: "클래식", count: 30 },
];

export const Default: Story = {
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "태그를 입력하세요",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
	},
};

export const Genre: Story = {
	args: {
		maxItems: 5,
		type: "genre",
		placeholder: "장르를 입력하세요",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
	},
};

export const LimitedTags: Story = {
	args: {
		maxItems: 3,
		type: "tag",
		placeholder: "최대 3개의 태그만 입력 가능합니다",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
	},
};

export const NoDirectInput: Story = {
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "제안된 태그만 선택 가능합니다",
		allowDirectInput: false,
		suggestedItems: suggestedTags,
	},
};
