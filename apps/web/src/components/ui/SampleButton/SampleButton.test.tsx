import { expect, describe, it, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SampleButton } from "./SampleButton";

describe("SampleButton", () => {
  afterEach(() => {
    cleanup();
  });

  const validateBaseStyles = (element: HTMLElement) => {
    const baseStyles = [
      "cursor-pointer",
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-md",
      "text-sm",
      "font-medium",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-offset-2",
      "disabled:opacity-50",
      "disabled:pointer-events-none",
    ];

    baseStyles.forEach((style) => {
      expect(element).toHaveClass(style);
    });
  };

  describe("variants", () => {
    const variants = [
      {
        name: "default",
        classes: ["bg-blue-500", "text-white", "hover:bg-blue-600"],
      },
      {
        name: "secondary",
        classes: ["bg-gray-100", "text-gray-900", "hover:bg-gray-200"],
      },
      {
        name: "destructive",
        classes: ["bg-red-500", "text-white", "hover:bg-red-600"],
      },
      {
        name: "outline",
        classes: ["border", "border-gray-300", "hover:bg-gray-100"],
      },
      { name: "ghost", classes: ["hover:bg-gray-100"] },
      {
        name: "link",
        classes: ["text-blue-500", "hover:underline", "underline-offset-4"],
      },
    ] as const;

    variants.forEach(({ name, classes }) => {
      it(`renders ${name} variant correctly`, () => {
        render(<SampleButton variant={name}>{name}</SampleButton>);
        const button = screen.getByRole("button", { name });
        expect(button).toHaveTextContent(name);
        classes.forEach((className) => {
          expect(button).toHaveClass(className);
        });
        validateBaseStyles(button);
      });
    });
  });

  describe("sizes", () => {
    const sizes = [
      { name: "sm", classes: ["h-9", "px-3"] },
      { name: "default", classes: ["h-10", "px-4", "py-2"] },
      { name: "lg", classes: ["h-11", "px-8"] },
      { name: "icon", classes: ["h-10", "w-10"] },
    ] as const;

    sizes.forEach(({ name, classes }) => {
      it(`renders ${name} size correctly`, () => {
        render(<SampleButton size={name}>{name}</SampleButton>);
        const button = screen.getByRole("button", { name });
        expect(button).toHaveTextContent(name);
        classes.forEach((className) => {
          expect(button).toHaveClass(className);
        });
        validateBaseStyles(button);
      });
    });
  });

  describe("states", () => {
    it("renders disabled state correctly", () => {
      render(<SampleButton disabled>Disabled</SampleButton>);
      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button).toBeDisabled();
      validateBaseStyles(button);
    });

    it("renders with custom className", () => {
      render(<SampleButton className="custom-class">Custom</SampleButton>);
      const button = screen.getByRole("button", { name: "Custom" });
      expect(button).toHaveClass("custom-class");
      validateBaseStyles(button);
    });
  });

  describe("interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SampleButton onClick={handleClick}>Click me</SampleButton>);
      const button = screen.getByRole("button", { name: "Click me" });

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <SampleButton disabled onClick={handleClick}>
          Disabled
        </SampleButton>
      );
      const button = screen.getByRole("button", { name: "Disabled" });

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles keyboard interactions", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SampleButton onClick={handleClick}>Press me</SampleButton>);
      const button = screen.getByRole("button", { name: "Press me" });

      // Focus the button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("accessibility", () => {
    it("has proper focus styles", () => {
      render(<SampleButton>Focus me</SampleButton>);
      const button = screen.getByText("Focus me");
      expect(button).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2"
      );
    });
  });
});
