import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ArtistAvatar } from "./ArtistAvatar";
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
			data-testid="artist-avatar-image"
		/>
	),
}));

describe("ArtistAvatar", () => {
	const mockImageSrc = "https://example.com/test-artist.jpg";

	afterEach(() => {
		cleanup();
	});

	it("renders correctly with default props", () => {
		render(<ArtistAvatar src={mockImageSrc} />);
		const image = screen.getByTestId("artist-avatar-image");

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", mockImageSrc);
		expect(image).toHaveAttribute("alt", "Artist avatar");
	});

	it("renders correctly with small size", () => {
		render(
			<ArtistAvatar
				src={mockImageSrc}
				size="small"
			/>,
		);
		const image = screen.getByTestId("artist-avatar-image");
		expect(image.className).toContain("w-[174px]");
		expect(image.className).toContain("h-[174px]");
		expect(image).toHaveAttribute("width", "696");
		expect(image).toHaveAttribute("height", "696");
	});

	it("renders correctly with large size", () => {
		render(
			<ArtistAvatar
				src={mockImageSrc}
				size="large"
			/>,
		);
		const image = screen.getByTestId("artist-avatar-image");
		expect(image.className).toContain("w-[252px]");
		expect(image.className).toContain("h-[252px]");
		expect(image).toHaveAttribute("width", "1008");
		expect(image).toHaveAttribute("height", "1008");
	});

	it("applies custom className correctly", () => {
		const customClass = "hover:bg-red-500";
		render(
			<ArtistAvatar
				src={mockImageSrc}
				className={customClass}
			/>,
		);
		const image = screen.getByTestId("artist-avatar-image");
		expect(image.className).toContain(customClass);
	});

	it("sets custom alt text correctly", () => {
		const altText = "Custom alt text";
		render(
			<ArtistAvatar
				src={mockImageSrc}
				alt={altText}
			/>,
		);
		const image = screen.getByTestId("artist-avatar-image");
		expect(image).toHaveAttribute("alt", altText);
	});

	it("maintains default styling", () => {
		render(<ArtistAvatar src={mockImageSrc} />);
		const image = screen.getByTestId("artist-avatar-image");

		// Check default styles
		expect(image.className).toContain("rounded-full");
		expect(image.className).toContain("object-cover");
		expect(image.className).toContain("aspect-square");
	});

	it("passes additional props to image element", () => {
		render(
			<ArtistAvatar
				src={mockImageSrc}
				data-custom="test"
				aria-label="Artist profile"
			/>,
		);
		const image = screen.getByTestId("artist-avatar-image");
		expect(image).toHaveAttribute("data-custom", "test");
		expect(image).toHaveAttribute("aria-label", "Artist profile");
	});
});
