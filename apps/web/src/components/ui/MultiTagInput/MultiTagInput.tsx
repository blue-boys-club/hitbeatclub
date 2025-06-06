"use client";
import { cn } from "@/common/utils";
import React, { useState, useRef, useEffect } from "react";
import { CloseWhite } from "@/assets/svgs";

interface Tag {
	id: string;
	text: string;
	isFromDropdown?: boolean;
}

interface MultiTagInputProps {
	maxTags: number;
	placeholder: string;
	allowDirectInput?: boolean;
	suggestedTags: { tag: string; count: number }[];
	tagColor?: string;
	tagTextColor?: string;
}

const TagItem = ({
	tag,
	onClickClose,
	tagColor,
	tagTextColor,
}: {
	tag: Tag;
	onClickClose: () => void;
	tagColor: string;
	tagTextColor: string;
}) => {
	return (
		<div
			className={cn(
				"flex justify-center items-center gap-4 pl-[8px] py-[2px] pr-[3px] border-2 border-black rounded-[40px]",
				tagColor,
			)}
		>
			<span className={cn("whitespace-nowrap text-xs font-bold leading-4", tagTextColor)}>#{tag.text}</span>
			<div
				onClick={onClickClose}
				className="cursor-pointer"
			>
				<CloseWhite
					width="12px"
					height="12px"
					backgroundColor={tagColor.includes("white") ? "black" : "white"}
					fillColor={tagColor.includes("white") ? "white" : "black"}
				/>
			</div>
		</div>
	);
};

const MultiTagInput = ({
	maxTags,
	placeholder,
	allowDirectInput = true,
	suggestedTags,
	tagColor = "bg-hbc-black",
	tagTextColor = "text-hbc-white",
}: MultiTagInputProps) => {
	const [tag, setTag] = useState<string>("");
	const [tags, setTags] = useState<Tag[]>([]);
	const [isFocused, setIsFocused] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && tag.trim() && allowDirectInput) {
			addTag(tag.trim());
		}
		if (e.key === "Backspace" && tags.length > 0 && tag.trim().length === 0) {
			setTags(tags.slice(0, -1));
		}
	};

	useEffect(() => {
		if (tags.length >= maxTags || tags.length === 0) {
			setIsFocused(false);
		} else {
			setIsFocused(true);
		}
	}, [tags, maxTags]);

	const addTag = (text: string) => {
		if (text.trim().length === 0) {
			return;
		}
		if (tags.some((t) => t.text === text)) {
			return;
		}
		setTags([...tags, { id: crypto.randomUUID(), text: text.trim() }]);
		setTag("");
	};

	const handleRemoveTag = (id: string) => {
		setTags(tags.filter((t) => t.id !== id));
	};

	const handleBlur = (e: React.FocusEvent) => {
		if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
			return;
		}

		setIsFocused(false);
	};

	return (
		<div
			className="relative"
			ref={containerRef}
		>
			<div className="flex flex-wrap items-start gap-[5px] self-stretch p-[8px] rounded-[5px] border-t-2 border-r border-b-2 border-l border-black">
				{tags.map((tag) => (
					<TagItem
						key={tag.id}
						tag={tag}
						onClickClose={() => handleRemoveTag(tag.id)}
						tagColor={tagColor}
						tagTextColor={tagTextColor}
					/>
				))}
				{tags.length < maxTags && (
					<input
						value={tag}
						onChange={(e) => setTag(e.target.value)}
						placeholder={placeholder}
						onKeyUp={handleKeyUp}
						onFocus={() => setIsFocused(true)}
						onBlur={handleBlur}
						className="outline-none "
					/>
				)}
			</div>
			<div className="absolute pr-1 w-full z-50">
				<div
					ref={dropdownRef}
					className={cn(" border rounded-b-lg", isFocused ? "block" : "hidden")}
				>
					<div className="flex flex-col py-2 px-3 max-h-[200px] overflow-y-auto">
						{suggestedTags.map((tag) => (
							<div
								className="flex items-center gap-2"
								key={tag.tag}
							>
								<button
									onClick={() => addTag(tag.tag)}
									className="cursor-pointer size-3 border border-hbc-gray-300 rounded-3px bg-hbc-gray-100"
								></button>
								<span className="text-hbc-black font-bold text-sm">{tag.tag}</span>
								<span className="text-hbc-gray-400">{tag.count}</span>
							</div>
						))}
					</div>
					<div className="flex justify-between p-4 border-t border-hbc-gray-300">
						<button
							className="text-hbc-gray-300 text-sm font-semibold cursor-pointer"
							onClick={() => setTags([])}
						>
							Clear
						</button>
						<button
							className="text-hbc-white bg-hbc-blue px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer"
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

export default MultiTagInput;
