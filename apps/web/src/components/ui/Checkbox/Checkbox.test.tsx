import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("체크박스가 올바르게 렌더링된다", () => {
		render(<Checkbox data-testid="checkbox" />);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toHaveAttribute("type", "checkbox");
	});

	it("체크박스가 초기 상태에서 체크되지 않는다", () => {
		render(<Checkbox data-testid="checkbox" />);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).not.toBeChecked();
	});

	it("체크박스가 checked prop으로 체크 상태를 설정할 수 있다", () => {
		render(
			<Checkbox
				data-testid="checkbox"
				checked
			/>,
		);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toBeChecked();
	});

	it("체크박스가 disabled prop으로 비활성화될 수 있다", () => {
		render(
			<Checkbox
				data-testid="checkbox"
				disabled
			/>,
		);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toBeDisabled();
	});

	it("체크박스 클릭 시 onChange 핸들러가 호출된다", () => {
		const mockOnChange = vi.fn();
		render(
			<Checkbox
				data-testid="checkbox"
				onChange={mockOnChange}
			/>,
		);
		const checkbox = screen.getByTestId("checkbox");

		fireEvent.click(checkbox);
		expect(mockOnChange).toHaveBeenCalledTimes(1);
	});

	it("올바른 CSS 클래스가 적용된다", () => {
		render(
			<Checkbox
				data-testid="checkbox"
				className="custom-class"
			/>,
		);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toHaveClass("custom-class");
		expect(checkbox).toHaveClass("bg-[#CFCECE]");
	});
});
