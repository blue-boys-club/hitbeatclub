import type { Meta, StoryObj } from "@storybook/react";
import { TagDropdown } from "./TagDropdown";

const meta: Meta<typeof TagDropdown> = {
  title: "UI/Components/TagDropdown",
  component: TagDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ minHeight: "200px", padding: "60px 20px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TagDropdown>;

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export const Default: Story = {
  args: {
    options: mockOptions,
    trigger: "Select Option",
  },
};

export const WithCustomTrigger: Story = {
  args: {
    options: mockOptions,
    trigger: (
      <>
        <span className="text-blue-500">Custom</span>
        <span className="text-red-500">Trigger</span>
      </>
    ),
  },
};

export const WithChildrenTrigger: Story = {
  args: {
    options: mockOptions,
  },
  render: (args) => (
    <TagDropdown {...args}>
      <div className="flex items-center gap-2">
        <span className="text-green-500">●</span>
        <span>Trigger as Child</span>
      </div>
    </TagDropdown>
  ),
};

export const WithStyledChildrenTrigger: Story = {
  args: {
    options: mockOptions,
    className:
      "bg-green-500 text-white hover:bg-green-600 rounded-lg px-4 py-2",
  },
  render: (args) => (
    <TagDropdown {...args}>
      <span>Styled Children Trigger</span>
    </TagDropdown>
  ),
};

export const InitiallyOpen: Story = {
  args: {
    options: mockOptions,
    trigger: "Initially Open",
    defaultOpen: true,
  },
};

export const WithoutChevron: Story = {
  args: {
    options: mockOptions,
    trigger: "No Chevron",
    showChevron: false,
  },
};

export const WithCallbacks: Story = {
  args: {
    options: mockOptions,
    trigger: "With Callbacks",
  },
  render: (args) => (
    <TagDropdown
      {...args}
      onSelect={(value) => console.log("Selected:", value)}
      onOpenChange={(isOpen) =>
        console.log("Dropdown is:", isOpen ? "open" : "closed")
      }
    />
  ),
};

export const CustomStyling: Story = {
  args: {
    options: mockOptions,
    trigger: "Custom Styles",
    className: "bg-blue-500 text-white hover:bg-blue-600",
    optionsClassName: "bg-gray-100 border-blue-500",
  },
};
