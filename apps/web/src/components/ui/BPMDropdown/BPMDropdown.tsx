"use client";

import { cn } from "@/common/utils";
import { useRef, useState, useMemo, useEffect } from "react";

export interface BPMDropdownProps {
	bpmValue: number | undefined;
	bpmRangeValue: { min?: number | undefined; max?: number | undefined } | undefined;
	onChangeExactBPM: (bpm: number) => void;
	onChangeBPMRange: (type: "min" | "max", bpm: number) => void;
	onClear: () => void;
}

export const BPMDropdown = ({
	bpmValue,
	bpmRangeValue,
	onChangeExactBPM,
	onChangeBPMRange,
	onClear,
}: BPMDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [bpmType, setBpmType] = useState<"exact" | "range">("exact");

	const selectButtonRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const currentValue = useMemo(() => {
		if (bpmType === "exact") {
			return bpmValue ?? undefined;
		}
		if (bpmType === "range" && bpmRangeValue?.min && bpmRangeValue?.max) {
			return `${bpmRangeValue?.min ?? ""} - ${bpmRangeValue?.max ?? ""}`;
		}
		return undefined;
	}, [bpmValue, bpmRangeValue, bpmType]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className="relative w-full"
			ref={dropdownRef}
		>
			<button
				ref={selectButtonRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"w-full h-[35px] px-4 pr-10 border border-black rounded-[5px] bg-white text-[#4D4D4F] font-bold tracking-[0.01em] focus:outline-none cursor-pointer relative",
				)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label="BPM 선택"
				aria-controls="bpm-select-dropdown"
			>
				<span className={cn("block truncate text-left text-sm", !currentValue && "text-gray-400")}>
					{!isOpen && currentValue ? currentValue : "BPM을 선택해주세요"}
				</span>
				<svg
					className={cn(
						"absolute right-3 top-1/2 -translate-y-1/2",
						"w-[13px] h-[8.75px]",
						"transition-transform",
						isOpen && "rotate-180",
					)}
					viewBox="0 0 14 9"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M6.35 8.875L-0.3 2.225L1.825 0.125L6.35 4.65L10.875 0.125L13 2.225L6.35 8.875Z"
						fill="currentColor"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					id="bpm-select-dropdown"
					role="dialog"
					aria-label="BPM 선택 메뉴"
					className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
				>
					<div className="p-4">
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2 h-10">
								<input
									type="radio"
									id="exact"
									name="bpmType"
									checked={bpmType === "exact"}
									onChange={() => setBpmType("exact")}
									className="w-4 h-4"
								/>
								<label
									htmlFor="exact"
									className="text-sm font-medium"
								>
									Exact
								</label>
								{bpmType === "exact" && (
									<input
										type="text"
										inputMode="numeric"
										value={bpmValue ?? ""}
										onChange={(e) => onChangeExactBPM(Number(e.target.value))}
										placeholder="BPM"
										className="text-sm w-20 h-8 px-2 border border-gray-200 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									/>
								)}
							</div>

							<div className="flex items-center gap-2 h-10">
								<input
									type="radio"
									id="range"
									name="bpmType"
									checked={bpmType === "range"}
									onChange={() => setBpmType("range")}
									className="w-4 h-4"
								/>
								<label
									htmlFor="range"
									className="text-sm font-medium"
								>
									Range
								</label>
								{bpmType === "range" && (
									<div className="flex items-center gap-2">
										<input
											type="text"
											inputMode="numeric"
											value={bpmRangeValue?.min ? bpmRangeValue.min : ""}
											onChange={(e) => onChangeBPMRange("min", Number(e.target.value))}
											placeholder="Min"
											className="text-sm w-12 h-8 px-2 border border-gray-200 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
										<span>-</span>
										<input
											type="text"
											inputMode="numeric"
											value={bpmRangeValue?.max ? bpmRangeValue.max : ""}
											onChange={(e) => onChangeBPMRange("max", Number(e.target.value))}
											placeholder="Max"
											className="text-sm w-12 h-8 px-2 border border-gray-200 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					<footer className="flex justify-between items-center px-4 py-3 border-t border-solid border-t-gray-200">
						<button
							className="text-sm font-medium text-gray-500 underline cursor-pointer duration-[0.2s] ease-[ease] transition-[color]"
							onClick={onClear}
							aria-label="선택 초기화"
						>
							Clear
						</button>
						<button
							className="p-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer border-[none] duration-[0.2s] ease-[ease] transition-[background-color]"
							onClick={() => setIsOpen(false)}
							aria-label="선택 완료"
						>
							Close
						</button>
					</footer>
				</div>
			)}
		</div>
	);
};
