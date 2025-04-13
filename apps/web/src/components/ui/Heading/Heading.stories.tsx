import type { Meta, StoryObj } from "@storybook/react";
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "./Heading";

const meta: Meta = {
	title: "UI/Heading",
	component: Heading1,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		children: {
			description: "텍스트/컴포넌트",
			type: "string",
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// English Examples
export const Heading1English: Story = {
	args: {
		children: "Welcome to HitBeatClub",
	},
};

export const Heading2English: Story = {
	render: () => <Heading2>Our Mission Statement</Heading2>,
};

export const Heading3English: Story = {
	render: () => <Heading3>Join Our Community</Heading3>,
};

export const Heading4English: Story = {
	render: () => <Heading4>Latest Updates</Heading4>,
};

export const Heading5English: Story = {
	render: () => <Heading5>Featured Events</Heading5>,
};

export const Heading6English: Story = {
	render: () => <Heading6>Quick Links</Heading6>,
};

// Korean Examples
export const Heading1Korean: Story = {
	render: () => <Heading1>히트비트 클럽에 오신 것을 환영합니다</Heading1>,
};

export const Heading2Korean: Story = {
	render: () => <Heading2>우리의 미션</Heading2>,
};

export const Heading3Korean: Story = {
	render: () => <Heading3>커뮤니티에 참여하세요</Heading3>,
};

export const Heading4Korean: Story = {
	render: () => <Heading4>최신 업데이트</Heading4>,
};

export const Heading5Korean: Story = {
	render: () => <Heading5>주요 이벤트</Heading5>,
};

export const Heading6Korean: Story = {
	render: () => <Heading6>바로가기</Heading6>,
};

// Mixed Language Examples
export const Heading1LanguageMixed: Story = {
	render: () => <Heading1>Welcome to 히트비트클럽</Heading1>,
};

export const Heading1ComponentMixed: Story = {
	render: () => (
		<Heading1>
			<span className="text-hbc-blue">Welcome to</span> <span className="text-hbc-red">HitBeatClub</span>
		</Heading1>
	),
};
