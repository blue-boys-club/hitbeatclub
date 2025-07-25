"use client";
import { SquareDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { SearchTag } from "@/components/ui/SearchTag";
import { noticeDropdownOptions } from "../notice.constants";
import { NoticeSearchBarProps, SortOption } from "../notice.types";
import { useRef } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const NoticeSearchBar = ({
	searchValue,
	setSearchValue,
	selectedSort,
	setSelectedSort,
	onSearch,
}: NoticeSearchBarProps) => {
	const router = useRouter();
	const handleSortChange = (value: string) => {
		setSelectedSort(value as SortOption);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onSearch?.();
		}
	};
	const handleSearch = () => {
		onSearch?.();
	};
	const searchRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus();
		}
	}, []);

	return (
		<section className="pt-[14px] pb-6 flex justify-end items-center">
			<div className="flex gap-5 items-end">
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={() => router.push("/notices/create")}
				>
					등록
				</Button>
				<SquareDropdown
					optionClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-suit"
					buttonClassName="border-x-0 border-t-0 border-b-6 px-0 w-[77px]"
					placeholderClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-suit"
					svgClassName="ml-0"
					options={noticeDropdownOptions}
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
