import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { UserAvatar } from "./UserAvatar";
import { ImageProps } from "next/image";

// Mock next/image since we don't need actual image loading in tests
vi.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt, className, ...props }: ImageProps & { src: string }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			className={className}
			{...props}
			data-testid="user-avatar-image"
		/>
	),
}));

// Mock the Connecting SVG component
vi.mock("@/assets/svgs/Connecting", () => ({
	Connecting: ({ className, ...props }: { className?: string }) => (
		<div
			className={className}
			{...props}
		/>
	),
}));

describe("UserAvatar", () => {
	const mockImageSrc = "https://example.com/test-avatar.jpg";

	const defaultProps = {
		src: mockImageSrc,
		alt: "Test avatar",
	};

	afterEach(() => {
		cleanup();
	});

	it("renders correctly with default props", () => {
		render(<UserAvatar {...defaultProps} />);
		const wrapper = screen.getByTestId("user-avatar");
		const image = screen.getByTestId("user-avatar-image");

		expect(wrapper).toBeInTheDocument();
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", mockImageSrc);
		expect(image).toHaveAttribute("alt", "Test avatar");
	});

	it("applies different sizes correctly", () => {
		const { rerender } = render(
			<UserAvatar
				{...defaultProps}
				size="small"
			/>,
		);
		const wrapper = screen.getByTestId("user-avatar");
		expect(wrapper.className).toContain("w-[51px]");
		expect(wrapper.className).toContain("h-[51px]");

		rerender(
			<UserAvatar
				{...defaultProps}
				size="large"
			/>,
		);
		expect(wrapper.className).toContain("w-[87px]");
		expect(wrapper.className).toContain("h-[87px]");
	});

	it("shows notification badge when isNotification is true", () => {
		const { rerender } = render(<UserAvatar {...defaultProps} />);
		expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();

		rerender(
			<UserAvatar
				{...defaultProps}
				isNotification
			/>,
		);
		const badge = screen.getByTestId("notification-badge");
		expect(badge).toBeInTheDocument();
		expect(badge.className).toContain("absolute");
		expect(badge.className).toContain("z-10");
		expect(badge.className).toContain("top-0");
		expect(badge.className).toContain("right-0");
	});

	it("applies notification badge sizes correctly", () => {
		const { rerender } = render(
			<UserAvatar
				{...defaultProps}
				isNotification
				size="small"
			/>,
		);
		let badge = screen.getByTestId("notification-badge");
		expect(badge.className).toContain("w-[15px]");
		expect(badge.className).toContain("h-[15px]");

		rerender(
			<UserAvatar
				{...defaultProps}
				isNotification
				size="large"
			/>,
		);
		badge = screen.getByTestId("notification-badge");
		expect(badge.className).toContain("w-[25px]");
		expect(badge.className).toContain("h-[25px]");
	});

	it("applies custom className to container", () => {
		render(
			<UserAvatar
				{...defaultProps}
				className="custom-class"
			/>,
		);
		const wrapper = screen.getByTestId("user-avatar");
		expect(wrapper.className).toContain("custom-class");
	});

	it("maintains default styling", () => {
		render(<UserAvatar {...defaultProps} />);
		const wrapper = screen.getByTestId("user-avatar");
		const image = screen.getByTestId("user-avatar-image");

		// Check wrapper default styles
		expect(wrapper.className).toContain("relative");
		expect(wrapper.className).toContain("rounded-full");

		// Check image default styles
		expect(image.className).toContain("absolute");
		expect(image.className).toContain("rounded-full");
		expect(image.className).toContain("w-full");
		expect(image.className).toContain("h-full");
		expect(image.className).toContain("object-cover");
		expect(image.className).toContain("aspect-square");
	});
});
