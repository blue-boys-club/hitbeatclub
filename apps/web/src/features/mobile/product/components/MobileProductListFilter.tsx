"use client";

import { Check } from "@/assets/svgs/Check";
import { X } from "@/assets/svgs/X";
import { MobileFilterButton } from "@/components/ui/MobileFilterButton";
import { Slider } from "@/components/ui/Slider";
import { useState, useEffect } from "react";
import { ProductSearchQuery } from "@/apis/search/search.type";
import { useQuery } from "@tanstack/react-query";
import { getProductSearchInfoQueryOption } from "@/apis/product/query/product.query-option";

interface FilterState {
	sort?: "RECENT" | "RECOMMEND" | null;
	bpmRange: [number, number];
	genreIds: number[];
	tagIds: number[];
	musicKey?:
		| "C"
		| "Db"
		| "D"
		| "Eb"
		| "E"
		| "F"
		| "Gb"
		| "G"
		| "Ab"
		| "A"
		| "Bb"
		| "B"
		| "Cs"
		| "Ds"
		| "Fs"
		| "Gs"
		| "As"
		| "null"
		| undefined;
	scaleType?: "MAJOR" | "MINOR" | null;
	keyType?: "SHARP" | "FLAT" | null;
}

interface MobileProductListFilterProps {
	onClose: () => void;
	onApplyFilter: (filters: Partial<ProductSearchQuery>) => void;
	initialFilters?: Partial<ProductSearchQuery>;
}

