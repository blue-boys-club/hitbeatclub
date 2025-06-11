import type { Meta, StoryObj } from "@storybook/react";
import { KeyDropdown, KeyValue } from "./KeyDropdown";
import { useState } from "react";

const meta: Meta<typeof KeyDropdown> = {
	title: "UI/KeyDropdown",
	component: KeyDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		keyValue: {
			control: "object",
			description: "Selected key value",
		},
		scaleValue: {
			control: "select",
			options: [null, "Major", "Minor"],
			description: "Selected scale value",
		},
		asChild: {
			control: "boolean",
			description: "Use custom trigger component",
		},
		onChangeKey: {
			action: "onChangeKey",
			description: "Callback when key changes",
		},
		onChangeScale: {
			action: "onChangeScale",
			description: "Callback when scale changes",
		},
		onClear: {
			action: "onClear",
			description: "Callback when clear button is clicked",
		},
	},
};

export default meta;
type Story = StoryObj<typeof KeyDropdown>;

// 인터랙티브 스토리를 위한 템플릿
const InteractiveTemplate = (args: any) => {
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>(args.keyValue);
	const [scaleValue, setScaleValue] = useState<string | null>(args.scaleValue || null);

	const handleChangeKey = (key: KeyValue) => {
		setKeyValue(key);
		args.onChangeKey?.(key);
	};

	const handleChangeScale = (scale: string) => {
		setScaleValue(scale);
		args.onChangeScale?.(scale);
	};

	const handleClear = () => {
		setKeyValue(undefined);
		setScaleValue(null);
		args.onClear?.();
	};

	return (
		<div style={{ width: "300px" }}>
			<KeyDropdown
				{...args}
				keyValue={keyValue}
				scaleValue={scaleValue}
				onChangeKey={handleChangeKey}
				onChangeScale={handleChangeScale}
				onClear={handleClear}
			/>
		</div>
	);
};

export const Default: Story = {
	render: InteractiveTemplate,
	args: {
		keyValue: undefined,
		scaleValue: null,
	},
};

export const WithSelectedKey: Story = {
	render: InteractiveTemplate,
	args: {
		keyValue: { label: "C", value: "C" },
		scaleValue: null,
	},
};

export const WithKeyAndScale: Story = {
	render: InteractiveTemplate,
	args: {
		keyValue: { label: "A", value: "A" },
		scaleValue: "Minor",
	},
};

export const CustomTrigger: Story = {
	render: (args) => {
		const [keyValue, setKeyValue] = useState<KeyValue | undefined>();
		const [scaleValue, setScaleValue] = useState<string | null>(null);

		return (
			<div style={{ width: "300px" }}>
				<KeyDropdown
					keyValue={keyValue}
					scaleValue={scaleValue}
					onChangeKey={setKeyValue}
					onChangeScale={setScaleValue}
					onClear={() => {
						setKeyValue(undefined);
						setScaleValue(null);
					}}
					asChild
				>
					<button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
						🎵 Custom Key Trigger
					</button>
				</KeyDropdown>
			</div>
		);
	},
	args: {},
};

export const RenderPropPattern: Story = {
	render: (args) => {
		const [keyValue, setKeyValue] = useState<KeyValue | undefined>({ label: "C", value: "C" });
		const [scaleValue, setScaleValue] = useState<string | null>("Major");

		return (
			<div style={{ width: "300px" }}>
				<KeyDropdown
					keyValue={keyValue}
					scaleValue={scaleValue}
					onChangeKey={setKeyValue}
					onChangeScale={setScaleValue}
					onClear={() => {
						setKeyValue(undefined);
						setScaleValue(null);
					}}
				>
					{({ currentValue, isOpen, keyValue, scaleValue, activeTab }) => (
						<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium text-sm">{currentValue || "Key 미설정"}</div>
									<div className="text-xs text-gray-500">
										Tab: {activeTab} {keyValue && `| Key: ${keyValue.label}`} {scaleValue && `| Scale: ${scaleValue}`}
									</div>
								</div>
								<div className="text-xl">{isOpen ? "🔼" : "🔽"}</div>
							</div>
						</div>
					)}
				</KeyDropdown>
			</div>
		);
	},
	args: {},
};

export const RenderPropWithAsChild: Story = {
	render: (args) => {
		const [keyValue, setKeyValue] = useState<KeyValue | undefined>();
		const [scaleValue, setScaleValue] = useState<string | null>(null);

		return (
			<div style={{ width: "300px" }}>
				<KeyDropdown
					keyValue={keyValue}
					scaleValue={scaleValue}
					onChangeKey={setKeyValue}
					onChangeScale={setScaleValue}
					onClear={() => {
						setKeyValue(undefined);
						setScaleValue(null);
					}}
					asChild
				>
					{({ currentValue, isOpen, keyValue, scaleValue, activeTab }) => (
						<button className="w-full p-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-lg">
							<div className="flex flex-col items-center">
								<div className="text-lg font-bold">🎼 {currentValue || "Key 설정"}</div>
								<div className="text-sm opacity-90">
									{keyValue && scaleValue
										? `${keyValue.label} ${scaleValue}`
										: keyValue
											? `${keyValue.label} (scale 선택 필요)`
											: "음악 키 선택"}
									{isOpen && " (열림)"}
								</div>
								<div className="text-xs opacity-75">Current tab: {activeTab}</div>
							</div>
						</button>
					)}
				</KeyDropdown>
			</div>
		);
	},
	args: {},
};
