"use client";

import { cn } from "@/common/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SquareDropdownOption {
	label: string;
	value: string;
}

export interface SquareDropdownProps {
	value?: string;
	defaultValue?: string;
	options: SquareDropdownOption[];
	onChange?: (value: string) => void;
	className?: string;
	optionsClassName?: string;
}

export const SquareDropdown = ({
	value: controlledValue,
	defaultValue,
	options,
	onChange,
	className,
	optionsClassName,
}: SquareDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const listboxId = useRef(`listbox-${Math.random().toString(36).slice(2)}`).current;

	const currentValue = controlledValue ?? internalValue;
	const currentLabel = options.find((opt) => opt.value === currentValue)?.label || options[0]?.label;

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	const handleSelect = useCallback(
		(option: SquareDropdownOption) => {
			if (!controlledValue) {
				setInternalValue(option.value);
			}
			onChange?.(option.value);
			setIsOpen(false);
		},
		[controlledValue, onChange],
	);

	return (
		<div
			ref={dropdownRef}
			className={cn("relative inline-block font-suisse", className)}
		>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"inline-flex items-center justify-between",
					"h-[32px] px-3",
					"border-2 border-hbc-black",
					"bg-hbc-white",
					"text-hbc-black text-[16px] font-bold whitespace-nowrap",
					"focus:outline-none cursor-pointer",
				)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				id={`${listboxId}-trigger`}
			>
				<span>{currentLabel}</span>
				<svg
					className={cn("ml-3 h-4 shrink-0")}
					width={10}
					height={10}
					viewBox="0 0 8 7"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M4 6.75L0.0216505 0L7.97835 0L4 6.75Z"
						fill="currentColor"
					/>
				</svg>
			</button>

			{isOpen && (
				<ul
					id={listboxId}
					role="listbox"
					aria-labelledby={`${listboxId}-trigger`}
					tabIndex={-1}
					className={cn(
						"absolute top-0 right-0",
						"w-full min-w-[98px]",
						"border-l-[3px] border-t-[4px] border-b-[2px] border-hbc-black",
						"bg-hbc-white",
						"z-50",
						"p-0 m-0 list-none",
						optionsClassName,
					)}
				>
					{options.map((option) => (
						<li
							key={option.value}
							role="option"
							aria-selected={currentValue === option.value}
							onClick={() => handleSelect(option)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleSelect(option);
								}
							}}
							tabIndex={0}
							className={cn(
								"w-full text-left",
								"px-[13px] py-[6px]",
								"text-[16px] font-bold text-hbc-black",
								"hover:bg-hbc-black hover:text-hbc-white",
								"transition-colors duration-200",
								"cursor-pointer",
							)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
