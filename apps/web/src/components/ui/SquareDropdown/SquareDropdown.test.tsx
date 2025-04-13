import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { SquareDropdown } from "./SquareDropdown";

describe("SquareDropdown", () => {
  const mockOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders correctly with default props", () => {
    render(<SquareDropdown options={mockOptions} />);
    expect(screen.getByRole("button")).toHaveTextContent("Option 1");
  });

  it("renders with custom default value", () => {
    render(<SquareDropdown options={mockOptions} defaultValue="opt2" />);
    expect(screen.getByRole("button")).toHaveTextContent("Option 2");
  });

  it("opens dropdown on click", () => {
    render(<SquareDropdown options={mockOptions} />);
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    mockOptions.forEach((option) => {
      expect(
        screen.getByRole("option", { name: option.label })
      ).toBeInTheDocument();
    });
  });

  it("calls onChange when selecting an option", () => {
    const handleChange = vi.fn();
    render(<SquareDropdown options={mockOptions} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("option", { name: "Option 2" }));

    expect(handleChange).toHaveBeenCalledWith("opt2");
  });

  it("works as a controlled component", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <SquareDropdown
        options={mockOptions}
        value="opt1"
        onChange={handleChange}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Option 1");

    rerender(
      <SquareDropdown
        options={mockOptions}
        value="opt2"
        onChange={handleChange}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Option 2");
  });

  it("closes dropdown when clicking outside", () => {
    render(<SquareDropdown options={mockOptions} />);

    // Open dropdown
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("applies custom className to the container", () => {
    const customClass = "custom-class";
    render(<SquareDropdown options={mockOptions} className={customClass} />);

    const container = screen.getByRole("button").parentElement;
    expect(container?.className).toContain(customClass);
  });

  it("applies custom optionsClassName to the options container", () => {
    const customOptionsClass = "custom-options-class";
    render(
      <SquareDropdown
        options={mockOptions}
        optionsClassName={customOptionsClass}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    const optionsContainer = screen.getByRole("listbox");
    expect(optionsContainer.className).toContain(customOptionsClass);
  });

  it("toggles dropdown state correctly", () => {
    render(<SquareDropdown options={mockOptions} />);
    const trigger = screen.getByRole("button");

    // Initially closed
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Open
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Close
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
