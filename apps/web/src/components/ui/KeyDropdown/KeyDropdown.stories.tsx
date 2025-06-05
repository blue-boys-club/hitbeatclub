import type { Meta, StoryObj } from "@storybook/react";
import { KeyDropdown } from "./KeyDropdown";
import { useState } from "react";

const meta: Meta<typeof KeyDropdown> = {
	title: "UI/KeyDropdown",
	component: KeyDropdown,
	tags: ["autodocs"],
	argTypes: {
		currentValue: {
			control: "text",
			description: "현재 선택된 키 값",
		},
		isOpen: {
			control: "boolean",
			description: "드롭다운 열림 상태",
		},
		toggleDropdown: {
			action: "toggleDropdown",
			description: "드롭다운 토글 함수",
		},
		onChangeKey: {
			action: "onChangeKey",
			description: "키 변경 시 호출되는 함수",
		},
		onChangeScale: {
			action: "onChangeScale",
			description: "스케일 변경 시 호출되는 함수",
		},
		onClear: {
			action: "onClear",
			description: "선택 초기화 시 호출되는 함수",
		},
	},
};

export default meta;
type Story = StoryObj<typeof KeyDropdown>;

// 기본 상태
export const Default: Story = {
	args: {
		currentValue: undefined,
		isOpen: false,
	},
};

// 키가 선택된 상태
export const WithSelectedKey: Story = {
	args: {
		currentValue: "C",
		isOpen: false,
	},
};

// 드롭다운이 열린 상태
export const Opened: Story = {
	args: {
		currentValue: "C",
		isOpen: true,
	},
};

// 인터랙티브 예제
const InteractiveExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

	return (
		<KeyDropdown
			currentValue={currentValue}
			isOpen={isOpen}
			toggleDropdown={() => setIsOpen(!isOpen)}
			onChangeKey={(key) => {
				setCurrentValue(key);
				setIsOpen(false);
			}}
			onChangeScale={(scale) => {
				console.log("Scale changed:", scale);
			}}
			onClear={() => {
				setCurrentValue(undefined);
				setIsOpen(false);
			}}
		/>
	);
};

export const Interactive: Story = {
	render: () => <InteractiveExample />,
};
