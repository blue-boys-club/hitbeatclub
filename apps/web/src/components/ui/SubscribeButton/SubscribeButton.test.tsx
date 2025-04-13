import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubscribeButton } from "./SubscribeButton";

describe("SubscribeButton", () => {
	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders unsubscribed state correctly", () => {
		render(<SubscribeButton isSubscribed={false} />);

		expect(screen.getByText("ARTIST STUDIO")).toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveClass("bg-hbc-white");
		expect(screen.getByRole("button")).toHaveClass("text-hbc-black");
	});

	it("renders subscribed state correctly", () => {
		render(<SubscribeButton isSubscribed={true} />);

		expect(screen.getByText("ARTIST STUDIO")).toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveClass("bg-hbc-red");
		expect(screen.getByRole("button")).toHaveClass("text-hbc-white");
		expect(screen.queryByTestId("lock-icon")).not.toBeInTheDocument();
	});

	it("shows lock icon only in unsubscribed state", () => {
		const { rerender } = render(<SubscribeButton isSubscribed={false} />);
		expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();

		rerender(<SubscribeButton isSubscribed={true} />);
		expect(screen.getByRole("button").querySelector("svg")).not.toBeInTheDocument();
	});

	it("handles click events", async () => {
		const handleClick = vi.fn();
		render(
			<SubscribeButton
				isSubscribed={false}
				onClick={handleClick}
			/>,
		);

		const button = screen.getByRole("button");
		await userEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("applies custom className correctly", () => {
		const customClass = "test-class";
		render(
			<SubscribeButton
				isSubscribed={false}
				className={customClass}
			/>,
		);

		expect(screen.getByRole("button")).toHaveClass(customClass);
	});
});
