import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
	const mockOptions = [
		{ label: "팔로잉 취소", value: "unfollow" },
		{ label: "차단하기", value: "block" },
		{ label: "신고하기", value: "report" },
	];

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders correctly with default props", () => {
		render(<Dropdown options={mockOptions} />);
		expect(screen.getByRole("button")).toHaveTextContent("Please select...");
	});

	it("renders with custom placeholder", () => {
		render(
			<Dropdown
				options={mockOptions}
				placeholder="Select option..."
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Select option...");
	});

	it("opens dropdown on click", () => {
		render(<Dropdown options={mockOptions} />);
		const trigger = screen.getByRole("button");

		fireEvent.click(trigger);

		const listbox = screen.getByRole("listbox");
		expect(listbox).toBeInTheDocument();

		mockOptions.forEach((option) => {
			expect(screen.getByRole("option", { name: option.label })).toBeInTheDocument();
		});
	});

	it("calls onChange when selecting an option", () => {
		const handleChange = vi.fn();
		render(
			<Dropdown
				options={mockOptions}
				onChange={handleChange}
			/>,
		);

		fireEvent.click(screen.getByRole("button"));
		fireEvent.click(screen.getByRole("option", { name: "차단하기" }));

		expect(handleChange).toHaveBeenCalledWith("block");
	});

	it("works as a controlled component", () => {
		const handleChange = vi.fn();
		const { rerender } = render(
			<Dropdown
				options={mockOptions}
				value="unfollow"
				onChange={handleChange}
			/>,
		);

		expect(screen.getByRole("button")).toHaveTextContent("팔로잉 취소");

		rerender(
			<Dropdown
				options={mockOptions}
				value="block"
				onChange={handleChange}
			/>,
		);

		expect(screen.getByRole("button")).toHaveTextContent("차단하기");
	});

	it("closes dropdown when clicking outside", () => {
		render(<Dropdown options={mockOptions} />);

		fireEvent.click(screen.getByRole("button"));
		expect(screen.getByRole("listbox")).toBeInTheDocument();

		fireEvent.mouseDown(document.body);
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("applies custom className to the container", () => {
		const customClass = "custom-class";
		render(
			<Dropdown
				options={mockOptions}
				className={customClass}
			/>,
		);

		const container = screen.getByRole("button").parentElement?.parentElement;
		expect(container?.className).toContain(customClass);
	});

	it("applies custom optionsClassName to the options container", () => {
		const customOptionsClass = "custom-options-class";
		render(
			<Dropdown
				options={mockOptions}
				optionsClassName={customOptionsClass}
			/>,
		);

		fireEvent.click(screen.getByRole("button"));
		const optionsContainer = screen.getByRole("listbox");
		expect(optionsContainer.className).toContain(customOptionsClass);
	});

	it("shows placeholder when no value is selected", () => {
		const placeholder = "Custom placeholder";
		render(
			<Dropdown
				options={mockOptions}
				placeholder={placeholder}
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent(placeholder);
	});

	it("handles keyboard navigation", () => {
		render(<Dropdown options={mockOptions} />);
		const button = screen.getByRole("button");

		fireEvent.click(button);
		const firstOption = screen.getAllByRole("option")[0];
		expect(firstOption).toBeDefined();
		fireEvent.click(firstOption!);

		expect(button).toHaveTextContent(mockOptions[0]!.label);
	});
});
