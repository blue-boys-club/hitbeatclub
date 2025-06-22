import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TagDropdown } from "@/components/ui/TagDropdown/TagDropdown";
import { KeyDropdown, type KeyValue } from "@/components/ui/KeyDropdown/KeyDropdown";
import { BPMDropdown } from "@/components/ui/BPMDropdown/BPMDropdown";
import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { getProductSearchInfoQueryOption } from "@/apis/product/query/product.query-option";
import type { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import { CloseWhite } from "@/assets/svgs/CloseWhite";
import { ChevronDown } from "@/assets/svgs/ChevronDown";

interface ArtistProductFilterProps {
	onFilterChange: (filters: Omit<ArtistProductListQueryRequest, "page" | "limit">) => void;
	className?: string;
}

export const ArtistProductFilter = ({ onFilterChange, className }: ArtistProductFilterProps) => {
	const { data: searchInfo } = useQuery(getProductSearchInfoQueryOption());

	const [category, setCategory] = useState<string>("");
	const [genreIds, setGenreIds] = useState<number[]>([]);
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>(undefined);
	const [scaleValue, setScaleValue] = useState<string | null>(null);
	const [minBpm, setMinBpm] = useState<number>(0);
	const [maxBpm, setMaxBpm] = useState<number>(0);

	/* ---------------- Memo helpers ---------------- */
	const selectedGenres = useMemo(() => {
		if (!searchInfo) return [];
		return genreIds.map((id) => searchInfo.genres?.find((g) => g.id === id)).filter(Boolean);
	}, [genreIds, searchInfo]);

	/* ---------------- Emit filters ---------------- */
	useEffect(() => {
		const payload: Omit<ArtistProductListQueryRequest, "page" | "limit"> = {
			isPublic: true,
		} as any;

		if (category) payload.category = category as any;
		if (genreIds.length) payload.genreIds = genreIds;
		if (keyValue) payload.musicKey = keyValue.value as any;
		if (scaleValue) payload.scaleType = scaleValue.toUpperCase() as any;
		if (minBpm) payload.minBpm = minBpm;
		if (maxBpm) payload.maxBpm = maxBpm;

		onFilterChange(payload);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, genreIds, keyValue, scaleValue, minBpm, maxBpm]);

	/* ---------------- Handlers ---------------- */
	// Category render
	const renderCategorySelected = (value: string) => (
		<div
			className={cn(
				"px-2 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2",
				"bg-black",
			)}
		>
			<div className="text-md font-medium text-white">{value}</div>
			<div
				onClick={(e) => {
					e.stopPropagation();
					setCategory("");
				}}
			>
				<CloseWhite />
			</div>
		</div>
	);

	const getCategoryTrigger = () => {
		return category ? renderCategorySelected(category) : <span className="font-medium leading-1.5">Category</span>;
	};

	/* ---------------- UI ---------------- */
	return (
		<div className={cn("flex flex-col", className)}>
			<div className="flex gap-1 pt-4">
				{/* Category */}
				<TagDropdown
					trigger={getCategoryTrigger()}
					options={[
						{ label: "BEAT", value: "BEAT" },
						{ label: "ACAPELA", value: "ACAPELA" },
					]}
					onSelect={(val) => setCategory(val === category ? "" : val)}
					showChevron={!category}
				>
					{category && renderCategorySelected(category)}
				</TagDropdown>

				{/* Genre */}
				<TagDropdown
					trigger={<span className="font-medium leading-[16px]">Genre</span>}
					options={searchInfo?.genres?.map((g) => ({ label: g.name, value: g.id.toString() })) ?? []}
					onSelect={(val) => {
						const id = Number(val);
						if (!Number.isNaN(id) && !genreIds.includes(id)) {
							setGenreIds([...genreIds, id]);
						}
					}}
				/>

				{/* Key */}
				<KeyDropdown
					keyValue={keyValue}
					scaleValue={scaleValue}
					onChangeKey={(k) => setKeyValue(k)}
					onChangeScale={(s) => setScaleValue(s)}
					onClear={() => {
						setKeyValue(undefined);
						setScaleValue(null);
					}}
					asChild
				>
					{({ currentValue }) => (
						<span
							className={cn(
								"inline-flex items-center gap-0.5 px-[9px] py-[2px] pr-[3px] outline-2 outline-black -outline-offset-1 rounded-[40px] cursor-pointer whitespace-nowrap font-medium leading-[16px] sm:px-[6px]",
								currentValue ? "bg-black text-white" : "bg-white text-black",
							)}
						>
							{currentValue || "Key"}
							<ChevronDown />
						</span>
					)}
				</KeyDropdown>

				{/* BPM */}
				<BPMDropdown
					minBpm={minBpm || undefined}
					maxBpm={maxBpm || undefined}
					onChangeMinBpm={() => {}}
					onChangeMaxBpm={() => {}}
					onSubmit={(min, max) => {
						setMinBpm(min || 0);
						setMaxBpm(max || 0);
					}}
					onClear={() => {
						setMinBpm(0);
						setMaxBpm(0);
					}}
					asChild
				>
					{({ currentValue }) => (
						<span
							className={cn(
								"inline-flex items-center gap-0.5 px-[9px] py-[2px] pr-[3px] outline-2 outline-black -outline-offset-1 rounded-[40px] cursor-pointer whitespace-nowrap font-medium leading-[16px] sm:px-[6px]",
								currentValue ? "bg-black text-white" : "bg-white text-black",
							)}
						>
							{currentValue || "BPM"}
							<ChevronDown />
						</span>
					)}
				</BPMDropdown>
			</div>

			{/* Selected Genres pills */}
			{selectedGenres.length > 0 && (
				<div className="flex gap-1 mt-2">
					{selectedGenres.map((g) => (
						<div
							key={g!.id}
							className="flex items-center gap-1 px-2 py-[2px] bg-black text-white rounded-full text-xs cursor-pointer"
							onClick={() => setGenreIds(genreIds.filter((id) => id !== g!.id))}
						>
							{g!.name}
							<CloseWhite />
						</div>
					))}
				</div>
			)}
		</div>
	);
};
