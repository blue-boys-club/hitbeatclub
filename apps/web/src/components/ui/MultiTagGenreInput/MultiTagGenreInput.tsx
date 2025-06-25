"use client";
import { cn } from "@/common/utils";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Checkbox, EmptyCheckbox } from "@/assets/svgs";
import { SearchTag } from "@/components/ui/SearchTag/SearchTag";
import { Tag, TagItem } from "./Tag";
import { Genre, GenreItem } from "./Genre";
import { useCreateTagMutation } from "@/apis/tag/mutation/useCreateTagMutation";

interface MultiTagGenreInputProps {
	maxItems: number;
	type: "tag" | "genre";
	placeholder: string;
	allowDirectInput?: boolean;
	suggestedItems: { id: number; value: string; count: number }[];
	initialItems?: Array<Tag | Genre>; // 초기 아이템들
	onChange?: (items: Array<Tag | Genre>) => void;
	useSearchTagTrigger?: boolean; // SearchTag를 트리거로 사용할지 여부
	renderItemsInDropdown?: boolean;
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
	initialItems = [],
	onChange,
	useSearchTagTrigger = false,
	renderItemsInDropdown = true,
	className,
}: MultiTagGenreInputProps) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [items, setItems] = useState<Array<Tag | Genre>>(initialItems);
	const [isFocused, setIsFocused] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
	const [isClient, setIsClient] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const prevInitialItemsRef = useRef<Array<Tag | Genre>>(initialItems);

	// 태그 생성 mutation
	const createTagMutation = useCreateTagMutation();

	// 클라이언트 사이드 렌더링 확인
	useEffect(() => {
		setIsClient(true);
	}, []);

	// 초기 아이템 동기화 - 이전 값과 비교해서 정말 변경되었을 때만 업데이트
	useEffect(() => {
		const prevItems = prevInitialItemsRef.current;
		const hasChanged =
			initialItems.length !== prevItems.length ||
			initialItems.some(
				(item, index) => !prevItems[index] || prevItems[index].id !== item.id || prevItems[index].text !== item.text,
			);

		if (hasChanged) {
			setItems(initialItems);
			prevInitialItemsRef.current = initialItems;
		}
	}, [initialItems]);

	// 포털 컨테이너 찾기
	const getPortalContainer = useCallback(() => {
		if (!containerRef.current) return document.body;

		// Dialog/Modal 컨테이너 찾기
		let parent = containerRef.current.parentElement;
		while (parent) {
			// Radix Dialog Content 또는 일반적인 모달 컨테이너를 찾기
			if (
				parent.hasAttribute("data-radix-dialog-content") ||
				parent.getAttribute("role") === "dialog" ||
				parent.classList.contains("popup-content") ||
				parent.classList.contains("modal-content")
			) {
				return parent;
			}
			parent = parent.parentElement;
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

	useEffect(() => {
		if (!isFocused) return;

		// click 이벤트를 버블링 단계에서 처리 (캡처 없음)
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// 트리거 컨테이너나 드롭다운 내부 클릭은 무시
			if (
				(containerRef.current && containerRef.current.contains(target)) ||
				(dropdownRef.current && dropdownRef.current.contains(target))
			) {
				return;
			}

			// 외부 클릭이면 드롭다운 닫기
			setIsFocused(false);
		};

		// 캡처 단계 없이 버블링 단계에서만 처리
		document.addEventListener("click", handleClickOutside, false);
		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, [isFocused]);

	const addItem = useCallback(
		async (text: string) => {
			if (text.trim().length === 0) return;
			if (items.some((item) => item.text === text)) return;
			// maxItems 제한 확인
			if (items.length >= maxItems) return;

			let newItem: Tag | Genre;

			if (type === "tag") {
				// suggestion list에서 찾기
				const existingSuggestion = suggestedItems.find((item) => item.value === text.trim());

				if (existingSuggestion) {
					// suggestion에 있는 경우 해당 ID 사용
					newItem = {
						id: existingSuggestion.id,
						text: text.trim(),
						isFromDropdown: true,
					};
				} else {
					// suggestion에 없는 경우 새로 생성
					try {
						const response = await createTagMutation.mutateAsync({ name: text.trim() });
						newItem = {
							id: response.data.id,
							text: text.trim(),
							isFromDropdown: false,
						};
					} catch (error) {
						console.error("태그 생성 실패:", error);
						return;
					}
				}
			} else {
				// genre인 경우: suggestion에 있는 것만 허용, 없으면 추가하지 않음
				const existingSuggestion = suggestedItems.find((item) => item.value === text.trim());

				if (!existingSuggestion) {
					// suggestion에 없는 장르는 추가하지 않음
					return;
				}

				newItem = {
					id: existingSuggestion.id,
					text: text.trim(),
					isFromDropdown: true,
				};
			}

			const newItems = [...items, newItem];
			setItems(newItems);
			setInputValue("");
			onChange?.(newItems);
		},
		[items, onChange, maxItems, type, suggestedItems, createTagMutation],
	);

	// 드롭다운 아이템 클릭 핸들러
	const handleSuggestionClick = useCallback(
		(value: string, suggestedId?: number) => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			// 이미 선택된 항목인지 확인
			const existingItem = items.find((item) => item.text === value);
			if (existingItem) {
				// 선택된 항목이면 제거 (uncheck)
				const newItems = items.filter((item) => item.id !== existingItem.id);
				setItems(newItems);
				onChange?.(newItems);
			} else {
				// maxItems 제한 확인 - 추가하려는 경우에만
				if (items.length >= maxItems) {
					return; // 이벤트 전달 중단
				}

				// 선택되지 않은 항목이면 추가
				if (type === "tag" && suggestedId) {
					// 태그이고 suggestion에 ID가 있는 경우 (이미 존재하는 태그)
					const newItem = {
						id: suggestedId,
						text: value,
						isFromDropdown: true,
					};
					const newItems = [...items, newItem];
					setItems(newItems);
					setInputValue("");
					onChange?.(newItems);
				} else if (type === "genre" && suggestedId) {
					// 장르인 경우 suggestion ID 사용
					const newItem = {
						id: suggestedId,
						text: value,
						isFromDropdown: true,
					};
					const newItems = [...items, newItem];
					setItems(newItems);
					setInputValue("");
					onChange?.(newItems);
				}
				// suggestedId가 없는 경우는 처리하지 않음 (이런 케이스는 없어야 함)
			}

			// 태그 선택 후 드롭다운을 닫지 않고 유지
		},
		[items, onChange, type, maxItems],
	);

	const handleRemoveItem = useCallback(
		(id: number) => {
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

	// handleBlur 제거 - handleClickOutside로만 처리

	const handleKeyUp = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && inputValue.trim() && allowDirectInput && type === "tag") {
				// Enter 키로 직접 입력하는 경우 - 태그만 허용 (장르는 드롭다운에서만 선택 가능)
				addItem(inputValue.trim());
			}
			if (e.key === "Backspace" && items.length > 0 && inputValue.trim().length === 0) {
				const newItems = items.slice(0, -1);
				setItems(newItems);
				onChange?.(newItems);
			}
		},
		[inputValue, allowDirectInput, items, onChange, addItem, type],
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
			className="border rounded-lg bg-white shadow-lg z-[9999] pointer-events-auto flex flex-col"
			style={{
				position: "absolute",
				top: dropdownPosition.top,
				left: dropdownPosition.left,
				width: dropdownPosition.width,
				minWidth: "200px",
				maxHeight: "280px",
			}}
			onClick={(e) => e.stopPropagation()}
		>
			{/* 스크롤 가능한 리스트 영역 */}
			<div className="flex-1 overflow-y-auto max-h-[200px] py-2 px-3">
				{(useSearchTagTrigger
					? suggestedItems.filter((suggestion) => suggestion.value.toLowerCase().includes(inputValue.toLowerCase()))
					: suggestedItems
				).map((suggestion) => {
					const isSelected = items.some((item) => item.text === suggestion.value);
					return (
						<div
							className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer rounded-sm"
							key={suggestion.value}
							onClick={handleSuggestionClick(suggestion.value, suggestion.id)}
						>
							<div className="cursor-pointer">{isSelected ? <Checkbox /> : <EmptyCheckbox />}</div>
							<span className="text-hbc-black font-bold text-sm flex-1">{suggestion.value}</span>
							<span className="text-hbc-gray-400 text-xs">{suggestion.count}</span>
						</div>
					);
				})}
			</div>
			{/* 고정된 버튼 영역 */}
			<div className="flex justify-between p-4 border-t border-hbc-gray-300 ">
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
					className={cn("relative flex gap-2", className)}
					ref={containerRef}
				>
					{/* SearchTag 트리거 */}

					<SearchTag
						placeholder={placeholder}
						value={inputValue}
						onChange={handleSearchTagChange}
						onSearch={handleSearchTagSearch}
						onFocus={handleSearchTagFocus}
						onKeyUp={handleKeyUp}
					/>

					{/* 선택된 아이템들 표시 */}
					{items.length > 0 && renderItemsInDropdown && (
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
				</div>

				{/* Portal로 드롭다운 렌더링 */}
				{isClient && isFocused && typeof window !== "undefined" && createPortal(dropdownContent, getPortalContainer())}
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
					{renderItemsInDropdown &&
						items.map((item) => (
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
							className="outline-none flex-1 min-w-[120px]"
						/>
					)}
				</div>
			</div>

			{/* Portal로 드롭다운 렌더링 */}
			{isClient && isFocused && typeof window !== "undefined" && createPortal(dropdownContent, getPortalContainer())}
		</>
	);
};

export default MultiTagGenreInput;
