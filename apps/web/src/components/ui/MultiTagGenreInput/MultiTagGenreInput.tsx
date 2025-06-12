"use client";
import { cn } from "@/common/utils";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Checkbox, EmptyCheckbox } from "@/assets/svgs";
import { SearchTag } from "@/components/ui/SearchTag/SearchTag";
import { Tag, TagItem } from "./Tag";
import { Genre, GenreItem } from "./Genre";

interface MultiTagGenreInputProps {
	maxItems: number;
	type: "tag" | "genre";
	placeholder: string;
	allowDirectInput?: boolean;
	suggestedItems: { value: string; count: number }[];
	onChange?: (items: Array<Tag | Genre>) => void;
	useSearchTagTrigger?: boolean; // SearchTag를 트리거로 사용할지 여부
	className?: string; // 외부에서 스타일 제어
}

interface ItemProps {
	item: Tag | Genre;
	type: "tag" | "genre";
	onClickClose: () => void;
}

interface DropdownPosition {
	top: number;
	left: number;
	width: number;
}

const ItemRenderer = ({ item, type, onClickClose }: ItemProps) => {
	if (type === "genre") {
		return (
			<GenreItem
				genre={item as Genre}
				onClickClose={onClickClose}
				genreColor="bg-hbc-white"
				genreTextColor="text-hbc-black"
			/>
		);
	}
	return (
		<TagItem
			tag={item as Tag}
			onClickClose={onClickClose}
			tagColor="bg-hbc-black"
			tagTextColor="text-hbc-white"
		/>
	);
};

