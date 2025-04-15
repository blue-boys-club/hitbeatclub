import type { Meta, StoryObj } from "@storybook/react";
import { FreeDownloadButton } from "./FreeDownloadButton";

const meta = {
  title: "UI/FreeDownloadButton",
  component: FreeDownloadButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description: "버튼의 스타일 변형",
      defaultValue: "primary",
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
      defaultValue: "small",
    },
    children: {
      control: "text",
      description: "버튼 내부 텍스트",
    },
    className: {
      control: "text",
      description: "추가 스타일링을 위한 클래스",
    },
    onClick: {
      action: "clicked",
      description: "클릭 이벤트 핸들러",
    },
  },
} satisfies Meta<typeof FreeDownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "무료 다운로드",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "small",
    children: "무료 다운로드",
  },
};

export const Small: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "무료 다운로드",
  },
};

export const Medium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "무료 다운로드",
  },
};

export const Large: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: "무료 다운로드",
  },
};