export const MobileProductListFilter = ({
	onClose,
	onApplyFilter,
	initialFilters = {},
}: MobileProductListFilterProps) => {
	// musicKey에서 keyType을 추론하는 함수
	const getKeyTypeFromMusicKey = (musicKey?: string): "SHARP" | "FLAT" | null => {
		if (!musicKey) return null;
		const sharpKeys = ["Cs", "Ds", "Fs", "Gs", "As"];
		const flatKeys = ["Db", "Eb", "Gb", "Ab", "Bb"];

		if (sharpKeys.includes(musicKey)) return "SHARP";
		if (flatKeys.includes(musicKey)) return "FLAT";
		return null;
	};

	const [filters, setFilters] = useState<FilterState>({
		sort: (initialFilters.sort as "RECENT" | "RECOMMEND" | null) || null,
		bpmRange: [initialFilters.minBpm || 0, initialFilters.maxBpm || 200],
		genreIds: initialFilters.genreIds || [],
		tagIds: initialFilters.tagIds || [],
		musicKey: initialFilters.musicKey || undefined,
		scaleType: (initialFilters.scaleType as "MAJOR" | "MINOR" | null) || null,
		keyType: getKeyTypeFromMusicKey(initialFilters.musicKey),
	});

	// 상품 검색 정보 조회 (장르, 태그)
	const { data: searchInfo } = useQuery(getProductSearchInfoQueryOption());
	const genres = searchInfo?.genres || [];
	const tags = searchInfo?.tags || [];

	// 음계 옵션
	const musicKeys: Array<"C" | "D" | "E" | "F" | "G" | "A" | "B"> = ["C", "D", "E", "F", "G", "A", "B"];
	const sharpKeys: Array<"Cs" | "Ds" | "Fs" | "Gs" | "As"> = ["Cs", "Ds", "Fs", "Gs", "As"];
	const flatKeys: Array<"Db" | "Eb" | "Gb" | "Ab" | "Bb"> = ["Db", "Eb", "Gb", "Ab", "Bb"];

	// 표시용 키 매핑
	const getDisplayKey = (key: string): string => {
		const sharpMapping: Record<string, string> = {
			Cs: "C#",
			Ds: "D#",
			Fs: "F#",
			Gs: "G#",
			As: "A#",
		};
		return sharpMapping[key] || key;
	};

	// 실제 값으로 변환
	const getActualKey = (displayKey: string): string => {
		const reverseMapping: Record<string, string> = {
			"C#": "Cs",
			"D#": "Ds",
			"F#": "Fs",
			"G#": "Gs",
			"A#": "As",
		};
		return reverseMapping[displayKey] || displayKey;
	};

	// body 스크롤 비활성화 처리
	useEffect(() => {
		const originalStyle = window.getComputedStyle(document.body).overflow;
		const scrollY = window.scrollY;

		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";

		return () => {
			document.body.style.overflow = originalStyle;
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			window.scrollTo(0, scrollY);
		};
	}, []);

	const handleSortChange = (sort: "RECENT" | "RECOMMEND") => {
		setFilters((prev) => ({
			...prev,
			sort: prev.sort === sort ? null : sort,
		}));
	};

	const handleBpmChange = (value: number[]) => {
		setFilters((prev) => ({
			...prev,
			bpmRange: [value[0] ?? 0, value[1] ?? 200],
		}));
	};

	const handleGenreToggle = (genreId: number) => {
		setFilters((prev) => ({
			...prev,
			genreIds: prev.genreIds.includes(genreId)
				? prev.genreIds.filter((id) => id !== genreId)
				: prev.genreIds.length < 3
					? [...prev.genreIds, genreId]
					: prev.genreIds, // 최대 3개까지만
		}));
	};

	const handleTagToggle = (tagId: number) => {
		setFilters((prev) => ({
			...prev,
			tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId],
		}));
	};

	const handleKeyTypeChange = (keyType: "SHARP" | "FLAT") => {
		setFilters((prev) => ({
			...prev,
			keyType: prev.keyType === keyType ? null : keyType,
			musicKey: undefined as FilterState["musicKey"], // 키 타입 변경 시 선택된 키 초기화
		}));
	};

	const handleScaleTypeChange = (scaleType: "MAJOR" | "MINOR") => {
		setFilters((prev) => ({
			...prev,
			scaleType: prev.scaleType === scaleType ? null : scaleType,
		}));
	};

	const handleMusicKeyChange = (displayKey: string) => {
		const actualKey = getActualKey(displayKey);
		setFilters((prev) => ({
			...prev,
			musicKey: prev.musicKey === actualKey ? undefined : (actualKey as FilterState["musicKey"]),
		}));
	};

	const getAvailableKeys = () => {
		if (filters.keyType === "SHARP") return sharpKeys.map(getDisplayKey);
		if (filters.keyType === "FLAT") return flatKeys;
		return musicKeys;
	};

	const handleApplyFilter = () => {
		const searchQuery: Partial<ProductSearchQuery> = {
			sort: filters.sort || undefined,
			minBpm: filters.bpmRange[0] > 0 ? filters.bpmRange[0] : undefined,
			maxBpm: filters.bpmRange[1] < 200 ? filters.bpmRange[1] : undefined,
			genreIds: filters.genreIds.length > 0 ? filters.genreIds : undefined,
			tagIds: filters.tagIds.length > 0 ? filters.tagIds : undefined,
			musicKey: filters.musicKey || undefined,
			scaleType: filters.scaleType || undefined,
		};

		onApplyFilter(searchQuery);
		onClose();
	};

	const handleReset = () => {
		setFilters({
			sort: null,
			bpmRange: [0, 200],
			genreIds: [],
			tagIds: [],
			musicKey: undefined,
			scaleType: null,
			keyType: null,
		});
	};

	return (
		<div className="px-4 py-4 fixed top-0 left-0 right-0 bottom-0 z-[100] flex flex-col justify-between overflow-y-auto bg-black/85 backdrop-filter backdrop-blur-sm">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<div className="w-full h-4px bg-white" />
					<span className="font-suisse text-22px leading-86% font-semibold text-white">FILTER</span>
					<div className="w-full h-4px bg-white" />
				</div>
				<div className="space-y-22px">
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">정렬 Sort</span>
						<div className="flex gap-6px flex-wrap">
							<MobileFilterButton
								isActive={filters.sort === "RECENT"}
								onClick={() => handleSortChange("RECENT")}
							>
								Recent
							</MobileFilterButton>
							<MobileFilterButton
								isActive={filters.sort === "RECOMMEND"}
								onClick={() => handleSortChange("RECOMMEND")}
							>
								Popular
							</MobileFilterButton>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex justify-between">
							<span className="font-suit text-xs text-white">BPM</span>
							<div className="flex items-center gap-7px">
								<SliderInput value={filters.bpmRange[0]} />
								<div className="w-8px h-1px bg-white" />
								<SliderInput value={filters.bpmRange[1]} />
							</div>
						</div>
						<Slider
							value={filters.bpmRange}
							min={0}
							max={200}
							onValueChange={handleBpmChange}
						/>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">장르 Genre (최대 3개)</span>
						<div className="flex gap-6px flex-wrap">
							{genres.map((genre) => (
								<MobileFilterButton
									key={genre.id}
									isActive={filters.genreIds.includes(genre.id)}
									onClick={() => handleGenreToggle(genre.id)}
								>
									{genre.name}
								</MobileFilterButton>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">키 Key</span>
						<div className="flex flex-col gap-2">
							<div className="flex gap-72px">
								<div className="flex gap-6px">
									<MobileFilterButton
										isActive={filters.keyType === "SHARP"}
										onClick={() => handleKeyTypeChange("SHARP")}
									>
										Sharp
									</MobileFilterButton>
									<MobileFilterButton
										isActive={filters.keyType === "FLAT"}
										onClick={() => handleKeyTypeChange("FLAT")}
									>
										Flat
									</MobileFilterButton>
								</div>
								<div className="flex gap-6px">
									<MobileFilterButton
										isActive={filters.scaleType === "MAJOR"}
										onClick={() => handleScaleTypeChange("MAJOR")}
									>
										Major
									</MobileFilterButton>
									<MobileFilterButton
										isActive={filters.scaleType === "MINOR"}
										onClick={() => handleScaleTypeChange("MINOR")}
									>
										Minor
									</MobileFilterButton>
								</div>
							</div>
							<div className="flex gap-6px flex-wrap">
								{getAvailableKeys().map((key) => (
									<MobileFilterButton
										key={key}
										isActive={filters.musicKey === getActualKey(key)}
										onClick={() => handleMusicKeyChange(key)}
									>
										{key}
									</MobileFilterButton>
								))}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">태그 Tags</span>
						<div className="flex gap-6px flex-wrap">
							{tags.map((tag) => (
								<MobileFilterButton
									key={tag.id}
									isActive={filters.tagIds.includes(tag.id)}
									onClick={() => handleTagToggle(tag.id)}
								>
									{tag.name}
								</MobileFilterButton>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-8 mt-20">
				<button
					onClick={handleReset}
					className="mt-2 text-white text-sm underline"
				>
					필터 초기화
				</button>
				<div className="flex gap-1">
					<button
						className="flex-1 bg-white text-black flex justify-center items-center rounded-5px h-29px"
						onClick={handleApplyFilter}
					>
						<Check />
					</button>
					<button
						onClick={onClose}
						className="flex-1 bg-white text-black flex justify-center items-center rounded-5px h-29px"
					>
						<X />
					</button>
				</div>
			</div>
		</div>
	);
};

const SliderInput = ({ value }: { value: number }) => {
	return (
		<input
			className="text-center text-10px text-white leading-86% w-8 h-15px border border-white rounded-5px"
			readOnly
			value={value}
		/>
	);
};
