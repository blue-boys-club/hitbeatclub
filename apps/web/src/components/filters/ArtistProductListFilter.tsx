"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/common/utils";
import { KeyDropdown, type KeyValue } from "@/components/ui/KeyDropdown/KeyDropdown";
import { BPMDropdown } from "@/components/ui/BPMDropdown/BPMDropdown";
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
import { useArtistProductParametersStates } from "@/features/artist/hooks/useArtistProductParameters";
import { FilterStatusEnum, SortEnum } from "@/features/artist/types/artistProductParsers";
import { GenreButton } from "../ui/GenreButton";
import { CloseWhite } from "@/assets/svgs/CloseWhite";

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
	const [filterParams, setFilterParams] = useArtistProductParametersStates();

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
		} else {
			query.genreIds = [];
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
		if (filterParams.tagIds.length > 0) {
			// TODO: 태그 이름을 ID로 변환하는 로직 필요
			query.tagIds = filterParams.tagIds;
		} else {
			query.tagIds = [];
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
			setFilterParams({ tagIds: tags.map((tag) => tag.id), page: 1 });
		},
		[setFilterParams],
	);

	// 장르 변경 핸들러
	const handleGenreChange = useCallback(
		(genres: Genre[]) => {
			setFilterParams({ genreIds: genres.map((genre) => genre.id), page: 1 });
		},
		[setFilterParams],
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

	// BPM 제출 핸들러 (드롭다운 닫힐 때만 호출)
	const handleBPMSubmit = useCallback(
		(minBpm: number | undefined, maxBpm: number | undefined) => {
			setFilterParams({
				minBpm: minBpm || 0,
				maxBpm: maxBpm || 0,
				page: 1,
			});
		},
		[setFilterParams],
	);

	// BPM 임시 변경 핸들러 (더미 함수 - 실제로는 사용되지 않음)
	const handleMinBpmChange = useCallback(() => {}, []);
	const handleMaxBpmChange = useCallback(() => {}, []);

	// BPM 초기화 핸들러
	const handleBPMClear = useCallback(() => {
		setFilterParams({ minBpm: 0, maxBpm: 0, page: 1 });
	}, [setFilterParams]);

	const removeGenre = useCallback(
		(genre: Genre) => {
			const newGenreIds = filterParams.genreIds.filter((id) => id !== genre.id);
			setFilterParams({ genreIds: newGenreIds, page: 1 });
		},
		[filterParams.genreIds, setFilterParams],
	);

	const removeTag = useCallback(
		(tag: Tag) => {
			const newTagIds = filterParams.tagIds.filter((id) => id !== tag.id);
			setFilterParams({ tagIds: newTagIds, page: 1 });
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
		{ label: "Recent", value: SortEnum.RECENT },
		{ label: "Recommend", value: SortEnum.RECOMMEND },
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

				{/* 장르 필터 - TagDropdown 스타일의 커스텀 트리거 */}
				<TagDropdown
					trigger={<span className="font-medium leading-1.5">Genre</span>}
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
								"cursor-pointer whitespace-nowrap font-medium leading-1.5",
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
								"cursor-pointer whitespace-nowrap font-medium leading-1.5",
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
			<div className="flex flex-row gap-2">
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

			{/* 로딩 및 에러 상태 표시 */}
			<div className="text-sm text-gray-600">
				{isLoading && "Loading..."}
				{error && "Error loading products"}
			</div>
		</div>
	);
};
