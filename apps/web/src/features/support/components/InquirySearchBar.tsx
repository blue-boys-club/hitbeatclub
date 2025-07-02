"use client";
import { SquareDropdown } from "@/components/ui";
import { SearchTag } from "@/components/ui/SearchTag";
import { inquiryDropdownOptions } from "../support.constants";
import { InquirySearchBarProps, InquirySortOption } from "../support.types";
import { useRef } from "react";
import { useEffect } from "react";

export const InquirySearchBar = ({
	searchValue,
	setSearchValue,
	selectedSort,
	setSelectedSort,
	onSearch,
}: InquirySearchBarProps) => {
	const searchRef = useRef<HTMLInputElement>(null);

	const handleSortChange = (value: string) => {
		setSelectedSort(value as InquirySortOption);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onSearch?.();
		}
	};

	const handleSearch = () => {
		onSearch?.();
	};

	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus();
		}
	}, []);

	return (
		<section className="pt-[14px] pb-6 flex justify-end items-center">
			<div className="flex gap-5 items-end">
				<SquareDropdown
					optionClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-suit"
					buttonClassName="border-x-0 border-t-0 border-b-6 px-0 w-[77px]"
					placeholderClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-suit"
					svgClassName="ml-0"
					options={inquiryDropdownOptions}
					value={selectedSort}
					onChange={handleSortChange}
				/>
				<SearchTag
					ref={searchRef}
					wrapperClassName="rounded-none outline-none border-b-6 border-x-0 border-t-0 pb-3 size-fit pb-0"
					className="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-suit"
					buttonClassName="w-5 h-5 p-0"
					placeholder="Search"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onSearch={handleSearch}
					onKeyPress={handleKeyPress}
				/>
			</div>
		</section>
	);
};
