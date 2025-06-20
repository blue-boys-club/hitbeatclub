"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Search } from "@/assets/svgs/Search";
import { cn } from "@/common/utils";
import { TagDropdown } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParametersStateByKey } from "@/features/search/hooks/useSearchParameters";

interface SearchOption {
	label: string;
	value: string;
}

export const SearchBar = () => {
	return (
		<Suspense fallback={null}>
			<SearchBarClient />
		</Suspense>
	);
};

export const SearchBarClient = () => {
	const router = useRouter();
	const pathname = usePathname();
	const isSearch = pathname === "/search";
	const [searchValue, setSearchValue] = useSearchParametersStateByKey("keyword");
	const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);

	const navigateToSearch = useCallback(() => {
		if (!searchValue) return;

		const url = new URL(window.location.href);
		url.pathname = "/search";
		url.searchParams.set("search", searchValue);
		router.push(url.toString());
	}, [router, searchValue]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchValue(value);
			setSearchOptions(searchOptions.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())));
		},
		[searchOptions, setSearchValue],
	);

	const handleSearchSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!isSearch) {
				navigateToSearch();
			}
		},
		[isSearch, navigateToSearch],
	);

	const handleSearchOptionSelect = useCallback(
		(value: string) => {
			setSearchValue(value);
			if (!isSearch) {
				navigateToSearch();
			}
		},
		[isSearch, navigateToSearch, setSearchValue],
	);

	useEffect(() => {
		if (!isSearch && searchValue) {
			// preload search page
			router.prefetch(`/search?search=${searchValue}`);
		}
	}, [isSearch, router, searchValue]);

	return (
		<TagDropdown
			wrapperClassName="w-full"
			className="w-full"
			optionsClassName={cn(
				"rounded-none p-3 border-[6px] border-b-black border-x-0 border-t-0 rounded-b-[5px]",
				searchOptions.length === 0 && "hidden",
			)}
			showChevron={false}
			options={searchOptions.map((option) => ({
				...option,
				className: "rounded-[5px] text-base font-bold leading-4",
			}))}
			onSelect={handleSearchOptionSelect}
		>
			<form
				className="relative flex items-center w-full"
				onSubmit={handleSearchSubmit}
			>
				<Search
					className="absolute left-3 text-[#BDBDBD] pointer-events-none"
					aria-hidden="true"
				/>
				<Input
					className={cn(
						"border-0 border-l-[2px] outline-none rounded-none",
						"w-full min-w-80 pl-9 py-1 pr-1",
						"placeholder:text-[#BDBDBD] placeholder:text-base placeholder:font-normal placeholder:leading-4",
					)}
					placeholder="Search for artists, beats, a cappellas"
					value={searchValue ?? ""}
					onChange={handleSearchChange}
				/>
			</form>
		</TagDropdown>
	);
};
