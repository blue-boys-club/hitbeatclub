import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AlbumAvatar } from "./AlbumAvatar";
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
			data-testid="album-avatar-image"
		/>
	),
}));

describe("AlbumAvatar", () => {
	const mockImageSrc = "https://example.com/test-image.jpg";

	afterEach(() => {
		cleanup();
	});

	it("renders correctly with required props", () => {
		render(<AlbumAvatar src={mockImageSrc} />);
		const image = screen.getByTestId("album-avatar-image");
		const wrapper = screen.getByTestId("album-avatar-wrapper");
		const border = screen.getByTestId("album-avatar-border");

		expect(image).toBeInTheDocument();
		expect(wrapper).toBeInTheDocument();
		expect(border).toBeInTheDocument();
		expect(image).toHaveAttribute("src", mockImageSrc);
		expect(image).toHaveAttribute("alt", "Album avatar");
	});

	it("renders with custom alt text", () => {
		render(
			<AlbumAvatar
				src={mockImageSrc}
				alt="Custom alt"
			/>,
		);
		const image = screen.getByTestId("album-avatar-image");
		expect(image).toHaveAttribute("alt", "Custom alt");
	});

	it("applies custom className to image", () => {
		render(
			<AlbumAvatar
				src={mockImageSrc}
				className="border-red-500 rounded-lg"
			/>,
		);
		const image = screen.getByTestId("album-avatar-image");
		expect(image.className).toContain("rounded-lg");
		expect(image.className).toContain("border-red-500");
	});

	it("applies custom wrapperClassName to container", () => {
		render(
			<AlbumAvatar
				src={mockImageSrc}
				wrapperClassName="w-[100px] h-[100px]"
			/>,
		);
		const wrapper = screen.getByTestId("album-avatar-wrapper");
		expect(wrapper.className).toContain("w-[100px]");
		expect(wrapper.className).toContain("h-[100px]");
	});

	it("maintains default styling", () => {
		render(<AlbumAvatar src={mockImageSrc} />);
		const image = screen.getByTestId("album-avatar-image");
		const wrapper = screen.getByTestId("album-avatar-wrapper");
		const border = screen.getByTestId("album-avatar-border");

		// Check wrapper default styles
		expect(wrapper.className).toContain("w-[212px]");
		expect(wrapper.className).toContain("h-[212px]");
		expect(wrapper.className).toContain("relative");

		// Check border default styles
		expect(border.className).toContain("rounded-full");
		expect(border.className).toContain("border-[10px]");
		expect(border.className).toContain("border-black");

		// Check image default styles
		expect(image.className).toContain("rounded-full");
		expect(image.className).toContain("border-dashed");
		expect(image.className).toContain("border-white");
		expect(image.className).toContain("border-[4px]");
	});
});
