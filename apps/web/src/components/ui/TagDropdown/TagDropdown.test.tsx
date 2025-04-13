import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { TagDropdown } from "./TagDropdown";
import { cleanup } from "@testing-library/react";

describe("TagDropdown", () => {
	const mockOptions = [
		{ label: "Option 1", value: "option1" },
		{ label: "Option 2", value: "option2" },
	];

	const getTrigger = () => {
		try {
			return screen.getByTestId("tag-dropdown-trigger");
		} catch {
			return screen.getByTestId("tag-dropdown-trigger-slot");
		}
	};

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders with default trigger text", () => {
		render(<TagDropdown options={mockOptions} />);
		expect(screen.getByText("Category")).toBeInTheDocument();
	});

	it("renders with custom trigger text", () => {
		render(
			<TagDropdown
				trigger="Custom"
				options={mockOptions}
			/>,
		);
		expect(screen.getByText("Custom")).toBeInTheDocument();
	});

	it("renders with component trigger", () => {
		render(
			<TagDropdown
				trigger={<div className="text-blue-500">Custom Component</div>}
				options={mockOptions}
			/>,
		);
		expect(screen.getByText("Custom Component")).toBeInTheDocument();
		expect(screen.getByText("Custom Component")).toHaveClass("text-blue-500");
	});

	it("handles long text in trigger and options", () => {
		const longTrigger = "Very Long Category Name That Might Wrap";
		const longOptions = [
			{ label: "Very Long Option Name 1", value: "option1" },
			{ label: "Very Long Option Name 2", value: "option2" },
		];

		render(
			<TagDropdown
				trigger={longTrigger}
				options={longOptions}
			/>,
		);
		expect(screen.getByText(longTrigger)).toBeInTheDocument();

		fireEvent.click(getTrigger());
		longOptions.forEach((option) => {
			expect(screen.getByText(option.label)).toBeInTheDocument();
		});
	});

	it("shows options when clicked", () => {
		render(<TagDropdown options={mockOptions} />);

		fireEvent.click(getTrigger());

		expect(screen.getByTestId("tag-dropdown-menu")).toBeInTheDocument();
		mockOptions.forEach((option) => {
			expect(screen.getByText(option.label)).toBeInTheDocument();
		});
	});

	it("calls onSelect when option is selected", () => {
		const handleSelect = vi.fn();
		const onOpenChange = vi.fn();
		render(
			<TagDropdown
				options={mockOptions}
				onSelect={handleSelect}
				onOpenChange={onOpenChange}
			/>,
		);

		fireEvent.click(getTrigger());
		fireEvent.click(screen.getByText(mockOptions[0]!.label));

		expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]!.value);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("closes dropdown when clicking outside", () => {
		const onOpenChange = vi.fn();
		render(
			<TagDropdown
				options={mockOptions}
				onOpenChange={onOpenChange}
			/>,
		);

		fireEvent.click(getTrigger());
		expect(screen.getByTestId("tag-dropdown-menu")).toBeInTheDocument();

		fireEvent.mouseDown(document.body);
		expect(screen.queryByTestId("tag-dropdown-menu")).not.toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders with children as trigger", () => {
		render(
			<TagDropdown options={mockOptions}>
				<button>Custom Button</button>
			</TagDropdown>,
		);
		expect(screen.getByText("Custom Button")).toBeInTheDocument();
	});

	it("opens dropdown on children trigger click", () => {
		const onOpenChange = vi.fn();
		render(
			<TagDropdown
				options={mockOptions}
				onOpenChange={onOpenChange}
			>
				<button>Custom Button</button>
			</TagDropdown>,
		);

		fireEvent.click(screen.getByText("Custom Button"));
		expect(screen.getByTestId("tag-dropdown-menu")).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("renders in open state when defaultOpen is true", () => {
		render(
			<TagDropdown
				options={mockOptions}
				defaultOpen={true}
			/>,
		);
		expect(screen.getByTestId("tag-dropdown-menu")).toBeInTheDocument();
	});

	it("toggles dropdown state correctly", () => {
		const onOpenChange = vi.fn();
		render(
			<TagDropdown
				options={mockOptions}
				onOpenChange={onOpenChange}
			/>,
		);

		const trigger = getTrigger();

		// Open
		fireEvent.click(trigger);
		expect(screen.getByTestId("tag-dropdown-menu")).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(true);

		// Close
		fireEvent.click(trigger);
		expect(screen.queryByTestId("tag-dropdown-menu")).not.toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders without chevron when showChevron is false", () => {
		render(
			<TagDropdown
				options={mockOptions}
				showChevron={false}
			/>,
		);
		const chevron = document.querySelector("svg"); // Assuming ChevronDown is the only SVG
		expect(chevron).not.toBeInTheDocument();
	});
});
