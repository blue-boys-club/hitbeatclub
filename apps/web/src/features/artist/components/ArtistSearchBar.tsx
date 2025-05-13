"use client";
import { Grid, Menu } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { SquareDropdown } from "@/components/ui";
import { SearchTag } from "@/components/ui/SearchTag";
import { SORT_OPTIONS } from "@/features/artist/artist.constants";
import { ViewType, type ArtistSearchBarProps, type SortOption } from "@/features/artist/artist.types";
import { useRouter } from "next/navigation";
import React from "react";

const ArtistSearchBar = ({
	activeView,
	setActiveView,
	selectedSort,
	setSelectedSort,
	searchValue,
	setSearchValue,
}: ArtistSearchBarProps) => {
	const router = useRouter();

	const handleViewChange = (view: ViewType) => {
		setActiveView(view);
		router.push(`?view=${view}`);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase();
		setSearchValue(value);
	};

	const handleSortChange = (value: string) => {
		setSelectedSort(value as SortOption);
	};

	return (
		<section className={cn("py-4 flex items-center justify-between")}>
			<SearchTag
				wrapperClassName="!w-[235px] !h-[30px]"
				className="placeholder:text-[16px] placeholder:text-gray-400"
				placeholder={"My Artists 검색하기"}
				value={searchValue}
				onChange={handleSearchChange}
			/>
			<div className="flex gap-3 items-center">
				<div className="flex gap-1">
					<button
						className="cursor-pointer"
						onClick={() => handleViewChange(ViewType.GRID)}
						aria-label="그리드 보기"
					>
						<Grid fill={activeView === ViewType.GRID ? "black" : "#DFDFDF"} />
					</button>
					<button
						className="cursor-pointer"
						onClick={() => handleViewChange(ViewType.LIST)}
						aria-label="리스트 보기"
					>
						<Menu fill={activeView === ViewType.LIST ? "black" : "#DFDFDF"} />
					</button>
				</div>
				<SquareDropdown
					className="border-4px"
					buttonClassName="!w-[120px]"
					optionsClassName="border-4px"
					options={SORT_OPTIONS}
					value={selectedSort}
					onChange={handleSortChange}
				/>
			</div>
		</section>
	);
};

export default ArtistSearchBar;
