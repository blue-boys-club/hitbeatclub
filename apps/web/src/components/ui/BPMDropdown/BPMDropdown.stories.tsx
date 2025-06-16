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
		minBpm: {
			control: "number",
			description: "Minimum BPM value",
		},
		maxBpm: {
			control: "number",
			description: "Maximum BPM value",
		},
		asChild: {
			control: "boolean",
			description: "Use custom trigger component",
		},
		onChangeMinBpm: {
			action: "onChangeMinBpm",
			description: "Callback when minimum BPM changes",
		},
		onChangeMaxBpm: {
			action: "onChangeMaxBpm",
			description: "Callback when maximum BPM changes",
		},
		onClear: {
			action: "onClear",
			description: "Callback when clear button is clicked",
		},
		onSubmit: {
			action: "onSubmit",
			description: "Callback when dropdown closes with final values",
		},
	},
};

export default meta;
type Story = StoryObj<typeof BPMDropdown>;

// 인터랙티브 스토리를 위한 템플릿
const InteractiveTemplate = (args: any) => {
	const [minBpm, setMinBpm] = useState<number | undefined>(args.minBpm);
	const [maxBpm, setMaxBpm] = useState<number | undefined>(args.maxBpm);

	const handleChangeMinBpm = (bpm: number) => {
		setMinBpm(bpm);
		args.onChangeMinBpm?.(bpm);
	};

	const handleChangeMaxBpm = (bpm: number) => {
		setMaxBpm(bpm);
		args.onChangeMaxBpm?.(bpm);
	};

	const handleClear = () => {
		setMinBpm(undefined);
		setMaxBpm(undefined);
		args.onClear?.();
	};

	const handleSubmit = (newMinBpm: number | undefined, newMaxBpm: number | undefined) => {
		setMinBpm(newMinBpm);
		setMaxBpm(newMaxBpm);
		args.onSubmit?.(newMinBpm, newMaxBpm);
	};

	return (
		<div style={{ width: "300px" }}>
			<BPMDropdown
				{...args}
				minBpm={minBpm}
				maxBpm={maxBpm}
				onChangeMinBpm={handleChangeMinBpm}
				onChangeMaxBpm={handleChangeMaxBpm}
				onClear={handleClear}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export const Default: Story = {
	render: InteractiveTemplate,
	args: {
		minBpm: undefined,
		maxBpm: undefined,
	},
};

export const WithExactBPM: Story = {
	render: InteractiveTemplate,
	args: {
		minBpm: 120,
		maxBpm: 120,
	},
};

export const WithBPMRange: Story = {
	render: InteractiveTemplate,
	args: {
		minBpm: 100,
		maxBpm: 140,
	},
};

export const WithPartialRange: Story = {
	render: InteractiveTemplate,
	args: {
		minBpm: 100,
		maxBpm: undefined,
	},
};

export const CustomTrigger: Story = {
	render: (args) => {
		const [minBpm, setMinBpm] = useState<number | undefined>();
		const [maxBpm, setMaxBpm] = useState<number | undefined>();

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					minBpm={minBpm}
					maxBpm={maxBpm}
					onChangeMinBpm={setMinBpm}
					onChangeMaxBpm={setMaxBpm}
					onClear={() => {
						setMinBpm(undefined);
						setMaxBpm(undefined);
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
		const [minBpm, setMinBpm] = useState<number | undefined>(120);
		const [maxBpm, setMaxBpm] = useState<number | undefined>(120);

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					minBpm={minBpm}
					maxBpm={maxBpm}
					onChangeMinBpm={setMinBpm}
					onChangeMaxBpm={setMaxBpm}
					onClear={() => {
						setMinBpm(undefined);
						setMaxBpm(undefined);
					}}
				>
					{({ currentValue, isOpen }) => (
						<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium text-sm">{currentValue || "BPM 미설정"}</div>
									<div className="text-xs text-gray-500">상태: {isOpen ? "열림" : "닫힌"}</div>
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
		const [minBpm, setMinBpm] = useState<number | undefined>(100);
		const [maxBpm, setMaxBpm] = useState<number | undefined>(140);

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					minBpm={minBpm}
					maxBpm={maxBpm}
					onChangeMinBpm={setMinBpm}
					onChangeMaxBpm={setMaxBpm}
					onClear={() => {
						setMinBpm(undefined);
						setMaxBpm(undefined);
					}}
					asChild
				>
					{({ currentValue, isOpen }) => (
						<button className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg">
							<div className="flex flex-col items-center">
								<div className="text-lg font-bold">🎼 {currentValue || "BPM 설정"}</div>
								<div className="text-sm opacity-90">{isOpen ? "설정 중..." : "클릭하여 설정"}</div>
							</div>
						</button>
					)}
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};

export const CardStyleRenderProp: Story = {
	render: (args) => {
		const [minBpm, setMinBpm] = useState<number | undefined>(110);
		const [maxBpm, setMaxBpm] = useState<number | undefined>(130);

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					minBpm={minBpm}
					maxBpm={maxBpm}
					onChangeMinBpm={setMinBpm}
					onChangeMaxBpm={setMaxBpm}
					onClear={() => {
						setMinBpm(undefined);
						setMaxBpm(undefined);
					}}
				>
					{({ currentValue, isOpen }) => (
						<div className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-semibold text-gray-900">BPM 설정</h4>
								<div
									className={`text-xs px-2 py-1 rounded-full ${
										isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
									}`}
								>
									{isOpen ? "열림" : "닫힌"}
								</div>
							</div>
							<div className="text-2xl font-bold text-gray-800 mb-1">{currentValue || "미설정"}</div>
							<div className="flex items-center justify-between text-sm text-gray-500">
								<span>BPM 범위 또는 정확한 값</span>
								<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
							</div>
						</div>
					)}
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};

export const WithOnSubmit: Story = {
	render: (args) => {
		const [minBpm, setMinBpm] = useState<number | undefined>();
		const [maxBpm, setMaxBpm] = useState<number | undefined>();

		const handleSubmit = (newMinBpm: number | undefined, newMaxBpm: number | undefined) => {
			setMinBpm(newMinBpm);
			setMaxBpm(newMaxBpm);
			console.log("BPM 제출:", { min: newMinBpm, max: newMaxBpm });
		};

		return (
			<div style={{ width: "300px" }}>
				<BPMDropdown
					minBpm={minBpm}
					maxBpm={maxBpm}
					onChangeMinBpm={setMinBpm}
					onChangeMaxBpm={setMaxBpm}
					onClear={() => {
						setMinBpm(undefined);
						setMaxBpm(undefined);
					}}
					onSubmit={handleSubmit}
				>
					{({ currentValue, isOpen }) => (
						<div className="cursor-pointer p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium text-sm text-yellow-800">{currentValue || "BPM을 설정하세요"}</div>
									<div className="text-xs text-yellow-600">{isOpen ? "설정 중..." : "onSubmit으로 처리"}</div>
								</div>
								<div className="text-yellow-600">{isOpen ? "⚡" : "⚙️"}</div>
							</div>
						</div>
					)}
				</BPMDropdown>
			</div>
		);
	},
	args: {},
};
