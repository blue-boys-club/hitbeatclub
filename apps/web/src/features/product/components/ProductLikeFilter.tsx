"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/common/utils";
import { KeyDropdown, type KeyValue } from "@/components/ui/KeyDropdown/KeyDropdown";
import { BPMDropdown } from "@/components/ui/BPMDropdown/BPMDropdown";
import MultiTagGenreInput from "@/components/ui/MultiTagGenreInput/MultiTagGenreInput";
import { TagDropdown } from "@/components/ui/TagDropdown/TagDropdown";
import { getProductSearchInfoQueryOption } from "@/apis/product/query/product.query-option";
import type { Tag } from "@/components/ui/MultiTagGenreInput/Tag";
import type { Genre } from "@/components/ui/MultiTagGenreInput/Genre";
import { SquareDropdown } from "@/components/ui/SquareDropdown/SquareDropdown";
import { ChevronDown } from "@/assets/svgs/ChevronDown";
import type { UserLikeProductListRequest } from "@hitbeatclub/shared-types/user";
import { useProductLikeFilterParametersStates } from "../hooks/useProductLikeFilterParameters";
import { LikeSortEnum } from "../types/productLikeFilterParsers";
import { GenreButton } from "@/components/ui/GenreButton";
import { CloseWhite } from "@/assets/svgs/CloseWhite";
import { SearchTag } from "@/components/ui/SearchTag";

interface ProductLikeFilterProps {
	onFilterChange: (filters: Omit<UserLikeProductListRequest, "page" | "limit">) => void;
	className?: string;
}

/**
 * 좋아요 상품 필터링 컴포넌트
 * @param onFilterChange - 필터 변경 콜백
 * @param className - 추가 CSS 클래스
 */
