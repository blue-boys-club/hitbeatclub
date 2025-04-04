import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from ".";

describe("Heading Components", () => {
  const testCases = [
    { Component: Heading1, level: "h1", text: "Heading 1" },
    { Component: Heading2, level: "h2", text: "Heading 2" },
    { Component: Heading3, level: "h3", text: "Heading 3" },
    { Component: Heading4, level: "h4", text: "Heading 4" },
    { Component: Heading5, level: "h5", text: "Heading 5" },
    { Component: Heading6, level: "h6", text: "Heading 6" },
  ] as const;

  testCases.forEach(({ Component, level, text }) => {
    describe(`${level}`, () => {
      afterEach(() => {
        cleanup();
      });

      it("should render with correct text", () => {
        render(<Component>{text}</Component>);
        const heading = screen.getByRole("heading", {
          level: Number(level[1]),
        });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(text);
      });

      it("should apply custom className", () => {
        const customClass = "bg-white";
        render(<Component className={customClass}>{text}</Component>);
        const heading = screen.getByRole("heading", {
          level: Number(level[1]),
        });
        expect(heading).toHaveClass(customClass);
      });

      describe("should apply correct font based on language", () => {
        // Test Korean text
        it("should apply suit font for Korean text", () => {
          render(<Component>한글 제목</Component>);
          const koreanHeading = screen.getByRole("heading", {
            level: Number(level[1]),
          });
          expect(koreanHeading).toHaveClass("font-suit");
        });

        // Test English text
        it("should apply suisse font for English text", () => {
          render(<Component>English Title</Component>);
          const englishHeading = screen.getByRole("heading", {
            level: Number(level[1]),
          });
          expect(englishHeading).toHaveClass("font-suisse");
        });

        it("should apply suisse font for Mixed Language text", () => {
          render(<Component>한글 제목 English Title</Component>);
          const mixedHeading = screen.getByRole("heading", {
            level: Number(level[1]),
          });
          expect(mixedHeading).toHaveClass("font-suit");
        });
      });
    });
  });
});
