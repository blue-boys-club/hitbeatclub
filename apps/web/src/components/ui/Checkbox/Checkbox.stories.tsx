import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
	title: "UI/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
		},
		checked: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		disabled: false,
		checked: false,
	},
};

export const Checked: Story = {
	args: {
		checked: true,
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		disabled: true,
		checked: true,
	},
};
