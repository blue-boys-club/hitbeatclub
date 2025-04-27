import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "./SectionHeader";

const meta: Meta<typeof SectionHeader> = {
	title: "UI/SectionHeader",
	component: SectionHeader,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["large", "medium", "small"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
	args: {
		title: "Section Title",
	},
};

export const WithSubtitle: Story = {
	args: {
		title: "Section Title",
		subtitle: "This is a subtitle",
	},
};

export const WithLink: Story = {
	args: {
		title: "Section Title",
		goTo: {
			label: "See All",
			href: "#",
		},
	},
};

export const WithButton: Story = {
	args: {
		title: "Section Title",
		goTo: {
			label: "Click Me",
			href: "#",
		},
	},
};

export const Medium: Story = {
	args: {
		title: "Medium Header",
		size: "medium",
	},
};

export const Small: Story = {
	args: {
		title: "Small Header",
		size: "small",
	},
};

export const KoreanTitle: Story = {
	args: {
		title: "섹션 제목",
	},
};

export const CompleteExample: Story = {
	args: {
		title: "Featured Items",
		subtitle: "Our top picks",
		size: "large",
		goTo: {
			label: "View All",
			href: "/items",
		},
	},
};
