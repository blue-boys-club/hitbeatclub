import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
	title: "UI/Dropdown",
	component: Dropdown,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div style={{ minHeight: "200px", padding: "60px 20px" }}>
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const mockOptions = [
	{ label: "팔로잉 취소", value: "unfollow" },
	{ label: "차단하기", value: "block" },
	{ label: "신고하기", value: "report" },
];

const longOptions = [
	{
		label: "This is a very long option that should be truncated when necessary and shown fully in dropdown",
		value: "long1",
	},
	{
		label: "Another extremely long option text that demonstrates how the dropdown handles overflow",
		value: "long2",
	},
	{ label: "Short option", value: "short" },
	{ label: "Medium length option text", value: "medium" },
];

export const Default: Story = {
	args: {
		options: mockOptions,
	},
};

export const WithCustomPlaceholder: Story = {
	args: {
		options: mockOptions,
		placeholder: "Select an option...",
	},
};

export const WithDefaultValue: Story = {
	args: {
		options: mockOptions,
		defaultValue: "block",
	},
};

export const Controlled: Story = {
	args: {
		options: mockOptions,
		value: "report",
		onChange: (value) => console.log("Selected:", value),
	},
};

export const WithLongOptions: Story = {
	args: {
		options: longOptions,
		placeholder: "Select a long option...",
	},
};

export const FixedWidthWithLongOptions: Story = {
	args: {
		options: longOptions,
		placeholder: "Select a long option...",
		className: "w-[200px]",
	},
};

export const WideFixedWidthWithLongOptions: Story = {
	args: {
		options: longOptions,
		placeholder: "Select a long option...",
		className: "w-[400px]",
	},
};

export const CustomStyling: Story = {
	args: {
		options: mockOptions,
		className: "w-[300px]",
		optionsClassName: "bg-gray-50",
	},
};
