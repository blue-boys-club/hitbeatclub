import type { Meta, StoryObj } from "@storybook/react";
import { MobileFilterButton } from "./MobileFilterButton";

const meta: Meta<typeof MobileFilterButton> = {
	title: "UI/MobileFilterButton",
	component: MobileFilterButton,
	tags: ["autodocs"],
	argTypes: {
		onFilterChange: {
			description: "필터 상태 변경 시 호출되는 콜백 함수",
			action: "filter changed",
		},
		className: {
			description: "추가적인 스타일링을 위한 클래스",
			control: "text",
		},
	},
	parameters: {
		layout: "centered",
		backgrounds: {
			default: "dark",
			values: [{ name: "dark", value: "#000000" }],
		},
		docs: {
			description: {
				component:
					"필터 기능을 위한 토글 버튼 컴포넌트입니다. 클릭 시 내부 상태가 변경되고 배경색과 텍스트 색상이 반전됩니다.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof MobileFilterButton>;

// 기본 필터 버튼
export const Default: Story = {
	args: {
		children: "필터",
	},
};

// 다양한 텍스트 길이
export const TextVariations: Story = {
	render: () => (
		<div className="flex gap-4">
			<MobileFilterButton>짧은</MobileFilterButton>
			<MobileFilterButton>일반 길이 텍스트</MobileFilterButton>
			<MobileFilterButton>매우 긴 필터 버튼 텍스트입니다</MobileFilterButton>
		</div>
	),
};

// 필터 그룹 예시
export const FilterGroup: Story = {
	render: () => (
		<div className="flex gap-2">
			<MobileFilterButton>전체</MobileFilterButton>
			<MobileFilterButton>힙합</MobileFilterButton>
			<MobileFilterButton>R&B</MobileFilterButton>
			<MobileFilterButton>록</MobileFilterButton>
			<MobileFilterButton>재즈</MobileFilterButton>
		</div>
	),
};

// 커스텀 스타일 예시
export const CustomStyles: Story = {
	render: () => (
		<div className="flex gap-4">
			<MobileFilterButton className="shadow-lg">그림자</MobileFilterButton>
			<MobileFilterButton className="min-w-[150px]">고정 너비</MobileFilterButton>
			<MobileFilterButton className="text-lg">큰 텍스트</MobileFilterButton>
		</div>
	),
};
