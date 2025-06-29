"use client";

import { ArrowDown } from "@/assets/svgs";
import { useState, forwardRef } from "react";

interface MobileSettingsSelectProps {
	label: string;
	options: { value: string; label: string }[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export const MobileSettingsSelect = forwardRef<HTMLDivElement, MobileSettingsSelectProps>(
	({ label, options, value, onChange, placeholder = "선택하세요", className = "" }, ref) => {
		const [isOpen, setIsOpen] = useState(false);

		const handleSelect = (option: { value: string; label: string }) => {
			onChange?.(option.value);
			setIsOpen(false);
		};

		return (
			<div
				ref={ref}
				className={`flex flex-col gap-1 ${className}`}
			>
				<span className="font-semibold text-12px leading-160%">{label}</span>
				<div className="relative">
					<div
						className="w-full px-2 h-22px bg-[#dfdfdf] focus:outline-none text-12px leading-100% font-semibold min-w-0 rounded-20px flex justify-between items-center cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}
					>
						<div className="text-black">{value || placeholder}</div>
						<div className="w-15px h-15px rounded-full bg-black flex items-center justify-center">
							<ArrowDown />
						</div>
					</div>
					{isOpen && (
						<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-8px shadow-lg z-10 max-h-150px overflow-y-auto">
							{options.map((option, index) => (
								<div
									key={index}
									className="px-3 py-2 text-12px font-semibold cursor-pointer hover:bg-gray-100 first:rounded-t-8px last:rounded-b-8px"
									onClick={() => handleSelect(option)}
								>
									{option.label}
								</div>
							))}
						</div>
					)}
				</div>
				{isOpen && (
					<div
						className="fixed inset-0 z-5"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</div>
		);
	},
);

MobileSettingsSelect.displayName = "MobileSettingsSelect";
