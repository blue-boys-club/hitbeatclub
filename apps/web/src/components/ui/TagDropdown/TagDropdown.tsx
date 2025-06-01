"use client";

import { cn } from "@/common/utils";
import { ChevronDown } from "@/assets/svgs/ChevronDown";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
	memo,
	Children,
	isValidElement,
	ComponentProps,
} from "react";
import { BodyMedium } from "../Body";
import * as Slot from "@radix-ui/react-slot";
import Link from "next/link";

export interface TagDropdownOption {
	label: string;
	value: string;
	href?: string;
	className?: string;
}

export interface TagDropdownProps {
	children?: ReactNode;
	trigger?: ReactNode;
	options: TagDropdownOption[];
	className?: string;
	wrapperClassName?: string;
	optionsClassName?: string;
	optionsPosition?: string;
	onSelect?: (value: string) => void;
	onOpenChange?: (isOpen: boolean) => void;
	textComponent?: React.ComponentType<{ children: ReactNode }>;
	showChevron?: boolean;
	defaultOpen?: boolean;
}

export const TagDropdown = memo(function TagDropdown({
	children,
	trigger = "Category",
	options,
	className,
	optionsClassName,
	optionsPosition = "left",
	onSelect,
	onOpenChange,
	textComponent: TextComponent = BodyMedium,
	showChevron = true,
	defaultOpen = false,
	wrapperClassName,
}: TagDropdownProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				onOpenChange?.(false);
			}
		},
		[onOpenChange],
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	const handleOptionClick = useCallback(
		(value: string) => {
			onSelect?.(value);
			setIsOpen(false);
			onOpenChange?.(false);
		},
		[onSelect, onOpenChange],
	);

	const toggleDropdown = useCallback(() => {
		const newIsOpen = !isOpen;
		setIsOpen(newIsOpen);
		onOpenChange?.(newIsOpen);
	}, [isOpen, onOpenChange]);

	const triggerContent = useMemo(() => {
		const buttonProps = {
			ref: triggerRef,
			type: "button" as const,
			onClick: toggleDropdown,
			className: cn("inline-flex items-center gap-0.5 cursor-pointer", className),
			"aria-expanded": isOpen,
			"aria-haspopup": "true" as const,
			"data-testid": "tag-dropdown-trigger-slot",
		};

		if (children && Children.count(children) === 1 && isValidElement(children)) {
			return (
				// <button {...buttonProps}>
				<span {...buttonProps}>
					<Slot.Root>{children}</Slot.Root>
					{showChevron && <ChevronDown />}
				</span>
			);
		}

		return (
			<span {...buttonProps}>
				{typeof trigger === "string" ? <TextComponent>{trigger}</TextComponent> : trigger}
				{showChevron && <ChevronDown />}
			</span>
		);
	}, [trigger, children, TextComponent, toggleDropdown, showChevron, className, isOpen]);

	const dropdownMenuClasses = useMemo(
		() =>
			cn(
				"absolute top-[38px]",
				optionsPosition,
				"min-w-full py-2 px-[10px]",
				"outline-2 outline-black -outline-offset-1 rounded-[5px]",
				"flex flex-col gap-[10px] justify-center",
				"bg-white",
				"sm:px-2",
				"z-50",
				optionsClassName,
			),
		[optionsClassName, optionsPosition],
	);

	const triggerClasses = useMemo(
		() =>
			cn(
				"inline-flex items-center gap-0.5",
				"px-[9px] py-[2px] pr-[3px]",
				"outline-2 outline-black -outline-offset-1 rounded-[40px]",
				"bg-white cursor-pointer whitespace-nowrap",
				"sm:px-[6px]",
				className,
			),
		[className],
	);

	const renderedOptions = useMemo(() => {
		return options.map((option) => {
			const Comp = option.href ? Link : "button";

			const props = {
				onClick: () => handleOptionClick(option.value),
				...(option.href ? { href: option.href! } : {}),
			} as unknown as {
				href: string;
				onClick: () => void;
			};

			return (
				<Comp
					key={option.value}
					className={cn(
						"px-[10px] py-[6px]",
						"rounded-[40px]",
						"font-suit",
						"cursor-pointer",
						"text-left whitespace-nowrap",
						"transition-colors duration-200",
						"sm:px-2 sm:py-[3px]",
						"hover:bg-black hover:text-white",
						option.className,
					)}
					role="menuitem"
					data-testid={`tag-dropdown-option-${option.value}`}
					{...props}
				>
					<TextComponent>{option.label}</TextComponent>
				</Comp>
			);
		});
	}, [options]);

	return (
		<div
			ref={dropdownRef}
			className={cn("relative inline-block font-inter", wrapperClassName)}
			data-testid="tag-dropdown"
		>
			{children ? (
				triggerContent
			) : (
				<button
					ref={triggerRef}
					type="button"
					onClick={toggleDropdown}
					className={triggerClasses}
					aria-expanded={isOpen}
					aria-haspopup="true"
					data-testid="tag-dropdown-trigger"
				>
					{triggerContent}
				</button>
			)}

			{isOpen && (
				<div
					className={dropdownMenuClasses}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="dropdown-button"
					data-testid="tag-dropdown-menu"
				>
					{renderedOptions}
				</div>
			)}
		</div>
	);
});

TagDropdown.displayName = "TagDropdown";
