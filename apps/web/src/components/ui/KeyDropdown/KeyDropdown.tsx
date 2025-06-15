"use client";

import { cn } from "@/common/utils";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";

// 타입 정의를 직접 여기에 추가
export type KeyValue = {
	label: string;
	value: string;
};

// render prop을 위한 타입 정의
export interface KeyDropdownRenderProps {
	currentValue: string | undefined;
	isOpen: boolean;
	keyValue: KeyValue | undefined;
	scaleValue: string | null;
	activeTab: "flat" | "sharp";
}

//분리 필요
const sharpKeys = [
	{
		label: "C#",
		value: "Cs",
	},
	{
		label: "D#",
		value: "Ds",
	},
	{
		label: "F#",
		value: "Fs",
	},
	{
		label: "G#",
		value: "Gs",
	},
	{
		label: "A#",
		value: "As",
	},
] as const;

const naturalKeys = [
	{
		label: "C",
		value: "C",
	},
	{
		label: "D",
		value: "D",
	},
	{
		label: "E",
		value: "E",
	},
	{
		label: "F",
		value: "F",
	},
	{
		label: "G",
		value: "G",
	},
	{
		label: "A",
		value: "A",
	},
	{
		label: "B",
		value: "B",
	},
] as const;

const flatKeys = [
	{
		label: "D♭",
		value: "Db",
	},
	{
		label: "E♭",
		value: "Eb",
	},
	{
		label: "G♭",
		value: "Gb",
	},
	{
		label: "A♭",
		value: "Ab",
	},
	{
		label: "B♭",
		value: "Bb",
	},
] as const;

export interface KeyButtonProps {
	children: React.ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	variant?: "key" | "scale";
	ariaLabel?: string;
}

export interface KeyDropdownProps {
	keyValue: KeyValue | undefined;
	scaleValue: string | null;
	onChangeKey: (key: KeyValue) => void;
	onChangeScale: (scale: string) => void;
	onClear: () => void;
	children?: React.ReactNode | ((props: KeyDropdownRenderProps) => React.ReactNode);
	asChild?: boolean;
	className?: string;
}

export function KeyButton({ children, onClick, variant = "key", ariaLabel }: KeyButtonProps) {
	const getButtonClasses = () => {
		const baseClasses =
			"font-medium rounded-md border-2 border-gray-200 border-solid transition-all cursor-pointer duration-[0.2s] ease-[ease] flex items-center justify-center flex-none";

		if (variant === "key") {
			return cn(baseClasses, "bg-white text-neutral-800 text-xs hover:bg-gray-100 w-6 h-6 basis-6");
		}

		if (variant === "scale") {
			return cn(baseClasses, "bg-white w-[100px] h-[35px] basis-[100px] text-neutral-800 text-sm hover:bg-gray-100");
		}

		return baseClasses;
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault(); // 기본 동작 방지
		e.stopPropagation(); // 이벤트 전파 방지
		onClick?.(e);
	};

	return (
		<button
			type="button" // form submit 방지
			className={getButtonClasses()}
			onClick={handleClick}
			aria-label={ariaLabel}
		>
			{children}
		</button>
	);
}

