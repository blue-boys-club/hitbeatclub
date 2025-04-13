import type { Meta, StoryObj } from "@storybook/react";
import { SearchTag } from "./SearchTag";

/**
 * `SearchTag` is a search input component that provides a clean, styled interface for search functionality.
 *
 * ## Features
 * - Customizable styling through className props
 * - Search icon trigger
 * - Keyboard accessibility
 * - Responsive design
 * - Hidden browser default search UI elements
 *
 * ## Usage
 * ```tsx
 * // Basic usage
 * <SearchTag onSearch={(value) => console.log('Search:', value)} />
 *
 * // With custom styling
 * <SearchTag
 *   wrapperClassName="custom-wrapper"
 *   className="custom-input"
 *   onSearch={handleSearch}
 * />
 *
 * // With onChange handler
 * <SearchTag
 *   onChange={(e) => console.log('Input:', e.target.value)}
 *   onSearch={handleSearch}
 * />
 * ```
 */
const meta: Meta<typeof SearchTag> = {
	title: "UI/SearchTag",
	component: SearchTag,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A search input component with custom styling and search trigger functionality.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onSearch: {
			description: "Callback fired when search is triggered via icon click",
			control: false,
		},
		onChange: {
			description: "Callback fired when input value changes",
			control: false,
		},
		wrapperClassName: {
			description: "Additional classes for the wrapper element",
			control: "text",
		},
		className: {
			description: "Additional classes for the input element",
			control: "text",
		},
		placeholder: {
			description: "Input placeholder text",
			control: "text",
			defaultValue: "Search Tags...",
		},
	},
};

export default meta;
type Story = StoryObj<typeof SearchTag>;

/**
 * Default search tag component with basic functionality.
 */
export const Default: Story = {
	args: {},
};

/**
 * Search tag with custom wrapper styling.
 */
export const CustomWrapper: Story = {
	args: {
		wrapperClassName: "shadow-md hover:shadow-lg transition-shadow",
	},
};

/**
 * Search tag with custom input styling.
 */
export const CustomInput: Story = {
	args: {
		className: "placeholder:text-gray-400",
		placeholder: "Custom placeholder...",
	},
};

/**
 * Search tag with search functionality demonstration.
 */
export const WithSearchHandler: Story = {
	args: {
		onSearch: (value) => alert(`Search triggered with: ${value}`),
	},
};

/**
 * Search tag with both search and change handlers.
 */
export const WithChangeHandler: Story = {
	args: {
		onChange: (e) => console.log("Input changed:", e.target.value),
		onSearch: (value) => console.log("Search triggered:", value),
	},
};

/**
 * Search tag at maximum width (mobile view).
 */
export const FullWidth: Story = {
	args: {
		wrapperClassName: "w-full",
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
