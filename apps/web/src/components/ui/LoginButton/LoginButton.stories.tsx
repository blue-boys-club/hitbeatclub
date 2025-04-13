import type { Meta, StoryObj } from "@storybook/react";
import { LoginButton } from "./LoginButton";

const meta: Meta<typeof LoginButton> = {
  title: "UI/LoginButton",
  component: LoginButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginButton>;

export const Default: Story = {
  args: {},
};

export const CustomClassName: Story = {
  args: {
    className: "w-[200px]",
  },
};