// 기본 트리거 컴포넌트
const KeyTrigger = ({
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
			aria-label="음악 키 선택"
			aria-controls="key-select-dropdown"
			{...props}
		>
			<span className={cn("block truncate text-left text-sm", !currentValue && "text-gray-400")}>
				{currentValue || "Key를 선택해주세요"}
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

export const KeyDropdown = ({
	keyValue,
	scaleValue,
	onChangeKey,
	onChangeScale,
	onClear,
	children,
	asChild = false,
	className,
}: KeyDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"flat" | "sharp">("flat");
	const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
	const [isClient, setIsClient] = useState(false);

	const currentValue = useMemo(() => {
		if (keyValue && scaleValue) {
			return `${keyValue.label} ${scaleValue}`;
		}

		if (keyValue) {
			return keyValue.label;
		}

		return undefined;
	}, [keyValue, scaleValue]);

	const dropdownRef = useRef<HTMLDivElement>(null!);
	const containerRef = useRef<HTMLDivElement>(null);

	// 클라이언트 사이드 렌더링 확인
	useEffect(() => {
		setIsClient(true);
	}, []);

	// 드롭다운 위치 계산
	const updateDropdownPosition = useCallback(() => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
			});
		}
	}, []);

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

	const onTabChange = useCallback((tab: "flat" | "sharp") => {
		setActiveTab(tab);
	}, []);

	const onKeyClick = useCallback(
		(key: { label: string; value: string }) => {
			onChangeKey(key);
		},
		[onChangeKey],
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

	const handleTabClick = useCallback(
		(tab: "flat" | "sharp") => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onTabChange(tab);
		},
		[onTabChange],
	);

	// 키 버튼 클릭 핸들러에서 이벤트 전파 방지
	const handleKeyButtonClick = useCallback(
		(key: { label: string; value: string }) => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onKeyClick(key);
		},
		[onKeyClick],
	);

	const handleScaleButtonClick = useCallback(
		(scale: string) => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onChangeScale(scale);
		},
		[onChangeScale],
	);

	// 외부 클릭 감지
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// 드롭다운이 열려있을 때만 처리
			if (isOpen) {
				// 트리거 컨테이너나 드롭다운 내부 클릭은 무시
				if (
					(containerRef.current && containerRef.current.contains(target)) ||
					(dropdownRef.current && dropdownRef.current.contains(target))
				) {
					return;
				}

				// 외부 클릭이면 드롭다운 닫기
				setIsOpen(false);
			}
		};

		// mousedown 대신 click 이벤트 사용 (더 안정적)
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [isOpen]);

	useEffect(() => {
		if (keyValue && scaleValue) {
			setIsOpen(false);
		}
	}, [keyValue, scaleValue]);

	// render props를 위한 데이터
	const renderProps: KeyDropdownRenderProps = {
		currentValue,
		isOpen,
		keyValue,
		scaleValue,
		activeTab,
	};

	// children이 함수인지 확인
	const isChildrenFunction = typeof children === "function";

	// Trigger 컴포넌트 렌더링
	const renderTrigger = () => {
		if (isChildrenFunction) {
			// children이 함수인 경우 render props 패턴
			const childrenAsFunction = children as (props: KeyDropdownRenderProps) => React.ReactNode;
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
				<KeyTrigger
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
			id="key-select-dropdown"
			role="dialog"
			aria-label="음악 키 선택 메뉴"
			className="bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] pointer-events-auto"
			style={{
				position: "absolute",
				top: dropdownPosition.top,
				left: dropdownPosition.left,
				width: dropdownPosition.width,
				minWidth: "300px",
			}}
			onClick={(e) => e.stopPropagation()}
		>
			<header className="bg-gray-50 border-b border-solid border-b-gray-200">
				<nav
					className="flex"
					role="tablist"
				>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === "flat"}
						aria-controls="flat-keys-panel"
						className={cn(
							"flex-1 p-2 text-sm font-medium text-center transition-all cursor-pointer border-b-[3px] border-solid duration-[0.2s] ease-[ease]",
							activeTab === "flat"
								? "bg-white border-b-blue-600 text-neutral-800"
								: "text-gray-500 bg-gray-50 border-b-transparent hover:text-gray-700",
						)}
						onClick={handleTabClick("flat")}
					>
						Flat Keys
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === "sharp"}
						aria-controls="sharp-keys-panel"
						className={cn(
							"flex-1 p-2 text-sm font-medium text-center transition-all cursor-pointer border-b-[3px] border-solid duration-[0.2s] ease-[ease]",
							activeTab === "sharp"
								? "bg-white border-b-blue-600 text-neutral-800"
								: "text-gray-500 bg-gray-50 border-b-transparent hover:text-gray-700",
						)}
						onClick={handleTabClick("sharp")}
					>
						Sharp Keys
					</button>
				</nav>
			</header>

			<div className="flex flex-col mb-4 w-full">
				<section className="py-4 flex flex-col gap-4">
					{/* 상단 샤프/플랫 키들 - 키보드처럼 붙어있게 */}
					{activeTab === "sharp" && (
						<div
							id="sharp-keys-panel"
							role="tabpanel"
							className="flex justify-center gap-8"
						>
							<div className="flex gap-1">
								{sharpKeys.slice(0, 2).map((key) => (
									<KeyButton
										key={key.value}
										variant="key"
										onClick={handleKeyButtonClick(key)}
										ariaLabel={`${key.label} 키 선택`}
									>
										{key.label}
									</KeyButton>
								))}
							</div>

							<div className="flex gap-1">
								{sharpKeys.slice(2).map((key) => (
									<KeyButton
										key={key.value}
										variant="key"
										onClick={handleKeyButtonClick(key)}
										ariaLabel={`${key.label} 키 선택`}
									>
										{key.label}
									</KeyButton>
								))}
							</div>
						</div>
					)}

					{activeTab === "flat" && (
						<div
							id="flat-keys-panel"
							role="tabpanel"
							className="flex justify-center gap-8"
						>
							<div className="flex gap-1">
								{flatKeys.slice(0, 2).map((key) => (
									<KeyButton
										key={key.value}
										variant="key"
										onClick={handleKeyButtonClick(key)}
										ariaLabel={`${key.label} 키 선택`}
									>
										{key.label}
									</KeyButton>
								))}
							</div>

							<div className="flex gap-1">
								{flatKeys.slice(2).map((key) => (
									<KeyButton
										key={key.value}
										variant="key"
										onClick={handleKeyButtonClick(key)}
										ariaLabel={`${key.label} 키 선택`}
									>
										{key.label}
									</KeyButton>
								))}
							</div>
						</div>
					)}

					{/* 하단 메인 키들 - 단순 세로 나열 */}
					<div className="flex justify-center">
						<div className="flex gap-1">
							{naturalKeys.map((key) => (
								<KeyButton
									key={key.value}
									variant="key"
									onClick={handleKeyButtonClick(key)}
									ariaLabel={`${key.label} 키 선택`}
								>
									{key.label}
								</KeyButton>
							))}
						</div>
					</div>
				</section>

				{/* 키 스케일 버튼 */}
				<section
					role="group"
					aria-label="음계 선택"
					className="flex gap-6 justify-center"
				>
					<KeyButton
						variant="scale"
						onClick={handleScaleButtonClick("Major")}
						ariaLabel="장음계 선택"
					>
						Major
					</KeyButton>
					<KeyButton
						variant="scale"
						onClick={handleScaleButtonClick("Minor")}
						ariaLabel="단음계 선택"
					>
						Minor
					</KeyButton>
				</section>
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

			{/* Portal로 드롭다운 렌더링 */}
			{isClient && isOpen && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}
		</>
	);
};
