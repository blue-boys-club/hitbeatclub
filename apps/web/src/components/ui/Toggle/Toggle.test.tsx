import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	describe("Rendering", () => {
		it("renders with default props", () => {
			render(<Toggle />);
			const toggle = screen.getByRole("checkbox");
			expect(toggle).toBeInTheDocument();
			expect(toggle).not.toBeChecked();

			// peer 클래스가 존재하는지 확인
			expect(toggle).toHaveClass("peer");
		});

		it("renders with defaultChecked prop", () => {
			render(<Toggle defaultChecked />);
			const toggle = screen.getByRole("checkbox");
			expect(toggle).toBeChecked();
		});

		it("renders with checked prop (controlled)", () => {
			render(
				<Toggle
					checked={true}
					onChange={() => {}}
				/>,
			);
			const toggle = screen.getByRole("checkbox");
			expect(toggle).toBeChecked();
		});

		it("renders with disabled state", () => {
			render(<Toggle disabled />);
			const toggle = screen.getByRole("checkbox");
			expect(toggle).toBeDisabled();

			const label = toggle.nextElementSibling;
			expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
		});
	});

	describe("Styling", () => {
		it("applies default styles to the label", () => {
			render(<Toggle />);
			const toggle = screen.getByRole("checkbox");
			const label = toggle.nextElementSibling;
			expect(label).toHaveClass("w-11", "h-6", "rounded-full");
			expect(label).toHaveClass("after:absolute"); // 절대 위치 추가됨 확인
		});

		it("applies custom className to container", () => {
			const customClass = "test-class";
			render(<Toggle className={customClass} />);
			const container = screen.getByRole("checkbox").parentElement;
			expect(container).toHaveClass(customClass);
		});

		it("applies toggleClassName to the label", () => {
			const toggleClass = "custom-toggle";
			render(<Toggle toggleClassName={toggleClass} />);
			const label = screen.getByRole("checkbox").nextElementSibling;
			expect(label).toHaveClass(toggleClass);
		});

		it("has correct visual styles for label based on checked state", () => {
			render(<Toggle defaultChecked />);
			const label = screen.getByRole("checkbox").nextElementSibling;
			expect(label).toHaveClass("peer-checked:bg-[#0061ff]");
		});
	});

	describe("Functionality", () => {
		it("toggles state on click", async () => {
			const user = userEvent.setup();
			render(<Toggle />);
			const toggle = screen.getByRole("checkbox");

			expect(toggle).not.toBeChecked();
			await user.click(toggle);
			expect(toggle).toBeChecked();
			await user.click(toggle);
			expect(toggle).not.toBeChecked();
		});

		it("calls onChange handler with correct value", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Toggle onChange={handleChange} />);
			const toggle = screen.getByRole("checkbox");

			await user.click(toggle);
			expect(handleChange).toHaveBeenCalled();

			// 첫 번째 호출 매개변수가 체크박스 이벤트인지 확인
			const event = handleChange.mock.calls[0]?.[0];
			expect(event).toBeTruthy();
			expect(event.target.checked).toBe(true);
		});

		it("works as a controlled component", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { rerender } = render(
				<Toggle
					checked={false}
					onChange={handleChange}
				/>,
			);

			const toggle = screen.getByRole("checkbox");
			expect(toggle).not.toBeChecked();

			// 유저 클릭은 checked 속성을 직접 변경하지 않음 (제어 컴포넌트)
			await user.click(toggle);
			expect(handleChange).toHaveBeenCalled();
			expect(toggle).not.toBeChecked(); // 여전히 체크되지 않음

			// props가 변경되면 컴포넌트 상태가 바뀜
			rerender(
				<Toggle
					checked={true}
					onChange={handleChange}
				/>,
			);
			expect(toggle).toBeChecked();
		});

		it("does not toggle or call onChange when disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<Toggle
					disabled
					onChange={handleChange}
				/>,
			);

			await user.click(screen.getByRole("checkbox"));
			expect(screen.getByRole("checkbox")).not.toBeChecked();
			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("Accessibility", () => {
		it("can be focused using tab key", async () => {
			const user = userEvent.setup();
			render(<Toggle />);
			const toggle = screen.getByRole("checkbox");

			await user.tab();
			expect(toggle).toHaveFocus();
		});

		it("can be toggled with click and responds to onChange", async () => {
			const handleChange = vi.fn();
			render(<Toggle onChange={handleChange} />);
			const toggle = screen.getByRole("checkbox");

			await userEvent.click(toggle);
			expect(toggle).toBeChecked();
			expect(handleChange).toHaveBeenCalled();
		});

		it("works with standard HTML form functionality", async () => {
			const handleSubmit = vi.fn((e) => e.preventDefault());
			render(
				<form onSubmit={handleSubmit}>
					<Toggle
						name="notification"
						value="on"
					/>
					<button type="submit">Submit</button>
				</form>,
			);

			const toggle = screen.getByRole("checkbox");
			const submitButton = screen.getByRole("button");

			await userEvent.click(toggle);
			expect(toggle).toBeChecked();

			await userEvent.click(submitButton);
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
});
