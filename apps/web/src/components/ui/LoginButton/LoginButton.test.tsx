import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LoginButton } from "./LoginButton";

describe("LoginButton", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders correctly with default props", () => {
		render(<LoginButton />);
		const button = screen.getByText("로그인");
		expect(button).toBeInTheDocument();
		expect(button.tagName.toLowerCase()).toBe("span");
		expect(button.parentElement?.tagName.toLowerCase()).toBe("button");
	});

	it("applies custom className correctly", () => {
		const customClass = "hover:w-12";
		render(<LoginButton className={customClass} />);
		const button = screen.getByRole("button");
		expect(button.className).toContain(customClass);
	});

	it("maintains default styling classes", () => {
		render(<LoginButton />);
		const button = screen.getByRole("button");
		expect(button.className).toContain("flex items-center justify-center");
		expect(button.className).toContain("border-hbc-black");
		expect(button.className).toContain("bg-hbc-white");
	});
});
