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
} from "react";
import { BodyMedium } from "../Body";
import * as Slot from "@radix-ui/react-slot";

export interface TagDropdownOption {
	label: string;
	value: string;
	className?: string;
}

export interface TagDropdownProps {
	children?: ReactNode;
	trigger?: ReactNode;
	options: TagDropdownOption[];
	className?: string;
	optionsClassName?: string;
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
	onSelect,
	onOpenChange,
	textComponent: TextComponent = BodyMedium,
	showChevron = true,
	defaultOpen = false,
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
				<button {...buttonProps}>
					<Slot.Root>{children}</Slot.Root>
					{showChevron && <ChevronDown />}
				</button>
			);
		}

		return (
			<button {...buttonProps}>
				{typeof trigger === "string" ? <TextComponent>{trigger}</TextComponent> : trigger}
				{showChevron && <ChevronDown />}
			</button>
		);
	}, [trigger, children, TextComponent, toggleDropdown, showChevron, className, isOpen]);

	const dropdownMenuClasses = useMemo(
		() =>
			cn(
				"absolute top-[38px] left-0",
				"min-w-full py-2 px-[10px]",
				"border-2 border-black rounded-[5px]",
				"flex flex-col gap-[10px] justify-center",
				"bg-white",
				"sm:px-2",
				"z-50",
				optionsClassName,
			),
		[optionsClassName],
	);

	const triggerClasses = useMemo(
		() =>
			cn(
				"inline-flex items-center gap-0.5",
				"px-[9px] py-[2px] pr-[3px]",
				"border-2 border-black rounded-[40px]",
				"bg-white cursor-pointer whitespace-nowrap",
				"sm:px-[6px]",
				className,
			),
		[className],
	);

	return (
		<div
			ref={dropdownRef}
			className="relative inline-block font-inter"
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
					{options.map((option) => (
						<button
							key={option.value}
							onClick={() => handleOptionClick(option.value)}
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
						>
							<TextComponent>{option.label}</TextComponent>
						</button>
					))}
				</div>
			)}
		</div>
	);
});

TagDropdown.displayName = "TagDropdown";
