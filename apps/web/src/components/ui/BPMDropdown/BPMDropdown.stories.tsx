import type { Meta, StoryObj } from "@storybook/react";
import { BPMDropdown } from "./BPMDropdown";
import { useState } from "react";

const meta: Meta<typeof BPMDropdown> = {
	title: "UI/BPMDropdown",
	component: BPMDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		bpmType: {
			control: "radio",
			options: ["exact", "range"],
			description: "BPM type selection",
		},
		bpmValue: {
			control: "number",
			description: "Exact BPM value",
		},
		bpmRangeValue: {
			control: "object",
			description: "BPM range values (min and max)",
		},
		asChild: {
			control: "boolean",
			description: "Use custom trigger component",
		},
		onChangeExactBPM: {
			action: "onChangeExactBPM",
			description: "Callback when exact BPM changes",
		},
		onChangeBPMType: {
			action: "onChangeBPMType",
			description: "Callback when BPM type changes",
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

// 인터랙티브 스토리를 위한 템플릿
const InteractiveTemplate = (args: any) => {
	const [bpmType, setBpmType] = useState<"exact" | "range">(args.bpmType || "exact");
	const [bpmValue, setBpmValue] = useState<number | undefined>(args.bpmValue);
	const [bpmRangeValue, setBpmRangeValue] = useState<{ min?: number; max?: number } | undefined>(args.bpmRangeValue);

	const handleChangeBPMType = (type: "exact" | "range") => {
		setBpmType(type);
		args.onChangeBPMType?.(type);
	};

	const handleChangeExactBPM = (bpm: number) => {
		setBpmValue(bpm);
		args.onChangeExactBPM?.(bpm);
	};

	const handleChangeBPMRange = (type: "min" | "max", bpm: number) => {
		setBpmRangeValue((prev) => ({
			...prev,
			[type]: bpm === 0 ? undefined : bpm,
		}));
		args.onChangeBPMRange?.(type, bpm);
	};

	const handleClear = () => {
		setBpmValue(undefined);
		setBpmRangeValue({ min: undefined, max: undefined });
		args.onClear?.();
	};

	return (
		<div style={{ width: "300px" }}>
			<BPMDropdown
				{...args}
				bpmType={bpmType}
				bpmValue={bpmValue}
				bpmRangeValue={bpmRangeValue}
				onChangeBPMType={handleChangeBPMType}
				onChangeExactBPM={handleChangeExactBPM}
				onChangeBPMRange={handleChangeBPMRange}
				onClear={handleClear}
			/>
		</div>
	);
};

export const Default: Story = {
	render: InteractiveTemplate,
	args: {
		bpmType: "exact",
		bpmValue: undefined,
		bpmRangeValue: undefined,
	},
};

export const WithExactBPM: Story = {
	render: InteractiveTemplate,
	args: {
		bpmType: "exact",
		bpmValue: 120,
		bpmRangeValue: undefined,
	},
};

export const WithBPMRange: Story = {
	render: InteractiveTemplate,
	args: {
		bpmType: "range",
		bpmValue: undefined,
		bpmRangeValue: {
			min: 100,
			max: 140,
		},
	},
};

export const CustomTrigger: Story = {
	render: (args) => {
		const [bpmType, setBpmType] = useState<"exact" | "range">("exact");
		const [bpmValue, setBpmValue] = useState<number | undefined>();
		const [bpmRangeValue, setBpmRangeValue] = useState<{ min?: number; max?: number } | undefined>();

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					bpmType={bpmType}
					bpmValue={bpmValue}
					bpmRangeValue={bpmRangeValue}
					onChangeBPMType={setBpmType}
					onChangeExactBPM={setBpmValue}
					onChangeBPMRange={(type, bpm) =>
						setBpmRangeValue((prev) => ({ ...prev, [type]: bpm === 0 ? undefined : bpm }))
					}
					onClear={() => {
						setBpmValue(undefined);
						setBpmRangeValue({ min: undefined, max: undefined });
					}}
					asChild
				>
					<button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
						🎵 Custom BPM Trigger
					</button>
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};

export const RenderPropPattern: Story = {
	render: (args) => {
		const [bpmType, setBpmType] = useState<"exact" | "range">("exact");
		const [bpmValue, setBpmValue] = useState<number | undefined>(120);
		const [bpmRangeValue, setBpmRangeValue] = useState<{ min?: number; max?: number } | undefined>();

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					bpmType={bpmType}
					bpmValue={bpmValue}
					bpmRangeValue={bpmRangeValue}
					onChangeBPMType={setBpmType}
					onChangeExactBPM={setBpmValue}
					onChangeBPMRange={(type, bpm) =>
						setBpmRangeValue((prev) => ({ ...prev, [type]: bpm === 0 ? undefined : bpm }))
					}
					onClear={() => {
						setBpmValue(undefined);
						setBpmRangeValue({ min: undefined, max: undefined });
					}}
				>
					{({ currentValue, isOpen, bpmType }) => (
						<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium text-sm">{currentValue || "BPM 미설정"}</div>
									<div className="text-xs text-gray-500">Type: {bpmType}</div>
								</div>
								<div className="text-xl">{isOpen ? "🔼" : "🔽"}</div>
							</div>
						</div>
					)}
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};

export const RenderPropWithAsChild: Story = {
	render: (args) => {
		const [bpmType, setBpmType] = useState<"exact" | "range">("range");
		const [bpmValue, setBpmValue] = useState<number | undefined>();
		const [bpmRangeValue, setBpmRangeValue] = useState<{ min?: number; max?: number } | undefined>({
			min: 100,
			max: 140,
		});

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					bpmType={bpmType}
					bpmValue={bpmValue}
					bpmRangeValue={bpmRangeValue}
					onChangeBPMType={setBpmType}
					onChangeExactBPM={setBpmValue}
					onChangeBPMRange={(type, bpm) =>
						setBpmRangeValue((prev) => ({ ...prev, [type]: bpm === 0 ? undefined : bpm }))
					}
					onClear={() => {
						setBpmValue(undefined);
						setBpmRangeValue({ min: undefined, max: undefined });
					}}
					asChild
				>
					{({ currentValue, isOpen, bpmType, bpmValue, bpmRangeValue }) => (
						<button className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg">
							<div className="flex flex-col items-center">
								<div className="text-lg font-bold">🎼 {currentValue || "BPM 설정"}</div>
								<div className="text-sm opacity-90">
									{bpmType === "exact" ? "정확한 BPM" : "BPM 범위"}
									{isOpen && " (열림)"}
								</div>
							</div>
						</button>
					)}
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};
