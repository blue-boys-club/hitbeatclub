import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { SearchTag } from "./SearchTag";

describe("SearchTag", () => {
	afterEach(() => {
		cleanup();
	});

	describe("Rendering", () => {
		it("renders with placeholder text", () => {
			render(<SearchTag />);
			expect(screen.getByPlaceholderText("Search Tags...")).toBeInTheDocument();
		});

		it("renders with custom placeholder", () => {
			render(<SearchTag placeholder="Custom placeholder" />);
			expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
		});

		it("renders with correct default dimensions", () => {
			render(<SearchTag />);
			const wrapper = screen.getByRole("searchbox").parentElement;
			expect(wrapper).toHaveClass("w-[208px]", "h-6");
		});

		it("renders with correct border styles", () => {
			render(<SearchTag />);
			const wrapper = screen.getByRole("searchbox").parentElement;
			expect(wrapper).toHaveClass("outline-2", "outline-hbc-black", "-outline-offset-1", "rounded-[40px]");
		});

		it("renders search icon button", () => {
			render(<SearchTag />);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("w-[22px]", "h-5");
		});
	});

	describe("Styling", () => {
		it("applies custom className to input", () => {
			const customClass = "test-class";
			render(<SearchTag className={customClass} />);
			expect(screen.getByRole("searchbox")).toHaveClass(customClass);
		});

		it("applies custom className to wrapper", () => {
			const customClass = "wrapper-class";
			render(<SearchTag wrapperClassName={customClass} />);
			expect(screen.getByRole("searchbox").parentElement).toHaveClass(customClass);
		});

		it("hides browser search UI elements", () => {
			render(<SearchTag />);
			const input = screen.getByRole("searchbox");
			expect(input).toHaveClass(
				"[&::-webkit-search-cancel-button]:hidden",
				"[&::-webkit-search-decoration]:hidden",
				"[&::-webkit-search-results-button]:hidden",
				"[&::-webkit-search-results-decoration]:hidden",
			);
		});
	});

	describe("Functionality", () => {
		it("allows text input", async () => {
			const user = userEvent.setup();
			render(<SearchTag />);
			const input = screen.getByRole("searchbox");
			await user.type(input, "test");
			expect(input).toHaveValue("test");
		});

		it("calls onChange when input value changes", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<SearchTag onChange={handleChange} />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "t");

			expect(handleChange).toHaveBeenCalled();
			const mockCall = handleChange.mock.calls[0];
			expect(mockCall?.[0]?.target?.value).toBe("t");
		});

		it("calls onSearch when icon is clicked", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			render(<SearchTag onSearch={handleSearch} />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test");

			const icon = screen.getByRole("button");
			await user.click(icon);

			expect(handleSearch).toHaveBeenCalledWith("test");
		});

		it("maintains empty string as default search value", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			render(<SearchTag onSearch={handleSearch} />);

			const icon = screen.getByRole("button");
			await user.click(icon);

			expect(handleSearch).toHaveBeenCalledWith("");
		});
	});

	describe("Accessibility", () => {
		it("forwards ref to input element", () => {
			const ref = React.createRef<HTMLInputElement>();
			render(<SearchTag ref={ref} />);
			expect(ref.current).toBeInstanceOf(HTMLInputElement);
		});

		it("handles keyboard navigation", async () => {
			const user = userEvent.setup();
			render(<SearchTag />);

			const input = screen.getByRole("searchbox");
			const icon = screen.getByRole("button");

			await user.tab();
			expect(input).toHaveFocus();

			await user.tab();
			expect(icon).toHaveFocus();
		});

		it("triggers search on icon keyboard interaction", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			render(<SearchTag onSearch={handleSearch} />);

			const input = screen.getByRole("searchbox");
			await user.type(input, "test");

			const icon = screen.getByRole("button");
			await user.tab();
			expect(icon).toHaveFocus();

			await user.keyboard("{Enter}");
			expect(handleSearch).toHaveBeenCalledWith("test");

			handleSearch.mockClear();
			await user.keyboard(" ");
			expect(handleSearch).toHaveBeenCalledWith("test");
		});
	});
});
