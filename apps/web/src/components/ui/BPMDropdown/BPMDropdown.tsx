"use client";

import { cn } from "@/common/utils";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
	className?: string;
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

interface DropdownPosition {
	top: number;
	left: number;
	width: number;
}

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
	className,
}: BPMDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
	const [isClient, setIsClient] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 클라이언트 사이드 렌더링 확인
	useEffect(() => {
		setIsClient(true);
	}, []);

	// 포털 컨테이너 찾기 - Radix Dialog 내부인지 확인
	const getPortalContainer = useCallback((): HTMLElement => {
		if (typeof window === "undefined") return document.body;

		// containerRef부터 시작해서 상위로 올라가며 Dialog 컨테이너 찾기
		let current: HTMLElement | null = containerRef.current;
		while (current && current !== document.body) {
			// Radix Dialog Content 찾기
			if (
				current.getAttribute("role") === "dialog" ||
				current.hasAttribute("data-radix-dialog-content") ||
				current.querySelector('[role="dialog"]') ||
				// PopupContent의 클래스나 구조도 확인
				(current.classList.contains("fixed") && current.style.zIndex)
			) {
				return current;
			}
			current = current.parentElement;
		}

		return document.body;
	}, []);

	// 드롭다운 위치 계산
	const updateDropdownPosition = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const portalContainer = getPortalContainer();

		if (portalContainer === document.body) {
			// document.body에 렌더링되는 경우 (기존 로직)
			setDropdownPosition({
				top: containerRect.bottom + window.scrollY,
				left: containerRect.left + window.scrollX,
				width: containerRect.width,
			});
		} else {
			// Dialog/Popup 내부에 렌더링되는 경우
			const portalRect = portalContainer.getBoundingClientRect();

			setDropdownPosition({
				// Portal 컨테이너를 기준으로 상대적 위치 계산
				top: containerRect.bottom - portalRect.top,
				left: containerRect.left - portalRect.left,
				width: containerRect.width,
			});
		}
	}, [getPortalContainer]);

	// 스크롤 및 리사이즈 이벤트 처리
	useEffect(() => {
		if (isOpen) {
			updateDropdownPosition();

			const handleScroll = () => updateDropdownPosition();
			const handleResize = () => updateDropdownPosition();

			window.addEventListener("scroll", handleScroll, true);
			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("scroll", handleScroll, true);
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [isOpen, updateDropdownPosition]);

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

	const handleExactBPMTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// radio 버튼의 change 이벤트에서는 stopPropagation을 하지 않음
			onChangeBPMType("exact");
		},
		[onChangeBPMType],
	);

	const handleRangeBPMTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// radio 버튼의 change 이벤트에서는 stopPropagation을 하지 않음
			onChangeBPMType("range");
		},
		[onChangeBPMType],
	);

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

	const handleExactBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// change 이벤트에서는 stopPropagation을 하지 않음 (상태 업데이트를 방해할 수 있음)
			const value = e.target.value;

			// 숫자만 허용 (실시간 필터링)
			const numericValue = value.replace(/[^0-9]/g, "");

			// 빈 값인 경우에만 undefined로 설정
			if (numericValue === "") {
				onChangeExactBPM(undefined as any);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
			if (parsedValue !== undefined) {
				onChangeExactBPM(parsedValue);
			}
		},
		[onChangeExactBPM, parseNumericInput],
	);

	const handleMinBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// change 이벤트에서는 stopPropagation을 하지 않음 (상태 업데이트를 방해할 수 있음)
			const value = e.target.value;

			// 숫자만 허용 (실시간 필터링)
			const numericValue = value.replace(/[^0-9]/g, "");

			// 빈 값인 경우에만 undefined로 설정
			if (numericValue === "") {
				onChangeBPMRange("min", undefined as any);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
			if (parsedValue !== undefined) {
				onChangeBPMRange("min", parsedValue);
			}
		},
		[onChangeBPMRange, parseNumericInput],
	);

	const handleMaxBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// change 이벤트에서는 stopPropagation을 하지 않음 (상태 업데이트를 방해할 수 있음)
			const value = e.target.value;

			// 숫자만 허용 (실시간 필터링)
			const numericValue = value.replace(/[^0-9]/g, "");

			// 빈 값인 경우에만 undefined로 설정
			if (numericValue === "") {
				onChangeBPMRange("max", undefined as any);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
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
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const isInputElement = target.tagName === "INPUT";

			// 드롭다운이 열려있을 때만 처리
			if (isOpen) {
				// 트리거 컨테이너나 드롭다운 내부 클릭은 무시
				if (
					(containerRef.current && containerRef.current.contains(target)) ||
					(dropdownRef.current && dropdownRef.current.contains(target))
				) {
					// input 요소 클릭이면 포커스 처리를 위해 이벤트 완료 후 포커스 설정
					if (isInputElement) {
						setTimeout(() => {
							target.focus();
						}, 0);
					}
					return;
				}

				// 외부 클릭이면 드롭다운 닫기
				setIsOpen(false);
			}
		};

		// mousedown 이벤트로 변경하여 더 빠른 처리
		document.addEventListener("mousedown", handleClickOutside, false);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside, false);
		};
	}, [isOpen]);

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

	// 드롭다운 클릭 핸들러 - input 요소가 아닌 경우만 전파 방지
	const handleDropdownClick = useCallback((e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		console.log("🔍 Dropdown clicked:", {
			tagName: target.tagName,
			className: target.className,
			target: target,
			currentTarget: e.currentTarget,
		});

		// input 요소가 아닌 경우에만 전파 방지
		if (target.tagName !== "INPUT") {
			console.log("🚫 Stopping propagation for non-input element");
			e.stopPropagation();
		} else {
			console.log("✅ Allowing input element to handle click");
		}
	}, []);

	// 드롭다운 컨텐츠
	const dropdownContent = (
		<div
			ref={dropdownRef}
			id="bpm-select-dropdown"
			role="dialog"
			aria-label="BPM 선택 메뉴"
			className="bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] pointer-events-auto"
			style={{
				position: "absolute",
				top: dropdownPosition.top,
				left: dropdownPosition.left,
				width: dropdownPosition.width,
				minWidth: "200px",
			}}
			// onClick={handleDropdownClick} // 임시로 제거해서 테스트
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
							className="w-4 h-4 cursor-pointer"
						/>
						<label
							htmlFor="exact"
							className="text-sm font-medium cursor-pointer"
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
								tabIndex={0}
								onClick={(e) => {
									// 이벤트 전파 중단
									e.stopPropagation();

									// 지연 후 포커스 (React 렌더링 후)
									setTimeout(() => {
										(e.target as HTMLInputElement).focus();
									}, 0);
								}}
								onMouseDown={(e) => {
									// mousedown에서도 전파 중단
									e.stopPropagation();
								}}
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
							className="w-4 h-4 cursor-pointer"
						/>
						<label
							htmlFor="range"
							className="text-sm font-medium cursor-pointer"
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
									tabIndex={0}
									onClick={(e) => {
										// 이벤트 전파 중단
										e.stopPropagation();

										// 지연 후 포커스 (React 렌더링 후)
										setTimeout(() => {
											(e.target as HTMLInputElement).focus();
										}, 0);
									}}
									onMouseDown={(e) => {
										// mousedown에서도 전파 중단
										e.stopPropagation();
									}}
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
									tabIndex={0}
									onClick={(e) => {
										// 이벤트 전파 중단
										e.stopPropagation();

										// 지연 후 포커스 (React 렌더링 후)
										setTimeout(() => {
											(e.target as HTMLInputElement).focus();
										}, 0);
									}}
									onMouseDown={(e) => {
										// mousedown에서도 전파 중단
										e.stopPropagation();
									}}
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
					className="text-sm font-medium text-gray-500 underline cursor-pointer duration-[0.2s] ease-[ease] transition-[color] hover:text-gray-700"
					onClick={handleClearClick}
					aria-label="선택 초기화"
				>
					Clear
				</button>
				<button
					type="button"
					className="p-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer border-[none] duration-[0.2s] ease-[ease] transition-[background-color] hover:bg-blue-700"
					onClick={handleCloseClick}
					aria-label="선택 완료"
				>
					Close
				</button>
			</footer>
		</div>
	);

	return (
		<>
			<div
				className={cn("relative", className)}
				ref={containerRef}
			>
				{renderTrigger()}
			</div>

			{/* Portal로 드롭다운 렌더링 - 적절한 컨테이너에 */}
			{isClient && isOpen && typeof window !== "undefined" && createPortal(dropdownContent, getPortalContainer())}
		</>
	);
};
