import type { Meta, StoryObj } from "@storybook/react";
import { PopupButton } from "./PopupButton";

const meta: Meta<typeof PopupButton> = {
  title: "UI/PopupButton",
  component: PopupButton,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["confirm", "cancel"],
      description: "버튼의 의도를 설정합니다",
    },
    children: {
      control: "text",
      description: "버튼 내부 텍스트를 설정합니다",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopupButton>;

export const Default: Story = {
  args: {
    children: "기본 버튼",
  },
};

export const Confirm: Story = {
  args: {
    intent: "confirm",
    children: "확인",
  },
};

export const Cancel: Story = {
  args: {
    intent: "cancel",
    children: "취소",
  },
};
