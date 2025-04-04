import type { Meta, StoryObj } from "@storybook/react";
import { SampleButton } from "./SampleButton";

/**
 * 버튼 컴포넌트는 다양한 스타일과 크기를 지원하는 재사용 가능한 UI 컴포넌트입니다.
 *
 * ### 특징
 * - 다양한 스타일 변형 (default, destructive, outline, secondary, ghost, link)
 * - 다양한 크기 옵션 (default, sm, lg, icon)
 * - 접근성 고려 (키보드 네비게이션, ARIA 속성)
 * - 호버, 포커스, 비활성화 상태 지원
 *
 * ### 사용 예시
 * ```tsx
 * // 기본 버튼
 * <Button>클릭하세요</Button>
 *
 * // 위험한 작업을 위한 버튼
 * <Button variant="destructive">삭제</Button>
 *
 * // 큰 크기의 버튼
 * <Button size="lg">큰 버튼</Button>
 * ```
 */
const meta: Meta<typeof SampleButton> = {
  title: "UI/[Sample] SampleButton",
  component: SampleButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "버튼의 스타일 변형을 선택합니다.",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "버튼의 크기를 선택합니다.",
    },
    disabled: {
      control: "boolean",
      description: "버튼의 비활성화 상태를 설정합니다.",
    },
    children: {
      control: "text",
      description: "버튼 내부에 표시될 내용입니다.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "[Storybook + Unit Test Sample] 재사용 가능한 버튼 컴포넌트입니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SampleButton>;

/**
 * 기본 스타일의 버튼입니다.
 */
export const Default: Story = {
  args: {
    children: "버튼",
  },
};

/**
 * 보조 스타일의 버튼입니다.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "보조 버튼",
  },
};

/**
 * 위험한 작업을 위한 버튼입니다.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "삭제",
  },
};

/**
 * 테두리가 있는 버튼입니다.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "테두리 버튼",
  },
};

/**
 * 배경이 투명한 버튼입니다.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "투명 버튼",
  },
};

/**
 * 링크처럼 보이는 버튼입니다.
 */
export const Link: Story = {
  args: {
    variant: "link",
    children: "링크 버튼",
  },
};

/**
 * 크기 변형 예시입니다.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SampleButton size="sm">작은 버튼</SampleButton>
      <SampleButton size="default">기본 버튼</SampleButton>
      <SampleButton size="lg">큰 버튼</SampleButton>
      <SampleButton size="icon">🔍</SampleButton>
    </div>
  ),
};

/**
 * 비활성화 상태의 버튼입니다.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성화된 버튼",
  },
};

/**
 * 모든 스타일 변형을 한눈에 볼 수 있습니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <SampleButton variant="default">기본</SampleButton>
      <SampleButton variant="secondary">보조</SampleButton>
      <SampleButton variant="destructive">위험</SampleButton>
      <SampleButton variant="outline">테두리</SampleButton>
      <SampleButton variant="ghost">투명</SampleButton>
      <SampleButton variant="link">링크</SampleButton>
    </div>
  ),
};
