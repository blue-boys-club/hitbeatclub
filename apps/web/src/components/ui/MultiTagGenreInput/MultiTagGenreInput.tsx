"use client";
import { cn } from "@/common/utils";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Checkbox, EmptyCheckbox } from "@/assets/svgs";
import { Tag, TagItem } from "./Tag";
import { Genre, GenreItem } from "./Genre";

interface MultiTagGenreInputProps {
	maxItems: number;
	type: "tag" | "genre";
	placeholder: string;
	allowDirectInput?: boolean;
	suggestedItems: { value: string; count: number }[];
	onChange?: (items: Array<Tag | Genre>) => void;
}

interface ItemProps {
	item: Tag | Genre;
	type: "tag" | "genre";
	onClickClose: () => void;
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
}: MultiTagGenreInputProps) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [items, setItems] = useState<Array<Tag | Genre>>([]);
	const [isFocused, setIsFocused] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
			setIsFocused(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	useEffect(() => {
		if (items.length >= maxItems || items.length === 0) {
			setIsFocused(false);
		} else {
			setIsFocused(true);
		}
	}, [items, maxItems]);

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

	const handleRemoveItem = useCallback(
		(id: string) => {
			const newItems = items.filter((item) => item.id !== id);
			setItems(newItems);
			onChange?.(newItems);
		},
		[items, onChange],
	);

	const handleClearAll = useCallback(() => {
		setItems([]);
		onChange?.([]);
	}, [onChange]);

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
	return (
		<div
			className="relative"
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

			<div className="absolute pr-1 w-full z-50 bg-white">
				<div
					ref={dropdownRef}
					className={cn("border rounded-b-lg", isFocused ? "block" : "hidden")}
				>
					<div className="flex flex-col py-2 px-3 max-h-[200px] overflow-y-auto">
						{suggestedItems.map((suggestion) => {
							const isSelected = items.some((item) => item.text === suggestion.value);
							return (
								<div
									className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer rounded-sm"
									key={suggestion.value}
									onClick={() => addItem(suggestion.value)}
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
							onClick={() => setIsFocused(false)}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MultiTagGenreInput;
