"use client";
import { cn } from "@/common/utils";
import { useState } from "react";
interface SupportAccordianProps {
	title: string;
	content: string;
}
const SupportAccordian = ({ title, content }: SupportAccordianProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="w-full">
			<div
				className={cn(
					"flex gap-3 justify-between items-center py-4 pr-2 cursor-pointer select-none",
					isOpen || "border-b-2 border-black",
				)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="text-black font-suit text-[18px] font-semibold leading-[28.8px] tracking-[0.18px]">{title}</div>
				<div>
					<svg
						className={cn("duration-300 select-none", isOpen && "rotate-180")}
						width={12}
						height={12}
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
				</div>
			</div>
			<div
				className={cn(
					"overflow-hidden transition-all duration-300",
					isOpen ? "max-h-[2000px] opacity-100 pb-3 border-b-2 border-black" : "max-h-0 opacity-0",
				)}
			>
				<div className="text-black font-suit text-base leading-[25.6px] tracking-[0.16px] whitespace-pre-wrap break-words">
					{content}
				</div>
			</div>
		</div>
	);
};

export default SupportAccordian;
