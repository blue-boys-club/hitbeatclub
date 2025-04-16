"use client";

import React, { useState, useCallback } from "react";
import { Search } from "@/assets/svgs/Search";
import { cn } from "@/common/utils";
import { TagDropdown } from "@/components/ui";
import { Input } from "@/components/ui/Input";

interface SearchOption {
	label: string;
	value: string;
}

export const SearchBar = () => {
	const [searchValue, setSearchValue] = useState("");
	const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value);
			const filteredOptions = searchOptions.filter((option) =>
				option.label.toLowerCase().includes(e.target.value.toLowerCase()),
			);
			setSearchOptions(filteredOptions);
		},
		[searchOptions],
	);

	const handleSearchSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
		},
		[searchValue],
	);

	return (
		<TagDropdown
			optionsClassName={"rounded-none p-3 border-[6px] border-b-black border-x-0 border-t-0 rounded-b-[5px]"}
			showChevron={false}
			options={searchOptions.map((option) => {
				return {
					...option,
					className: "rounded-[5px] text-base font-bold leading-4",
				};
			})}
		>
			<form
				className={cn("relative flex items-center w-full")}
				onSubmit={handleSearchSubmit}
			>
				<Search
					className={cn("absolute left-3 text-[#BDBDBD] pointer-events-none")}
					aria-hidden="true"
				/>
				<Input
					className={cn(
						"border-0 border-l-[2px] outline-none rounded-none",
						"w-full min-w-80 pl-9 py-1 pr-1",
						"placeholder:text-[#BDBDBD] placeholder:text-base placeholder:font-normal placeholder:leading-4",
					)}
					placeholder="Search for artists, beats, a cappellas"
					value={searchValue}
					onChange={handleSearchChange}
				/>
			</form>
		</TagDropdown>
	);
};
