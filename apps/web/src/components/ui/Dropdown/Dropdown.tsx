"use client";

import { cn } from "@/common/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  value?: string;
  defaultValue?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  className?: string;
  optionsClassName?: string;
  placeholder?: string;
}

export const Dropdown = ({
  value: controlledValue,
  defaultValue,
  options,
  onChange,
  className,
  optionsClassName,
  placeholder = "Please select...",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "left"
  );
  const selectRef = useRef<HTMLSelectElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentValue = controlledValue ?? internalValue;
  const currentLabel = options.find((opt) => opt.value === currentValue)?.label;

  const updateDropdownPosition = useCallback(() => {
    if (!dropdownRef.current || !triggerRef.current) return;

    const screenWidth = window.innerWidth;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = dropdownRef.current.offsetWidth;
    // const spaceRight = screenWidth - triggerRect.right;
    // const spaceLeft = triggerRect.left;

    // Default to left unless it would overflow screen
    setDropdownPosition(
      triggerRect.left + dropdownWidth > screenWidth ? "right" : "left"
    );
    return;
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen, updateDropdownPosition]);

  const handleSelect = useCallback(
    (value: string) => {
      if (!controlledValue) {
        setInternalValue(value);
      }
      onChange?.(value);
      setIsOpen(false);
    },
    [controlledValue, onChange]
  );

  return (
    <div
      ref={dropdownRef}
      className={cn("relative inline-flex flex-col w-fit", className)}
    >
      <div className="relative w-full">
        <select
          ref={selectRef}
          value={currentValue ?? ""}
          onChange={(e) => handleSelect(e.target.value)}
          className="sr-only"
          aria-hidden="true"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-full h-[35px]",
            "border border-black rounded-[5px]",
            "bg-white text-[#4D4D4F]",
            "text-[16px] font-bold tracking-[0.01em]",
            "focus:outline-none cursor-pointer",
            "px-4 pr-10",
            "relative"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "block truncate text-left",
              !currentValue && "text-gray-400"
            )}
          >
            {currentLabel || placeholder}
          </span>
          <svg
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-[13px] h-[8.75px]",
              "transition-transform",
              isOpen && "rotate-180"
            )}
            viewBox="0 0 14 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.35 8.875L-0.3 2.225L1.825 0.125L6.35 4.65L10.875 0.125L13 2.225L6.35 8.875Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute top-[calc(100%+2px)]",
            dropdownPosition === "left" ? "left-0" : "right-0",
            "z-50 w-full max-w-[calc(100%+4px)]"
          )}
        >
          <ul
            role="listbox"
            className={cn(
              "w-full",
              "border-2 border-black rounded-[5px]",
              "bg-white",
              "py-[10px] px-[10px]",
              "space-y-[10px]",
              "overflow-y-auto",
              "max-w-full",
              optionsClassName
            )}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={currentValue === option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "px-[10px] py-[4px]",
                  "rounded-[40px]",
                  "text-[16px] font-bold leading-[16px]",
                  "cursor-pointer",
                  "transition-colors duration-200",
                  "truncate",
                  currentValue === option.value
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-50"
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
