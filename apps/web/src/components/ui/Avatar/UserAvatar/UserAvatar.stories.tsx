import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "./UserAvatar";

const meta = {
  title: "UI/Avatar/UserAvatar",
  component: UserAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "large"],
    },
    isNotification: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/17af72bcfcf825c8cc9d8cc782aa4b0b88576cde?placeholderIfAbsent=true&apiKey=0cf2cce9e17c4309b7c2d6a07cb63357",
    alt: "User avatar",
    size: "small",
  },
};

export const WithNotification: Story = {
  args: {
    ...Default.args,
    isNotification: true,
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: "large",
  },
};

export const LargeWithNotification: Story = {
  args: {
    ...Large.args,
    isNotification: true,
  },
};

export const CustomClassName: Story = {
  args: {
    ...Default.args,
    className: "border-4 border-blue-500",
  },
};
