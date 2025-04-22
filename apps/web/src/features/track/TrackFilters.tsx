"use client";

import { useState, memo } from "react";
import { CloseWhite } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { TagDropdown } from "@/components/ui";

interface TrackFiltersProps {
	onFiltersChange?: (filters: FiltersState) => void;
}

interface FiltersState {
	category: string;
	genre: string;
	key: string;
	bpms: string;
}

/**
 * 좋아요한 트랙 필터 컴포넌트
 * - 카테고리, 장르, 키, BPM 기준으로 필터링 가능
 * - 각 필터는 개별적으로 선택/해제 가능
 * - 선택된 필터는 태그 형태로 표시
 */
export const TrackFilters = memo(({ onFiltersChange }: TrackFiltersProps) => {
	const [filters, setFilters] = useState<FiltersState>({
		category: "",
		genre: "",
		key: "",
		bpms: "",
	});

	//dummy data
	const categories = [
		{ label: "BEAT", value: "beat" },
		{ label: "ACCAPELLA", value: "accapella" },
	];

	const genres = [
		{ label: "POP", value: "pop" },
		{ label: "ROCK", value: "rock" },
	];

	const keys = [
		{ label: "C", value: "c" },
		{ label: "D", value: "d" },
		{ label: "E", value: "e" },
		{ label: "F", value: "f" },
		{ label: "G", value: "g" },
		{ label: "A", value: "a" },
		{ label: "B", value: "b" },
	];

	const bpms = [
		{ label: "100", value: "100" },
		{ label: "120", value: "120" },
		{ label: "140", value: "140" },
		{ label: "160", value: "160" },
		{ label: "180", value: "180" },
	];

	const onChangeFilter = (filter: keyof FiltersState, value: string) => {
		const newFilters = { ...filters, [filter]: value };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const onClear = (filter: keyof FiltersState) => {
		const newFilters = { ...filters, [filter]: "" };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const renderSelectedOption = (value: string, filter: keyof FiltersState) => {
		const getOptionLabel = () => {
			switch (filter) {
				case "category":
					return categories.find((c) => c.value === value)?.label;
				case "genre":
					return genres.find((g) => g.value === value)?.label;
				case "key":
					return keys.find((k) => k.value === value)?.label;
				case "bpms":
					return bpms.find((b) => b.value === value)?.label;
			}
		};

		return (
			<div
				className={cn(
					"px-2 py-0.5 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2 cursor-pointer transition-colors",
					"bg-black",
				)}
			>
				<div className={cn("text-md font-medium", "text-white")}>{getOptionLabel()}</div>

				<div
					onClick={(e) => {
						e.stopPropagation();
						onClear(filter);
					}}
				>
					<CloseWhite />
				</div>
			</div>
		);
	};

	return (
		<div className="flex items-center gap-2 mt-3.5 mb-1.5">
			<TagDropdown
				trigger={"Category"}
				options={categories}
				onSelect={(value) => onChangeFilter("category", value)}
				showChevron={filters.category ? false : true}
			>
				{filters.category && renderSelectedOption(filters.category, "category")}
			</TagDropdown>

			<TagDropdown
				trigger="Genre"
				options={genres}
				onSelect={(value) => onChangeFilter("genre", value)}
				showChevron={filters.genre ? false : true}
			>
				{filters.genre && renderSelectedOption(filters.genre, "genre")}
			</TagDropdown>

			<TagDropdown
				trigger="Key"
				options={keys}
				onSelect={(value) => onChangeFilter("key", value)}
				showChevron={filters.key ? false : true}
			>
				{filters.key && renderSelectedOption(filters.key, "key")}
			</TagDropdown>

			<TagDropdown
				trigger="BPM"
				options={bpms}
				onSelect={(value) => onChangeFilter("bpms", value)}
				showChevron={filters.bpms ? false : true}
			>
				{filters.bpms && renderSelectedOption(filters.bpms, "bpms")}
			</TagDropdown>
		</div>
	);
});

TrackFilters.displayName = "TrackFilters";
