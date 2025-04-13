"use client";

import { Search } from "@/assets/svgs/Search";
import { cn } from "@/common/utils";
import { forwardRef, memo, useRef } from "react";

export interface SearchTagProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onSearch"
  > {
  wrapperClassName?: string;
  /**
   * Callback fired when search is triggered via icon click
   */
  onSearch?: (value: string) => void;
}

export const SearchTag = memo(
  forwardRef<HTMLInputElement, SearchTagProps>(
    (
      { className, wrapperClassName, onSearch, onChange, ...props },
      forwardedRef
    ) => {
      const innerRef = useRef<HTMLInputElement>(null);
      const inputRef = (forwardedRef ||
        innerRef) as React.RefObject<HTMLInputElement>;

      const handleIconClick = () => {
        onSearch?.(inputRef.current?.value || "");
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
      };

      return (
        <label
          className={cn(
            "inline-flex items-center justify-between",
            "w-[208px] h-6",
            "rounded-[40px] border-2 border-hbc-black bg-hbc-white",
            "lg:w-[180px]",
            "sm:w-full sm:max-w-[208px]",
            wrapperClassName
          )}
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="Search Tags..."
            onChange={handleChange}
            className={cn(
              "w-full bg-transparent",
              "text-hbc-black font-inter text-base font-normal leading-4",
              "placeholder:text-hbc-black",
              "focus:outline-none",
              "px-[7px]",
              "[&::-webkit-search-cancel-button]:hidden",
              "[&::-webkit-search-decoration]:hidden",
              "[&::-webkit-search-results-button]:hidden",
              "[&::-webkit-search-results-decoration]:hidden",
              "[&::-ms-clear]:hidden",
              "[&::-ms-reveal]:hidden",
              className
            )}
            {...props}
          />
          <button
            tabIndex={0}
            onClick={handleIconClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleIconClick();
              }
            }}
            className="flex items-center justify-center p-[4px_5px] gap-[10px] w-[22px] h-5 cursor-pointer mr-[3px]"
          >
            <Search />
          </button>
        </label>
      );
    }
  )
);

SearchTag.displayName = "SearchTag";
