"use client";

import { cn } from "@/common/utils";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";

// 간소화된 Props 인터페이스
export interface BPMDropdownProps {
	minBpm?: number;
	maxBpm?: number;
	onChangeMinBpm: (bpm: number) => void;
	onChangeMaxBpm: (bpm: number) => void;
	onClear: () => void;
	onSubmit?: (minBpm: number | undefined, maxBpm: number | undefined) => void; // 드롭다운 닫힐 때 호출
	children?: React.ReactNode | ((props: { currentValue: string | undefined; isOpen: boolean }) => React.ReactNode);
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
	currentValue: string | undefined;
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
	minBpm,
	maxBpm,
	onChangeMinBpm,
	onChangeMaxBpm,
	onClear,
	onSubmit,
	children,
	asChild = false,
	className,
}: BPMDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
	const [isClient, setIsClient] = useState(false);

	// 내부 임시 상태 (드롭다운 내에서만 사용)
	const [tempMinBpm, setTempMinBpm] = useState<number | undefined>(minBpm);
	const [tempMaxBpm, setTempMaxBpm] = useState<number | undefined>(maxBpm);

	// 내부 모드 상태 관리 (사용자가 명시적으로 선택한 모드)
	const [internalMode, setInternalMode] = useState<"exact" | "range">(() => {
		// 초기값: minBpm === maxBpm이면 exact, 아니면 range
		return minBpm !== undefined && maxBpm !== undefined && minBpm === maxBpm ? "exact" : "range";
	});

	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 클라이언트 사이드 렌더링 확인
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Props 변경 시 임시 상태 동기화
	useEffect(() => {
		setTempMinBpm(minBpm);
		setTempMaxBpm(maxBpm);
	}, [minBpm, maxBpm]);

	// Props 변경 시 내부 모드 동기화 (외부에서 값이 변경되었을 때만)
	useEffect(() => {
		if (minBpm !== undefined && maxBpm !== undefined && minBpm === maxBpm && internalMode === "range") {
			// 외부에서 같은 값으로 설정되었지만 내부 모드가 range면 그대로 유지
			return;
		}

		if (minBpm !== undefined && maxBpm !== undefined) {
			const shouldBeExact = minBpm === maxBpm;
			if (shouldBeExact && internalMode === "range") {
				// 값이 같아졌지만 사용자가 range를 선택했다면 그대로 유지
				return;
			}
			if (!shouldBeExact && internalMode === "exact") {
				// 값이 달라졌는데 exact 모드면 range로 변경
				setInternalMode("range");
			}
		}
	}, [minBpm, maxBpm]);

	// 내부적으로 exact/range 모드 결정 - 내부 상태 우선 사용
	const isExactMode = internalMode === "exact";

	// 현재 표시값 계산 (외부 값 기준)
	const currentValue = useMemo(() => {
		if (minBpm === undefined && maxBpm === undefined) {
			return undefined;
		}

		if (isExactMode && minBpm !== undefined) {
			return minBpm.toString();
		}

		if (minBpm !== undefined && maxBpm !== undefined) {
			return `${minBpm} - ${maxBpm}`;
		}

		if (minBpm !== undefined) {
			return `${minBpm} - `;
		}

		if (maxBpm !== undefined) {
			return ` - ${maxBpm}`;
		}

		return undefined;
	}, [minBpm, maxBpm, isExactMode]);

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

	// useCallback으로 최적화된 핸들러들
	const handleToggleDropdown = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	// BPM 모드 변경 핸들러 - 임시 상태만 변경
	const handleModeChange = useCallback(
		(mode: "exact" | "range") => {
			// 내부 모드 상태 먼저 업데이트
			setInternalMode(mode);

			if (mode === "exact") {
				// range에서 exact로 변경 시 - min값 우선 사용
				const exactValue = tempMinBpm || tempMaxBpm || 120;
				setTempMinBpm(exactValue);
				setTempMaxBpm(exactValue);
			} else {
				// exact에서 range로 변경 시 - 같은 값으로 시작
				if (internalMode === "exact" && tempMinBpm !== undefined) {
					// 현재 exact 값을 min, max 둘 다에 설정
					setTempMinBpm(tempMinBpm);
					setTempMaxBpm(tempMinBpm);
				}
				// 둘 다 없으면 기본값만 설정
				else if (!tempMinBpm && !tempMaxBpm) {
					setTempMinBpm(100);
					setTempMaxBpm(120);
				}
				// 이미 range 값이 있으면 그대로 유지
			}
		},
		[tempMinBpm, tempMaxBpm, internalMode],
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

	// Exact 모드 BPM 변경 - 임시 상태만 변경
	const handleExactBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const numericValue = value.replace(/[^0-9]/g, "");

			if (numericValue === "") {
				setTempMinBpm(undefined);
				setTempMaxBpm(undefined);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
			if (parsedValue !== undefined) {
				setTempMinBpm(parsedValue);
				setTempMaxBpm(parsedValue);
			}
		},
		[parseNumericInput],
	);

	// Min BPM 변경 - 임시 상태만 변경
	const handleMinBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const numericValue = value.replace(/[^0-9]/g, "");

			if (numericValue === "") {
				setTempMinBpm(undefined);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
			if (parsedValue !== undefined) {
				setTempMinBpm(parsedValue);
			}
		},
		[parseNumericInput],
	);

	// Max BPM 변경 - 임시 상태만 변경
	const handleMaxBPMChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const numericValue = value.replace(/[^0-9]/g, "");

			if (numericValue === "") {
				setTempMaxBpm(undefined);
				return;
			}

			const parsedValue = parseNumericInput(numericValue);
			if (parsedValue !== undefined) {
				setTempMaxBpm(parsedValue);
			}
		},
		[parseNumericInput],
	);

	const handleClearClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onClear();
		},
		[onClear],
	);

	// Close 클릭 시 최종 값 제출 및 min/max 순서 교정
	const handleCloseClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			let finalMinBpm = tempMinBpm;
			let finalMaxBpm = tempMaxBpm;

			// min > max인 경우 순서 바꾸기
			if (tempMinBpm !== undefined && tempMaxBpm !== undefined && tempMinBpm > tempMaxBpm) {
				finalMinBpm = tempMaxBpm;
				finalMaxBpm = tempMinBpm;
			}

			// 최종 값 제출
			if (onSubmit) {
				onSubmit(finalMinBpm, finalMaxBpm);
			} else {
				// 기존 방식 호환성 유지
				if (finalMinBpm !== undefined) onChangeMinBpm(finalMinBpm);
				if (finalMaxBpm !== undefined) onChangeMaxBpm(finalMaxBpm);
			}

			setIsOpen(false);
		},
		[tempMinBpm, tempMaxBpm, onSubmit, onChangeMinBpm, onChangeMaxBpm],
	);

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

				// 외부 클릭이면 드롭다운 닫기 (순서 교정 포함)
				let finalMinBpm = tempMinBpm;
				let finalMaxBpm = tempMaxBpm;

				if (tempMinBpm !== undefined && tempMaxBpm !== undefined && tempMinBpm > tempMaxBpm) {
					finalMinBpm = tempMaxBpm;
					finalMaxBpm = tempMinBpm;
				}

				// 최종 값 제출
				if (onSubmit) {
					onSubmit(finalMinBpm, finalMaxBpm);
				} else {
					// 기존 방식 호환성 유지
					if (finalMinBpm !== undefined) onChangeMinBpm(finalMinBpm);
					if (finalMaxBpm !== undefined) onChangeMaxBpm(finalMaxBpm);
				}

				setIsOpen(false);
			}
		};

		// mousedown 이벤트로 변경하여 더 빠른 처리
		document.addEventListener("mousedown", handleClickOutside, false);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside, false);
		};
	}, [isOpen, tempMinBpm, tempMaxBpm, onSubmit, onChangeMinBpm, onChangeMaxBpm]);

	// render props를 위한 데이터
	const renderProps = {
		currentValue,
		isOpen,
	};

	// children이 함수인지 확인
	const isChildrenFunction = typeof children === "function";

	// Trigger 컴포넌트 렌더링
	const renderTrigger = () => {
		if (isChildrenFunction) {
			// children이 함수인 경우 render props 패턴
			const childrenAsFunction = children as (props: {
				currentValue: string | undefined;
				isOpen: boolean;
			}) => React.ReactNode;
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
				minWidth: "240px",
			}}
		>
			<div className="p-4">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2 h-10">
						<input
							type="radio"
							id="exact"
							name="bpmType"
							checked={isExactMode}
							onChange={() => handleModeChange("exact")}
							className="w-4 h-4 cursor-pointer"
						/>
						<label
							htmlFor="exact"
							className="text-sm font-medium cursor-pointer"
						>
							Exact
						</label>
						{isExactMode && (
							<input
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								value={tempMinBpm || ""}
								onChange={handleExactBPMChange}
								tabIndex={0}
								onClick={(e) => {
									e.stopPropagation();
									setTimeout(() => {
										(e.target as HTMLInputElement).focus();
									}, 0);
								}}
								onMouseDown={(e) => {
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
							checked={!isExactMode}
							onChange={() => handleModeChange("range")}
							className="w-4 h-4 cursor-pointer"
						/>
						<label
							htmlFor="range"
							className="text-sm font-medium cursor-pointer"
						>
							Range
						</label>
						{!isExactMode && (
							<div className="flex items-center gap-2">
								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									value={tempMinBpm || ""}
									onChange={handleMinBPMChange}
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										setTimeout(() => {
											(e.target as HTMLInputElement).focus();
										}, 0);
									}}
									onMouseDown={(e) => {
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
									value={tempMaxBpm || ""}
									onChange={handleMaxBPMChange}
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										setTimeout(() => {
											(e.target as HTMLInputElement).focus();
										}, 0);
									}}
									onMouseDown={(e) => {
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
