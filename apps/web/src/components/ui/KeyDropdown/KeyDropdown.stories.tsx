import type { Meta, StoryObj } from "@storybook/react";
import { KeyDropdown } from "./KeyDropdown";
import { useState } from "react";
import { KeyValue } from "@/features/artist/components/modal/ArtistStudioDashEditTrackModal";

const meta: Meta<typeof KeyDropdown> = {
	title: "UI/KeyDropdown",
	component: KeyDropdown,
	tags: ["autodocs"],
	argTypes: {
		keyValue: {
			control: "object",
			description: "현재 선택된 키 값",
		},
		scaleValue: {
			control: "text",
			description: "현재 선택된 스케일 값",
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
		keyValue: undefined,
		scaleValue: null,
		onChangeKey: () => {},
		onChangeScale: () => {},
		onClear: () => {},
	},
};

// 키가 선택된 상태
export const WithSelectedKey: Story = {
	args: {
		keyValue: { label: "C", value: "C" },
		scaleValue: null,
		onChangeKey: () => {},
		onChangeScale: () => {},
		onClear: () => {},
	},
};

// 키와 스케일이 모두 선택된 상태
export const WithKeyAndScale: Story = {
	args: {
		keyValue: { label: "C", value: "C" },
		scaleValue: "Major",
		onChangeKey: () => {},
		onChangeScale: () => {},
		onClear: () => {},
	},
};

// 인터랙티브 예제
const InteractiveExample = () => {
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>(undefined);
	const [scaleValue, setScaleValue] = useState<string | null>(null);

	return (
		<KeyDropdown
			keyValue={keyValue}
			scaleValue={scaleValue}
			onChangeKey={(key) => {
				setKeyValue(key);
			}}
			onChangeScale={(scale) => {
				setScaleValue(scale);
			}}
			onClear={() => {
				setKeyValue(undefined);
				setScaleValue(null);
			}}
		/>
	);
};

export const Interactive: Story = {
	render: () => <InteractiveExample />,
};
