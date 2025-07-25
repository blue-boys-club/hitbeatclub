import type { Meta, StoryObj } from "@storybook/react";
import { TagButton } from "./TagButton";

const meta: Meta<typeof TagButton> = {
	title: "UI/TagButton",
	component: TagButton,
	tags: ["autodocs"],
	argTypes: {
		name: {
			description: "태그 이름",
			control: "text",
		},
		onSelect: {
			description: "태그 클릭 시 실행될 함수",
			action: "clicked",
		},
		className: {
			description: "추가적인 스타일링을 위한 클래스",
			control: "text",
		},
	},
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"태그를 표시하는 버튼 컴포넌트입니다. 클릭 시 배경색이 검정색으로 변경되고 닫기 아이콘이 표시됩니다.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof TagButton>;

export const Default: Story = {
	args: {
		name: "example",
	},
};

export const WithCustomClass: Story = {
	args: {
		name: "custom",
		className: "shadow-md",
	},
};

export const LongName: Story = {
	args: {
		name: "verylongtagnameexample",
	},
};

export const WithKoreanText: Story = {
	args: {
		name: "한글태그",
	},
};

// 여러 태그 버튼을 한번에 보여주는 예시
export const MultipleTagButtons: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<TagButton name="음악" />
			<TagButton name="댄스" />
			<TagButton name="힙합" />
			<TagButton name="재즈" />
		</div>
	),
};
