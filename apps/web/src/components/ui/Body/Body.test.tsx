import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BodyLarge, BodyMedium, BodySmall } from "..";
import { AllowedElements } from "./BaseBody";

describe("Body Components", () => {
  const testCases = [
    { Component: BodyLarge, size: "large", text: "Body Large Text" },
    { Component: BodyMedium, size: "medium", text: "Body Medium Text" },
    { Component: BodySmall, size: "small", text: "Body Small Text" },
  ] as const;

  const tagNames = [
    "div",
    "span",
    "p",
    "article",
    "section",
    "main",
    "aside",
    "nav",
    "header",
    "footer",
  ] as const;

  testCases.forEach(({ Component, size, text }) => {
    describe(`${size}`, () => {
      afterEach(() => {
        cleanup();
      });

      it("should render with correct text", () => {
        render(<Component>{text}</Component>);
        const body = screen.getByText(text);
        expect(body).toBeInTheDocument();
      });

      it("should apply custom className", () => {
        const customClass = "bg-white";
        render(<Component className={customClass}>{text}</Component>);
        const body = screen.getByText(text);
        expect(body).toHaveClass(customClass);
      });

      describe("should apply correct font based on language", () => {
        // Test Korean text
        it("should apply suit font for Korean text", () => {
          render(<Component>한글 텍스트</Component>);
          const koreanBody = screen.getByText("한글 텍스트");
          expect(koreanBody).toHaveClass("font-suit");
        });

        // Test English text
        it("should apply suisse font for English text", () => {
          render(<Component>English Text</Component>);
          const englishBody = screen.getByText("English Text");
          expect(englishBody).toHaveClass("font-suisse");
        });

        it("should apply suit font for Mixed Language text", () => {
          render(<Component>한글 텍스트 English Text</Component>);
          const mixedBody = screen.getByText("한글 텍스트 English Text");
          expect(mixedBody).toHaveClass("font-suit");
        });
      });

      describe("should render as different HTML element when as prop is provided", () => {
        tagNames.forEach((tagName) => {
          it(`should render as '${tagName}' when as prop is provided`, () => {
            render(
              <Component as={tagName as AllowedElements}>{text}</Component>
            );
            const body = screen.getByText(text);
            expect(body.tagName.toLowerCase()).toBe(tagName);
          });
        });
      });
    });
  });
});
