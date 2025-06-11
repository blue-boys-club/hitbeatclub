"use client";

import { cn } from "@/common/utils";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Slot } from "@radix-ui/react-slot";

// 타입 정의를 직접 여기에 추가 (다른 파일에서 가져오던 타입)
export type BPM = number | undefined;
export type BPMRange = { min?: number | undefined; max?: number | undefined } | undefined;

// render prop을 위한 타입 정의
export interface BPMDropdownRenderProps {
	currentValue: string | number | undefined;
	isOpen: boolean;
	bpmType: "exact" | "range";
	bpmValue: BPM;
	bpmRangeValue: BPMRange;
}

export interface BPMDropdownProps {
	bpmType: "exact" | "range";
	bpmValue: BPM | undefined;
	bpmRangeValue: BPMRange | undefined;
	onChangeBPMType: (type: "exact" | "range") => void;
	onChangeExactBPM: (bpm: number) => void;
	onChangeBPMRange: (type: "min" | "max", bpm: number) => void;
	onClear: () => void;
	children?: React.ReactNode | ((props: BPMDropdownRenderProps) => React.ReactNode);
	asChild?: boolean;
}

// 기본 트리거 컴포넌트
const BPMTrigger = ({
	isOpen,
	currentValue,
	onClick,
	...props
}: {
	isOpen: boolean;
	currentValue: string | number | undefined;
	onClick: () => void;
	[key: string]: any;
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-full h-[35px] px-4 pr-10 border border-black rounded-[5px] bg-white text-[#4D4D4F] font-bold tracking-[0.01em] focus:outline-none cursor-pointer relative",
			)}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-label="BPM 선택"
			aria-controls="bpm-select-dropdown"
			{...props}
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
	);
};

export const BPMDropdown = ({
	bpmType,
	bpmValue,
	bpmRangeValue,
	onChangeBPMType,
	onChangeExactBPM,
	onChangeBPMRange,
	onClear,
	children,
	asChild = false,
}: BPMDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

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

	// useCallback으로 최적화된 핸들러들
	const handleToggleDropdown = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const handleExactBPMTypeChange = useCallback(() => {
		onChangeBPMType("exact");
	}, [onChangeBPMType]);

	const handleRangeBPMTypeChange = useCallback(() => {
		onChangeBPMType("range");
	}, [onChangeBPMType]);

	// 숫자 입력값 검증 및 변환 헬퍼 함수
	const parseNumericInput = useCallback((value: string): number | undefined => {
		// 빈 문자열이거나 공백만 있는 경우
		if (!value || value.trim() === "") {
			return undefined;
		}

		const numValue = Number(value);
		// NaN이거나 유한하지 않은 수인 경우
		if (isNaN(numValue) || !isFinite(numValue)) {
			return undefined;
		}

		// 음수는 허용하지 않음 (BPM은 양수)
		if (numValue < 0) {
			return undefined;
		}

		return numValue;
	}, []);

	// 숫자만 입력받도록 필터링하는 핸들러
	const handleNumericInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		// 숫자가 아닌 문자 제거 (소수점은 허용하지 않음)
		target.value = target.value.replace(/[^0-9]/g, "");
	}, []);

	const handleExactBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const parsedValue = parseNumericInput(e.target.value);
			if (parsedValue !== undefined) {
				onChangeExactBPM(parsedValue);
			} else if (e.target.value === "") {
				// 빈 문자열인 경우 명시적으로 0으로 설정하거나 아무것도 하지 않음
				// 여기서는 빈 값일 때 아무것도 하지 않도록 함
			}
		},
		[onChangeExactBPM, parseNumericInput],
	);

	const handleMinBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const parsedValue = parseNumericInput(e.target.value);
			if (parsedValue !== undefined) {
				onChangeBPMRange("min", parsedValue);
			}
		},
		[onChangeBPMRange, parseNumericInput],
	);

	const handleMaxBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const parsedValue = parseNumericInput(e.target.value);
			if (parsedValue !== undefined) {
				onChangeBPMRange("max", parsedValue);
			}
		},
		[onChangeBPMRange, parseNumericInput],
	);

	const handleClearClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onClear();
		},
		[onClear],
	);

	const handleCloseClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(false);
	}, []);

	// 외부 클릭 감지
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

	// render props를 위한 데이터
	const renderProps: BPMDropdownRenderProps = {
		currentValue,
		isOpen,
		bpmType,
		bpmValue,
		bpmRangeValue,
	};

	// children이 함수인지 확인
	const isChildrenFunction = typeof children === "function";

	// Trigger 컴포넌트 렌더링
	const renderTrigger = () => {
		if (isChildrenFunction) {
			// children이 함수인 경우 render props 패턴
			const childrenAsFunction = children as (props: BPMDropdownRenderProps) => React.ReactNode;
			const triggerElement = childrenAsFunction(renderProps);

			if (asChild) {
				// asChild인 경우 Slot으로 래핑하고 onClick 추가
				return <Slot onClick={handleToggleDropdown}>{triggerElement}</Slot>;
			} else {
				// asChild가 아닌 경우 div로 래핑하고 onClick 추가
				return (
					<div
						onClick={handleToggleDropdown}
						className="cursor-pointer"
					>
						{triggerElement}
					</div>
				);
			}
		} else if (asChild && children) {
			// asChild이고 children이 일반 ReactNode인 경우
			return <Slot onClick={handleToggleDropdown}>{children}</Slot>;
		} else {
			// 기본 트리거 사용
			return (
				<BPMTrigger
					isOpen={isOpen}
					currentValue={currentValue}
					onClick={handleToggleDropdown}
				/>
			);
		}
	};

	return (
		<div
			className="relative w-full"
			ref={dropdownRef}
		>
			{renderTrigger()}

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
									onChange={handleExactBPMTypeChange}
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
										pattern="[0-9]*"
										value={bpmValue ?? ""}
										onChange={handleExactBPMChange}
										onInput={handleNumericInput}
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
									onChange={handleRangeBPMTypeChange}
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
											pattern="[0-9]*"
											value={bpmRangeValue?.min ? bpmRangeValue.min : ""}
											onChange={handleMinBPMChange}
											onInput={handleNumericInput}
											placeholder="Min"
											className="text-sm w-12 h-8 px-2 border border-gray-200 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
										<span>-</span>
										<input
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											value={bpmRangeValue?.max ? bpmRangeValue.max : ""}
											onChange={handleMaxBPMChange}
											onInput={handleNumericInput}
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
							type="button"
							className="text-sm font-medium text-gray-500 underline cursor-pointer duration-[0.2s] ease-[ease] transition-[color]"
							onClick={handleClearClick}
							aria-label="선택 초기화"
						>
							Clear
						</button>
						<button
							type="button"
							className="p-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer border-[none] duration-[0.2s] ease-[ease] transition-[background-color]"
							onClick={handleCloseClick}
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
