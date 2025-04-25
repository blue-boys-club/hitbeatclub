import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import { useState } from "react";

const meta: Meta<typeof Toggle> = {
	title: "UI/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		checked: {
			control: "boolean",
			description: "컴포넌트의 현재 체크 상태를 제어합니다 (제어 컴포넌트로 사용할 때).",
		},
		defaultChecked: {
			control: "boolean",
			description: "토글의 초기 상태를 설정합니다 (비제어 컴포넌트로 사용할 때).",
		},
		disabled: {
			control: "boolean",
			description: "토글의 비활성화 상태를 설정합니다.",
		},
		onChange: {
			action: "changed",
			description: "토글 상태가 변경될 때 호출되는 콜백 함수입니다.",
		},
		className: {
			control: "text",
			description: "컨테이너 요소에 적용할 추가 클래스입니다.",
		},
		toggleClassName: {
			control: "text",
			description: "토글 라벨 요소에 적용할 추가 클래스입니다.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// 기본 토글 (비제어 컴포넌트)
export const Default: Story = {
	args: {},
	name: "기본 토글 (비제어)",
};

// 기본적으로 체크된 토글 (비제어 컴포넌트)
export const DefaultChecked: Story = {
	args: {
		defaultChecked: true,
	},
	name: "기본 체크됨 (비제어)",
};

// 제어 컴포넌트 토글
export const Controlled: Story = {
	render: function Render(args) {
		const [isChecked, setIsChecked] = useState(false);

		return (
			<div className="flex flex-col items-center gap-4">
				<div className="flex items-center gap-2">
					<Toggle
						{...args}
						checked={isChecked}
						onChange={(e) => setIsChecked(e.target.checked)}
					/>
					<span>상태: {isChecked ? "켜짐" : "꺼짐"}</span>
				</div>
				<button
					onClick={() => setIsChecked((prev) => !prev)}
					className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
				>
					외부에서 토글 전환
				</button>
			</div>
		);
	},
	name: "제어 컴포넌트",
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

// 커스텀 컨테이너 스타일
export const CustomContainerStyle: Story = {
	args: {
		className: "bg-gray-100 p-2 rounded",
	},
};

// 커스텀 토글 스타일
export const CustomToggleStyle: Story = {
	args: {
		toggleClassName: "after:bg-yellow-300",
		defaultChecked: true,
	},
};

// 라벨이 있는 토글
export const WithLabel: Story = {
	render: (args) => (
		<div className="flex items-center space-x-2">
			<Toggle {...args} />
			<span>알림 받기</span>
		</div>
	),
};

// 폼에서 사용하는 토글
export const InForm: Story = {
	render: (args) => (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				alert(`폼 제출됨: 알림동의=${formData.get("notifications") ? "예" : "아니오"}`);
			}}
			className="flex flex-col space-y-4"
		>
			<div className="flex items-center space-x-2">
				<Toggle
					{...args}
					name="notifications"
					id="notifications"
				/>
				<label htmlFor="notifications">알림 동의</label>
			</div>
			<button
				type="submit"
				className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
			>
				제출
			</button>
		</form>
	),
};
