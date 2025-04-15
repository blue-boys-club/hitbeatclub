import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["rounded", "square"],
      description: "입력창의 모양을 설정합니다",
    },
    placeholder: {
      control: "text",
      description: "입력창의 플레이스홀더 텍스트를 설정합니다",
    },
    disabled: {
      control: "boolean",
      description: "입력창의 비활성화 여부를 설정합니다",
    },
    className: {
      control: "text",
      description: "추가적인 스타일링을 위한 className",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    variant: "rounded",
    placeholder: "기본 입력창입니다 (rounded)",
    className: "",
  },
};

export const Rounded: Story = {
  args: {
    variant: "rounded",
    placeholder: "둥근 모서리 입력창입니다",
    className: "",
  },
};

export const Square: Story = {
  args: {
    variant: "square",
    placeholder: "각진 모서리 입력창입니다",
    className: "",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "비활성화된 입력창입니다",
    className: "",
  },
};
