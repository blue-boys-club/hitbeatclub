"use client";

import { useState } from "react";
import { Polygon } from "@/assets/svgs";

type SelectOption = "제목" | "날짜" | "조회수";

interface MobileNoticeSelectProps {
	value: SelectOption;
	onChange: (value: SelectOption) => void;
}

export const MobileNoticeSelect = ({ value, onChange }: MobileNoticeSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const options: SelectOption[] = ["제목", "날짜", "조회수"];

	const handleOptionClick = (option: SelectOption) => {
		onChange(option);
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<button
				className="w-56px h-19px px-6px flex justify-between items-center font-semibold text-12px leading-100% bg-black text-white"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{value}</span>
				<div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
					<Polygon />
				</div>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 mt-1 py-1 w-56px bg-white border border-black z-10 flex flex-col gap-1">
					{options.map((option) => (
						<button
							key={option}
							className={`w-full px-6px py-2px text-12px leading-100% font-semibold text-left hover:bg-gray-100 ${
								option === value ? "bg-gray-200" : ""
							}`}
							onClick={() => handleOptionClick(option)}
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