const MultiTagGenreInput = ({
	maxItems,
	type,
	placeholder,
	allowDirectInput = true,
	suggestedItems,
	onChange,
	useSearchTagTrigger = false,
	className,
}: MultiTagGenreInputProps) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [items, setItems] = useState<Array<Tag | Genre>>([]);
	const [isFocused, setIsFocused] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
	const [isClient, setIsClient] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
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
		if (isFocused) {
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
	}, [isFocused, updateDropdownPosition]);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (!isFocused) return;

			const target = event.target as Node;

			// 드롭다운이 포커스된 상태일 때만 처리
			if (isFocused) {
				// 트리거 컨테이너나 드롭다운 내부 클릭은 무시
				if (
					(containerRef.current && containerRef.current.contains(target)) ||
					(dropdownRef.current && dropdownRef.current.contains(target))
				) {
					return;
				}

				// 외부 클릭이면 드롭다운 닫기
				setIsFocused(false);
			}
		},
		[isFocused],
	);

	useEffect(() => {
		if (!isFocused) return;

		// click 이벤트 사용 (더 안정적)
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [handleClickOutside, isFocused]);

	const addItem = useCallback(
		(text: string) => {
			if (text.trim().length === 0) return;
			if (items.some((item) => item.text === text)) return;

			const newItem = {
				id: crypto.randomUUID(),
				text: text.trim(),
				isFromDropdown: false,
			};

			const newItems = [...items, newItem];
			setItems(newItems);
			setInputValue("");
			onChange?.(newItems);
		},
		[items, onChange],
	);

	// 드롭다운 아이템 클릭 핸들러
	const handleSuggestionClick = useCallback(
		(value: string) => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			addItem(value);
		},
		[addItem],
	);

	const handleRemoveItem = useCallback(
		(id: string) => {
			const newItems = items.filter((item) => item.id !== id);
			setItems(newItems);
			onChange?.(newItems);
		},
		[items, onChange],
	);

	const handleClearAll = useCallback(
		(e?: React.MouseEvent) => {
			e?.preventDefault();
			e?.stopPropagation();
			setItems([]);
			setInputValue("");
			onChange?.([]);
		},
		[onChange],
	);

	const handleCloseClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsFocused(false);
	}, []);

	const handleBlur = (e: React.FocusEvent) => {
		if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
			return;
		}
		setIsFocused(false);
	};

	const handleKeyUp = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && inputValue.trim() && allowDirectInput) {
				addItem(inputValue.trim());
			}
			if (e.key === "Backspace" && items.length > 0 && inputValue.trim().length === 0) {
				const newItems = items.slice(0, -1);
				setItems(newItems);
				onChange?.(newItems);
			}
		},
		[inputValue, allowDirectInput, items, onChange, addItem],
	);

	const handleSearchTagSearch = useCallback(
		(value: string) => {
			if (allowDirectInput && value.trim()) {
				addItem(value.trim());
			}
		},
		[addItem, allowDirectInput],
	);

	const handleSearchTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	const handleSearchTagFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	// 드롭다운 컨텐츠
	const dropdownContent = (
		<div
			ref={dropdownRef}
			className="border rounded-lg bg-white shadow-lg z-[9999] pointer-events-auto"
			style={{
				position: "absolute",
				top: dropdownPosition.top,
				left: dropdownPosition.left,
				width: dropdownPosition.width,
				minWidth: "200px",
			}}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex flex-col py-2 px-3 max-h-[200px] overflow-y-auto">
				{(useSearchTagTrigger
					? suggestedItems.filter((suggestion) => suggestion.value.toLowerCase().includes(inputValue.toLowerCase()))
					: suggestedItems
				).map((suggestion) => {
					const isSelected = items.some((item) => item.text === suggestion.value);
					return (
						<div
							className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer rounded-sm"
							key={suggestion.value}
							onClick={handleSuggestionClick(suggestion.value)}
						>
							<div className="cursor-pointer">{isSelected ? <Checkbox /> : <EmptyCheckbox />}</div>
							<span className="text-hbc-black font-bold text-sm flex-1">{suggestion.value}</span>
							<span className="text-hbc-gray-400 text-xs">{suggestion.count}</span>
						</div>
					);
				})}
			</div>
			<div className="flex justify-between p-4 border-t border-hbc-gray-300">
				<button
					type="button"
					className="text-hbc-gray-300 text-sm font-semibold cursor-pointer hover:text-hbc-gray-500 transition-colors"
					onClick={handleClearAll}
				>
					Clear
				</button>
				<button
					type="button"
					className="text-hbc-white bg-hbc-blue px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
					onClick={handleCloseClick}
				>
					Close
				</button>
			</div>
		</div>
	);

	// SearchTag 트리거를 사용하는 경우
	if (useSearchTagTrigger) {
		return (
			<>
				<div
					className={cn("relative", className)}
					ref={containerRef}
				>
					{/* 선택된 아이템들 표시 */}
					{items.length > 0 && (
						<div className="flex flex-wrap gap-1 mb-2">
							{items.map((item) => (
								<ItemRenderer
									key={item.id}
									item={item}
									type={type}
									onClickClose={() => handleRemoveItem(item.id)}
								/>
							))}
						</div>
					)}

					{/* SearchTag 트리거 */}
					{items.length < maxItems && (
						<SearchTag
							placeholder={placeholder}
							value={inputValue}
							onChange={handleSearchTagChange}
							onSearch={handleSearchTagSearch}
							onFocus={handleSearchTagFocus}
							onBlur={handleBlur}
							onKeyUp={handleKeyUp}
						/>
					)}
				</div>

				{/* Portal로 드롭다운 렌더링 */}
				{isClient && isFocused && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}
			</>
		);
	}

	// 기존 스타일 (기본)
	return (
		<>
			<div
				className={cn("relative", className)}
				ref={containerRef}
			>
				<div className="flex flex-wrap items-start gap-[5px] self-stretch p-[8px] rounded-[5px] border-t-2 border-r border-b-2 border-l border-black">
					{items.map((item) => (
						<ItemRenderer
							key={item.id}
							item={item}
							type={type}
							onClickClose={() => handleRemoveItem(item.id)}
						/>
					))}
					{items.length < maxItems && (
						<input
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder={placeholder}
							onKeyUp={handleKeyUp}
							onFocus={() => setIsFocused(true)}
							onBlur={handleBlur}
							className="outline-none flex-1 min-w-[120px]"
						/>
					)}
				</div>
			</div>

			{/* Portal로 드롭다운 렌더링 */}
			{isClient && isFocused && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}
		</>
	);
};

export default MultiTagGenreInput;