export const ProductLikeFilter = ({ onFilterChange, className }: ProductLikeFilterProps) => {
	const { data: searchInfo } = useQuery(getProductSearchInfoQueryOption());

	// nuqs를 사용한 쿼리 상태 관리
	const [filterParams, setFilterParams] = useProductLikeFilterParametersStates();

	// 로컬 상태 관리 - useMemo로 최적화
	const searchTags = useMemo<Tag[]>(() => {
		if (!searchInfo || filterParams.tagIds.length === 0) return [];

		return filterParams.tagIds
			.map((id) => {
				const foundTag = searchInfo.tags?.find((tag) => tag.id === id);
				return foundTag
					? ({
							id,
							text: foundTag.name,
							isFromDropdown: true,
						} as Tag)
					: null;
			})
			.filter((tag): tag is Tag => tag !== null);
	}, [filterParams.tagIds, searchInfo]);

	const genreItems = useMemo<Genre[]>(() => {
		if (!searchInfo || filterParams.genreIds.length === 0) return [];

		return filterParams.genreIds
			.map((id) => {
				const foundGenre = searchInfo.genres?.find((genre) => genre.id === id);
				return foundGenre
					? ({
							id,
							text: foundGenre.name,
							isFromDropdown: true,
						} as Genre)
					: null;
			})
			.filter((genre): genre is Genre => genre !== null);
	}, [filterParams.genreIds, searchInfo]);

	const [keyValue, setKeyValue] = useState<KeyValue | undefined>(undefined);
	const [scaleValue, setScaleValue] = useState<string | null>(null);

	// 내부 입력값 상태를 분리하여 Enter 또는 검색 아이콘 클릭 시에만 필터에 반영합니다.
	const [keywordInput, setKeywordInput] = useState<string>(filterParams.search);

	// URL 파라미터(또는 외부) 변경 시 로컬 입력 동기화
	useEffect(() => {
		setKeywordInput(filterParams.search);
	}, [filterParams.search]);

	const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeywordInput(e.target.value);
	};

	const applyKeywordSearch = (value?: string) => {
		const searchValue = (value ?? keywordInput).trim();
		setFilterParams({ search: searchValue });
	};

	// nuqs 파라미터와 로컬 상태 동기화 (키/스케일만)
	useEffect(() => {
		// 키/스케일 상태 동기화
		if (filterParams.musicKey) {
			setKeyValue({ label: filterParams.musicKey, value: filterParams.musicKey });
		} else {
			setKeyValue(undefined);
		}

		if (filterParams.scaleType) {
			setScaleValue(filterParams.scaleType.toLowerCase());
		} else {
			setScaleValue(null);
		}
	}, [filterParams.musicKey, filterParams.scaleType]);

	// nuqs 파라미터를 UserLikeProductListRequest로 변환
	const userLikeProductListQuery = useMemo((): Omit<UserLikeProductListRequest, "page" | "limit"> => {
		const query: Omit<UserLikeProductListRequest, "page" | "limit"> = {
			sort: LikeSortEnum.RECENT,
		};

		// 정렬
		if (filterParams.sort !== LikeSortEnum.RECENT) {
			query.sort = filterParams.sort as "RECENT" | "NAME";
		}

		// 검색
		if (filterParams.search) {
			query.search = filterParams.search;
		}

		// 카테고리
		if (filterParams.category) {
			query.category = filterParams.category as "BEAT" | "ACAPELA";
		}

		// 장르 - 배열을 문자열로 변환
		if (filterParams.genreIds.length > 0) {
			query.genreIds = filterParams.genreIds;
		} else {
			query.genreIds = [];
		}

		// 음악 키
		if (filterParams.musicKey) {
			query.musicKey = filterParams.musicKey as any;
		}

		// 조성
		if (filterParams.scaleType) {
			query.scaleType = filterParams.scaleType as "MAJOR" | "MINOR";
		}

		// BPM
		if (filterParams.minBpm > 0) {
			query.minBpm = filterParams.minBpm;
		}
		if (filterParams.maxBpm > 0) {
			query.maxBpm = filterParams.maxBpm;
		}

		// 태그 - 배열을 문자열로 변환
		if (filterParams.tagIds.length > 0) {
			query.tagIds = filterParams.tagIds;
		} else {
			query.tagIds = [];
		}

		return query;
	}, [filterParams]);

	// 필터 변경 시 콜백 호출
	useEffect(() => {
		onFilterChange(userLikeProductListQuery);
	}, [userLikeProductListQuery, onFilterChange]);

	// 정렬 변경 핸들러
	const handleSortChange = useCallback(
		(value: string) => {
			setFilterParams({ sort: value as LikeSortEnum });
		},
		[setFilterParams],
	);

	// 검색 태그 변경 핸들러
	const handleSearchTagsChange = useCallback(
		(tags: Tag[]) => {
			setFilterParams({ tagIds: tags.map((tag) => tag.id) });
		},
		[setFilterParams],
	);

	// 장르 변경 핸들러
	const handleGenreChange = useCallback(
		(genres: Genre[]) => {
			setFilterParams({ genreIds: genres.map((genre) => genre.id) });
		},
		[setFilterParams],
	);

	// 키 변경 핸들러
	const handleKeyChange = useCallback(
		(key: KeyValue) => {
			setKeyValue(key);
			setFilterParams({ musicKey: key.value });
		},
		[setFilterParams],
	);

	// 스케일 변경 핸들러
	const handleScaleChange = useCallback(
		(scale: string) => {
			setScaleValue(scale);
			setFilterParams({ scaleType: scale.toUpperCase() });
		},
		[setFilterParams],
	);

	// 키 초기화 핸들러
	const handleKeyClear = useCallback(() => {
		setKeyValue(undefined);
		setScaleValue(null);
		setFilterParams({ musicKey: "", scaleType: "" });
	}, [setFilterParams]);

	// BPM 제출 핸들러 (드롭다운 닫힐 때만 호출)
	const handleBPMSubmit = useCallback(
		(minBpm: number | undefined, maxBpm: number | undefined) => {
			setFilterParams({
				minBpm: minBpm || 0,
				maxBpm: maxBpm || 0,
			});
		},
		[setFilterParams],
	);

	// BPM 임시 변경 핸들러 (더미 함수 - 실제로는 사용되지 않음)
	const handleMinBpmChange = useCallback(() => {}, []);
	const handleMaxBpmChange = useCallback(() => {}, []);

	// BPM 초기화 핸들러
	const handleBPMClear = useCallback(() => {
		setFilterParams({ minBpm: 0, maxBpm: 0 });
	}, [setFilterParams]);

	// 장르 제거 핸들러
	const removeGenre = useCallback(
		(genre: Genre) => {
			const newGenreIds = filterParams.genreIds.filter((id) => id !== genre.id);
			setFilterParams({ genreIds: newGenreIds });
		},
		[filterParams.genreIds, setFilterParams],
	);

	// 태그 제거 핸들러
	const removeTag = useCallback(
		(tag: Tag) => {
			const newTagIds = filterParams.tagIds.filter((id) => id !== tag.id);
			setFilterParams({ tagIds: newTagIds });
		},
		[filterParams.tagIds, setFilterParams],
	);

	// searchInfo에서 태그 목록을 맵핑
	const tagSuggestions = useMemo(() => {
		return (
			searchInfo?.tags?.map((tag) => ({
				id: tag.id,
				value: tag.name,
				count: tag.count || 0,
			})) || []
		);
	}, [searchInfo?.tags]);

	// searchInfo에서 장르 목록을 맵핑
	const genreSuggestions = useMemo(() => {
		return (
			searchInfo?.genres?.map((genre) => ({
				id: genre.id,
				value: genre.name,
				count: genre.count || 0,
			})) || []
		);
	}, [searchInfo?.genres]);

	// 정렬 옵션
	const sortOptions = [
		{ label: "Recent", value: LikeSortEnum.RECENT },
		{ label: "Name", value: LikeSortEnum.NAME },
	];

	// 카테고리 선택된 옵션 렌더링
	const renderCategorySelectedOption = (value: string) => {
		const categoryLabel = value === "BEAT" ? "BEAT" : "ACAPELA";

		return (
			<div
				className={cn(
					"px-2 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2 cursor-pointer transition-colors",
					"bg-black",
				)}
			>
				<div className={cn("text-md font-medium", "text-white")}>{categoryLabel}</div>

				<div
					onClick={(e) => {
						e.stopPropagation();
						setFilterParams({ category: "" });
					}}
				>
					<CloseWhite />
				</div>
			</div>
		);
	};

	// 카테고리 트리거 요소 가져오기
	const getCategoryTrigger = () => {
		if (filterParams.category) {
			return renderCategorySelectedOption(filterParams.category);
		}
		return <span className="font-medium leading-1.5">Category</span>;
	};

	return (
		<div className={cn("flex flex-col", className)}>
			{/* 정렬 */}

			{/* 카테고리, 장르, 키, BPM 필터 */}
			<div className="flex flex-row justify-between pt-4">
				<div className="flex gap-1">
					<TagDropdown
						trigger={getCategoryTrigger()}
						options={[
							{ label: "BEAT", value: "BEAT" },
							{ label: "ACAPELA", value: "ACAPELA" },
						]}
						onSelect={(value) => {
							// 같은 값을 다시 선택하면 해제
							const newValue = filterParams.category === value ? "" : value;
							setFilterParams({ category: newValue });
						}}
						showChevron={filterParams.category ? false : true}
					>
						{filterParams.category && renderCategorySelectedOption(filterParams.category)}
					</TagDropdown>

					{/* 장르 필터 */}
					<TagDropdown
						trigger={<span className="font-medium leading-[16px]">Genre</span>}
						options={genreSuggestions.map((genre) => ({
							label: genre.value,
							value: genre.value,
						}))}
						onSelect={(value) => {
							// 장르 suggestion에서 실제 ID 찾기
							const foundGenre = searchInfo?.genres?.find((g) => g.name === value);
							if (foundGenre) {
								const newGenre: Genre = {
									id: foundGenre.id,
									text: value,
									isFromDropdown: true,
								};
								handleGenreChange([...genreItems, newGenre]);
							}
						}}
					/>

					{/* 키 필터 */}
					<KeyDropdown
						keyValue={keyValue}
						scaleValue={scaleValue}
						onChangeKey={handleKeyChange}
						onChangeScale={handleScaleChange}
						onClear={handleKeyClear}
						asChild
					>
						{({ currentValue }) => (
							<span
								className={cn(
									"inline-flex items-center gap-0.5",
									"px-[9px] py-[2px] pr-[3px]",
									"outline-2 outline-black -outline-offset-1 rounded-[40px]",
									"cursor-pointer whitespace-nowrap font-medium leading-[16px]",
									"sm:px-[6px]",
									currentValue ? "bg-black text-white" : "bg-white text-black",
								)}
							>
								{currentValue || "Key"}
								<ChevronDown />
							</span>
						)}
					</KeyDropdown>

					{/* BPM 필터 */}
					<BPMDropdown
						minBpm={filterParams.minBpm || undefined}
						maxBpm={filterParams.maxBpm || undefined}
						onChangeMinBpm={handleMinBpmChange}
						onChangeMaxBpm={handleMaxBpmChange}
						onClear={handleBPMClear}
						onSubmit={handleBPMSubmit}
						asChild
					>
						{({ currentValue }) => (
							<span
								className={cn(
									"inline-flex items-center gap-0.5",
									"px-[9px] py-[2px] pr-[3px]",
									"outline-2 outline-black -outline-offset-1 rounded-[40px]",
									"cursor-pointer whitespace-nowrap font-medium leading-[16px]",
									"sm:px-[6px]",
									currentValue ? "bg-black text-white" : "bg-white text-black",
								)}
							>
								{currentValue || "BPM"}
								<ChevronDown />
							</span>
						)}
					</BPMDropdown>
				</div>
				<div className="flex justify-end">
					<SquareDropdown
						buttonClassName="border-x-[3px] border-y-[4px] w-[109px] h-7 justify-initial"
						optionsClassName="w-[109px] border-x-[3px] border-y-[4px]"
						optionClassName="h-7 p-0 pl-3 flex items-center text-black font-suisse text-base font-bold leading-[150%] tracking-[0.16px]"
						options={sortOptions}
						value={filterParams.sort}
						onChange={handleSortChange}
					/>
				</div>
			</div>

			{/* 키워드 검색 + 태그 입력 */}
			<div className="flex flex-row gap-2">
				{/* Keyword Search */}
				<SearchTag
					wrapperClassName="w-[146px]"
					className="placeholder:text-[--hbc-gray] placeholder:font-medium"
					placeholder="Search"
					value={keywordInput}
					onChange={handleKeywordChange}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							applyKeywordSearch();
						}
					}}
					onSearch={applyKeywordSearch}
				/>

				{/* Tag Search */}
				<MultiTagGenreInput
					type="tag"
					maxItems={5}
					placeholder="Search tag"
					allowDirectInput={true}
					suggestedItems={tagSuggestions}
					initialItems={searchTags}
					onChange={handleSearchTagsChange}
					useSearchTagTrigger={true}
				/>

				<div className="flex flex-row gap-1">
					{genreItems.map((genre) => (
						<GenreButton
							key={genre.id}
							name={genre.text}
							showDeleteButton
							className="bg-white text-black"
							onDelete={() => removeGenre(genre)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
