"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/common/utils";
import { KeyDropdown, type KeyValue } from "@/components/ui/KeyDropdown/KeyDropdown";
import { BPMDropdown, type BPM, type BPMRange } from "@/components/ui/BPMDropdown/BPMDropdown";
import MultiTagGenreInput from "@/components/ui/MultiTagGenreInput/MultiTagGenreInput";
import { TagDropdown } from "@/components/ui/TagDropdown/TagDropdown";
import { getProductSearchInfoQueryOption } from "@/apis/product/query/product.query-option";
import { getArtistProductListQueryOption } from "@/apis/artist/query/artist.query-options";
import type { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import type { Tag } from "@/components/ui/MultiTagGenreInput/Tag";
import type { Genre } from "@/components/ui/MultiTagGenreInput/Genre";
import { Button } from "@/components/ui/Button";
import { SquareDropdown } from "@/components/ui/SquareDropdown/SquareDropdown";
import { ChevronDown } from "@/assets/svgs/ChevronDown";
import { useQueryState, useQueryStates, parseAsString, parseAsStringEnum, parseAsArrayOf, parseAsInteger } from "nuqs";

// 필터 상태 관리를 위한 nuqs 파서 정의
enum FilterStatusEnum {
	ALL = "all",
	PUBLIC = "public",
	PRIVATE = "private",
	// SOLD = "sold", // TODO: 판매완료 필터 구현 예정
}

enum SortEnum {
	RECENT = "RECENT",
	RECOMMEND = "RECOMMEND",
	// TODO: Add more sort options as needed
}

const artistProductQueryParsers = {
	status: parseAsStringEnum<FilterStatusEnum>(Object.values(FilterStatusEnum)).withDefault(FilterStatusEnum.ALL),
	sort: parseAsStringEnum<SortEnum>(Object.values(SortEnum)).withDefault(SortEnum.RECENT),
	search: parseAsString.withDefault(""),
	tags: parseAsArrayOf(parseAsString).withDefault([]),
	category: parseAsString.withDefault(""),
	genreIds: parseAsString.withDefault(""),
	musicKey: parseAsString.withDefault(""),
	scaleType: parseAsString.withDefault(""),
	minBpm: parseAsInteger.withDefault(0),
	maxBpm: parseAsInteger.withDefault(0),
	page: parseAsInteger.withDefault(1),
	limit: parseAsInteger.withDefault(10),
};

interface ArtistProductListFilterProps {
	artistId: number;
	onDataChange?: (data: any) => void; // 조회된 데이터를 외부로 전달하는 콜백
	className?: string;
}

/**
 * 아티스트 상품 목록 필터링 컴포넌트
 * @param artistId - 아티스트 ID
 * @param onDataChange - 데이터 변경 콜백
 * @param className - 추가 CSS 클래스
 */
export const ArtistProductListFilter = ({ artistId, onDataChange, className }: ArtistProductListFilterProps) => {
	const { data: searchInfo } = useQuery(getProductSearchInfoQueryOption());

	// nuqs를 사용한 쿼리 상태 관리
	const [filterParams, setFilterParams] = useQueryStates(artistProductQueryParsers);

	// 로컬 상태 관리
	const [searchTags, setSearchTags] = useState<Tag[]>([]);
	const [genreItems, setGenreItems] = useState<Genre[]>([]);
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>(undefined);
	const [scaleValue, setScaleValue] = useState<string | null>(null);
	const [bpmValue, setBpmValue] = useState<BPM>(undefined);
	const [bpmRangeValue, setBpmRangeValue] = useState<BPMRange>(undefined);

	// nuqs 파라미터를 ArtistProductListQueryRequest로 변환
	const artistProductListQuery = useMemo((): ArtistProductListQueryRequest => {
		const query: ArtistProductListQueryRequest = {
			page: filterParams.page,
			limit: filterParams.limit,
		};

		// 정렬
		if (filterParams.sort !== SortEnum.RECENT) {
			query.sort = filterParams.sort as "RECENT" | "RECOMMEND" | "null";
		}

		// 공개/비공개 상태
		if (filterParams.status === FilterStatusEnum.PUBLIC) {
			query.isPublic = true;
		} else if (filterParams.status === FilterStatusEnum.PRIVATE) {
			query.isPublic = false;
		} else {
			query.isPublic = undefined;
		}
		// ALL인 경우 isPublic을 설정하지 않음

		// 카테고리
		if (filterParams.category) {
			query.category = filterParams.category as "BEAT" | "ACAPELA" | "null";
		}

		// 장르
		if (filterParams.genreIds) {
			query.genreIds = filterParams.genreIds;
		}

		// 음악 키
		if (filterParams.musicKey) {
			query.musicKey = filterParams.musicKey as any;
		}

		// 조성
		if (filterParams.scaleType) {
			query.scaleType = filterParams.scaleType as "MAJOR" | "MINOR" | "null";
		}

		// BPM
		if (filterParams.minBpm > 0) {
			query.minBpm = filterParams.minBpm;
		}
		if (filterParams.maxBpm > 0) {
			query.maxBpm = filterParams.maxBpm;
		}

		// 태그 - tags 배열을 tagIds로 변환 (실제로는 태그 이름을 ID로 매핑해야 함)
		if (filterParams.tags.length > 0) {
			// TODO: 태그 이름을 ID로 변환하는 로직 필요
			query.tagIds = filterParams.tags.join(",");
		}

		return query;
	}, [filterParams]);

	// 아티스트 상품 목록 조회
	const {
		data: productListData,
		isLoading,
		error,
	} = useQuery(getArtistProductListQueryOption(artistId, artistProductListQuery));

	// 데이터 변경 시 콜백 호출
	useEffect(() => {
		onDataChange?.(productListData);
	}, [productListData, onDataChange]);

	// 필터 상태 버튼 핸들러
	const handleStatusFilter = useCallback(
		(status: FilterStatusEnum) => {
			setFilterParams({ status, page: 1 }); // 필터 변경 시 첫 페이지로 리셋
		},
		[setFilterParams],
	);

	// 정렬 변경 핸들러
	const handleSortChange = useCallback(
		(value: string) => {
			setFilterParams({ sort: value as SortEnum, page: 1 });
		},
		[setFilterParams],
	);

	// 검색 태그 변경 핸들러
	const handleSearchTagsChange = useCallback(
		(tags: Tag[]) => {
			setSearchTags(tags);
			setFilterParams({ tags: tags.map((tag) => tag.text), page: 1 });
		},
		[setFilterParams],
	);

	// 장르 변경 핸들러
	const handleGenreChange = useCallback(
		(genres: Genre[]) => {
			setGenreItems(genres);
			// TODO: 장르 이름을 ID로 변환하는 로직 필요
			const genreIds = genres
				.map((genre) => {
					// 임시로 searchInfo에서 장르 ID 찾기
					const foundGenre = searchInfo?.genres?.find((g) => g.name === genre.text);
					return foundGenre?.id.toString() || "";
				})
				.filter(Boolean)
				.join(",");

			setFilterParams({ genreIds, page: 1 });
		},
		[setFilterParams, searchInfo?.genres],
	);

	// 키 변경 핸들러
	const handleKeyChange = useCallback(
		(key: KeyValue) => {
			setKeyValue(key);
			setFilterParams({ musicKey: key.value, page: 1 });
		},
		[setFilterParams],
	);

	// 스케일 변경 핸들러
	const handleScaleChange = useCallback(
		(scale: string) => {
			setScaleValue(scale);
			setFilterParams({ scaleType: scale.toUpperCase(), page: 1 });
		},
		[setFilterParams],
	);

	// 키 초기화 핸들러
	const handleKeyClear = useCallback(() => {
		setKeyValue(undefined);
		setScaleValue(null);
		setFilterParams({ musicKey: "", scaleType: "", page: 1 });
	}, [setFilterParams]);

	// BPM 타입 변경 핸들러
	const handleBPMTypeChange = useCallback(
		(type: "exact" | "range") => {
			setBpmValue(undefined);
			setBpmRangeValue(undefined);
			setFilterParams({ minBpm: 0, maxBpm: 0, page: 1 });
		},
		[setFilterParams],
	);

	// 정확한 BPM 변경 핸들러
	const handleExactBPMChange = useCallback(
		(bpm: number) => {
			setBpmValue(bpm);
			setFilterParams({ minBpm: bpm, maxBpm: bpm, page: 1 });
		},
		[setFilterParams],
	);

	// BPM 범위 변경 핸들러
	const handleBPMRangeChange = useCallback(
		(type: "min" | "max", bpm: number) => {
			setBpmRangeValue((prev) => ({ ...prev, [type]: bpm }));
			setFilterParams({ [`${type}Bpm`]: bpm, page: 1 });
		},
		[setFilterParams],
	);

	// BPM 초기화 핸들러
	const handleBPMClear = useCallback(() => {
		setBpmValue(undefined);
		setBpmRangeValue(undefined);
		setFilterParams({ minBpm: 0, maxBpm: 0, page: 1 });
	}, [setFilterParams]);

	// searchInfo에서 태그 목록을 맵핑
	const tagSuggestions = useMemo(() => {
		return (
			searchInfo?.tags?.map((tag) => ({
				value: tag.name,
				count: 0, // TODO: Add count from API if available
			})) || []
		);
	}, [searchInfo?.tags]);

	// searchInfo에서 장르 목록을 맵핑
	const genreSuggestions = useMemo(() => {
		return (
			searchInfo?.genres?.map((genre) => ({
				value: genre.name,
				count: 0, // TODO: Add count from API if available
			})) || []
		);
	}, [searchInfo?.genres]);

	// 정렬 옵션
	const sortOptions = [
		{ label: "Recent", value: SortEnum.RECENT },
		{ label: "Recommend", value: SortEnum.RECOMMEND },
	];

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{/* 상태 필터 및 정렬 */}
			<div className="pt-4 flex justify-between">
				<div className="flex gap-1">
					<Button
						size="sm"
						variant="outline"
						className={cn(
							"rounded-none border-4",
							filterParams.status === FilterStatusEnum.ALL && "bg-black text-white",
						)}
						onClick={() => handleStatusFilter(FilterStatusEnum.ALL)}
					>
						ALL
					</Button>
					<Button
						size="sm"
						variant="outline"
						rounded="full"
						className={cn("border-4", filterParams.status === FilterStatusEnum.PUBLIC && "bg-black text-white")}
						onClick={() => handleStatusFilter(FilterStatusEnum.PUBLIC)}
					>
						공개
					</Button>
					<Button
						size="sm"
						variant="outline"
						rounded="full"
						className={cn("border-4", filterParams.status === FilterStatusEnum.PRIVATE && "bg-black text-white")}
						onClick={() => handleStatusFilter(FilterStatusEnum.PRIVATE)}
					>
						비공개
					</Button>
					{/* TODO: 판매완료 필터 구현 예정 
					<Button
						size="sm"
						variant="outline"
						rounded="full"
						className={cn("border-4", filterParams.status === FilterStatusEnum.SOLD && "bg-black text-white")}
						onClick={() => handleStatusFilter(FilterStatusEnum.SOLD)}
					>
						판매완료
					</Button>
					*/}
				</div>
				<SquareDropdown
					buttonClassName="border-x-[3px] border-y-[4px] w-[109px] h-7 justify-initial"
					optionsClassName="w-[109px] border-x-[3px] border-y-[4px]"
					optionClassName="h-7 p-0 pl-3 flex items-center text-black font-suisse text-base font-bold leading-[150%] tracking-[0.16px]"
					options={sortOptions}
					onChange={handleSortChange}
				/>
			</div>

			{/* 카테고리, 장르, 키, BPM 필터 */}
			<div className="flex gap-1">
				<TagDropdown
					trigger={<span className="font-medium leading-[16px]">Category</span>}
					options={[]}
				/>

				{/* 장르 필터 - TagDropdown 스타일의 커스텀 트리거 */}
				<TagDropdown
					trigger={<span className="font-medium leading-[16px]">Genre</span>}
					options={genreSuggestions.map((genre) => ({
						label: genre.value,
						value: genre.value,
					}))}
					onSelect={(value) => {
						const newGenre: Genre = {
							id: crypto.randomUUID(),
							text: value,
							isFromDropdown: true,
						};
						handleGenreChange([...genreItems, newGenre]);
					}}
				/>

				{/* 키 필터 - KeyDropdown의 커스텀 트리거 (TagDropdown 스타일로 통일) */}
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

				{/* BPM 필터 - BPMDropdown의 커스텀 트리거 (TagDropdown 스타일로 통일) */}
				<BPMDropdown
					bpmType="exact" // TODO: BPM 타입을 쿼리 파라미터로 관리 필요
					bpmValue={bpmValue}
					bpmRangeValue={bpmRangeValue}
					onChangeBPMType={handleBPMTypeChange}
					onChangeExactBPM={handleExactBPMChange}
					onChangeBPMRange={handleBPMRangeChange}
					onClear={handleBPMClear}
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

			{/* 검색 태그 - SearchTag 트리거 사용 */}
			<div>
				<MultiTagGenreInput
					type="tag"
					maxItems={5}
					placeholder="Search tag"
					allowDirectInput={true}
					suggestedItems={tagSuggestions}
					onChange={handleSearchTagsChange}
					useSearchTagTrigger={true}
				/>
			</div>

			{/* 로딩 및 에러 상태 표시 */}
			<div className="text-sm text-gray-600">
				{isLoading && "Loading..."}
				{error && "Error loading products"}
				{productListData && (
					<span>
						{productListData.data?.length || 0} products found
						{productListData._pagination &&
							` (Page ${productListData._pagination.page} of ${Math.ceil(productListData._pagination.total / productListData._pagination.limit)})`}
					</span>
				)}
			</div>
		</div>
	);
};
