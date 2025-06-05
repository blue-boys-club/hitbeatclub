import type { Meta, StoryObj } from "@storybook/react";
import { BPMDropdown } from "./BPMDropdown";

const meta: Meta<typeof BPMDropdown> = {
	title: "UI/BPMDropdown",
	component: BPMDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		bpmValue: {
			control: "number",
			description: "Exact BPM value",
		},
		bpmRangeValue: {
			control: "object",
			description: "BPM range values (min and max)",
		},
		onChangeExactBPM: {
			action: "onChangeExactBPM",
			description: "Callback when exact BPM changes",
		},
		onChangeBPMRange: {
			action: "onChangeBPMRange",
			description: "Callback when BPM range changes",
		},
		onClear: {
			action: "onClear",
			description: "Callback when clear button is clicked",
		},
	},
};

export default meta;
type Story = StoryObj<typeof BPMDropdown>;

export const Default: Story = {
	args: {
		bpmValue: undefined,
		bpmRangeValue: undefined,
	},
};

export const WithExactBPM: Story = {
	args: {
		bpmValue: 120,
		bpmRangeValue: undefined,
	},
};

export const WithBPMRange: Story = {
	args: {
		bpmValue: undefined,
		bpmRangeValue: {
			min: 100,
			max: 140,
		},
	},
};
