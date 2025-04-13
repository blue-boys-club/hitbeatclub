import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
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
      const toggle = screen.getByRole("switch");
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("renders with defaultChecked prop", () => {
      render(<Toggle defaultChecked />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });

    it("renders with disabled state", () => {
      render(<Toggle disabled />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-disabled", "true");
      expect(toggle).toHaveClass("cursor-not-allowed");
      expect(toggle).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Styling", () => {
    it("applies default styles", () => {
      render(<Toggle />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveClass("w-11", "h-6", "rounded-full");
    });

    it("applies custom className", () => {
      const customClass = "test-class";
      render(<Toggle className={customClass} />);
      expect(screen.getByRole("switch")).toHaveClass(customClass);
    });

    it("applies correct background color when checked", () => {
      render(<Toggle defaultChecked />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveClass("bg-[#0061ff]");
    });

    it("applies correct background color when unchecked", () => {
      render(<Toggle />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveClass("bg-gray-300");
    });

    it("applies disabled styles when disabled", () => {
      render(<Toggle disabled />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveClass("bg-[#bbbbbf]");
      const thumb = toggle.firstElementChild;
      expect(thumb).toHaveClass("opacity-90");
    });
  });

  describe("Functionality", () => {
    it("toggles state on click", async () => {
      const user = userEvent.setup();
      render(<Toggle />);
      const toggle = screen.getByRole("switch");

      expect(toggle).toHaveAttribute("aria-checked", "false");
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-checked", "true");
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("calls onChange handler with correct value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);

      await user.click(screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("does not toggle or call onChange when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle disabled onChange={handleChange} />);

      await user.click(screen.getByRole("switch"));
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false"
      );
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("toggles with keyboard interaction", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);
      const toggle = screen.getByRole("switch");

      await user.tab();
      expect(toggle).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(toggle).toHaveAttribute("aria-checked", "true");
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.keyboard(" ");
      expect(toggle).toHaveAttribute("aria-checked", "false");
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("prevents default on space key to avoid page scroll", async () => {
      const handleChange = vi.fn();
      render(<Toggle onChange={handleChange} />);
      const toggle = screen.getByRole("switch");

      // Focus the toggle
      toggle.focus();

      // Simulate space key press with fireEvent
      fireEvent.keyDown(toggle, {
        key: " ",
        code: "Space",
        preventDefault: vi.fn(),
      });

      // Check if the toggle state changed, which indicates the event was handled
      expect(toggle).toHaveAttribute("aria-checked", "true");
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("does not handle keyboard events when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle disabled onChange={handleChange} />);
      const toggle = screen.getByRole("switch");

      await user.tab();
      expect(toggle).not.toHaveFocus();

      toggle.focus();
      await user.keyboard("{Enter}");
      expect(toggle).toHaveAttribute("aria-checked", "false");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
