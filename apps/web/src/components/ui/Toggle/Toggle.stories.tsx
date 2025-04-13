import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
	title: "UI/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	argTypes: {
		defaultChecked: {
			control: "boolean",
			description: "토글의 초기 상태를 설정합니다.",
		},
		disabled: {
			control: "boolean",
			description: "토글의 비활성화 상태를 설정합니다.",
		},
		onChange: {
			action: "changed",
			description: "토글 상태가 변경될 때 호출되는 콜백 함수입니다.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// 기본 토글
export const Default: Story = {
	args: {
		defaultChecked: false,
	},
};

// 활성화된 토글
export const Checked: Story = {
	args: {
		defaultChecked: true,
	},
};

// 비활성화된 토글
export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

// 비활성화되고 체크된 토글
export const DisabledChecked: Story = {
	args: {
		disabled: true,
		defaultChecked: true,
	},
};

// 커스텀 스타일
export const CustomStyle: Story = {
	args: {
		className: "bg-purple-500",
	},
};

// 라벨이 있는 토글
export const WithLabel: Story = {
	render: (args) => (
		<div className="flex items-center space-x-2">
			<Toggle {...args} />
			<label>알림 받기</label>
		</div>
	),
};
