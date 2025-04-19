import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Sidebar } from "./Sidebar";

export default {
	title: "Layout/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "사이드바 컴포넌트입니다. 확장/축소가 가능하며 좋아요와 팔로우 탭을 포함합니다.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="h-[80vh] p-4 bg-gray-100">
				<Story />
			</div>
		),
	],
	argTypes: {
		isCollapsed: { control: "boolean" },
		onToggleCollapse: { action: "onToggleCollapse" },
	},
	args: {
		isCollapsed: false,
		onToggleCollapse: () => console.log("사이드바 접기/펼치기"),
	},
} as Meta<typeof Sidebar>;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
	args: {
		isCollapsed: false,
	},
	render: (args) => {
		const [{ isCollapsed }, updateArgs] = useArgs();

		function handleToggleCollapse() {
			updateArgs({ isCollapsed: !isCollapsed });
		}

		return (
			<Sidebar
				{...args}
				isCollapsed={isCollapsed}
				onToggleCollapse={handleToggleCollapse}
			/>
		);
	},
};
