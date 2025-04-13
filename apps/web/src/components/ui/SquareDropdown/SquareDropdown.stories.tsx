import type { Meta, StoryObj } from "@storybook/react";
import { SquareDropdown } from "./SquareDropdown";

const meta: Meta<typeof SquareDropdown> = {
  title: "UI/Components/SquareDropdown",
  component: SquareDropdown,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "200px", padding: "60px 20px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SquareDropdown>;

const mockOptions = [
  { label: "A - Z", value: "asc" },
  { label: "Popular", value: "popular" },
];

export const Default: Story = {
  args: {
    options: mockOptions,
  },
};

export const WithDefaultValue: Story = {
  args: {
    options: mockOptions,
    defaultValue: "popular",
  },
};

export const Controlled: Story = {
  args: {
    options: mockOptions,
    value: "asc",
    onChange: (value) => console.log("Selected:", value),
  },
};

export const CustomStyling: Story = {
  args: {
    options: mockOptions,
    className: "border-blue-500",
    optionsClassName: "border-blue-500",
  },
};
