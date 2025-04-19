import { Search } from "@/assets/svgs";
import { SquareDropdown } from "@/components/ui";
import { memo, useCallback } from "react";

interface SearchProps {
	search?: string;
	onSearchChange?: (search: string) => void;
	sort?: "recent" | "name";
	onSortChange?: (sort: "recent" | "name") => void;
}

export const SidebarSearch = memo(({ search, onSearchChange, sort, onSortChange }: SearchProps) => {
	const onSortChangeCallback = useCallback(
		(value: string) => {
			onSortChange?.(value as "recent" | "name");
		},
		[onSortChange],
	);

	const onSearchChangeCallback = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onSearchChange?.(e.target.value);
		},
		[onSearchChange],
	);

	return (
		<div className="relative flex items-start justify-between w-full bg-white border-l-2 border-black mt-7px font-suisse whitespace-nowrap">
			<div className="z-0 flex items-center justify-start flex-grow w-auto px-8px py-5px gap-10px">
				{/* <img
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/002407c5c21df51f51441268bdc572ac5240938b"
					alt="Search icon"
					className="self-stretch flex-shrink-0 object-contain object-center my-auto aspect-square w-18px"
				/> */}
				{/* <div className="self-stretch my-auto w-54px">Search</div> */}
				<Search />
				<input
					className="self-stretch my-auto w-full placeholder:text-hbc-gray text-16px font-semibold font-suisse placeholder:font-suisse placeholder:font-[450]"
					value={search}
					placeholder="Search"
					onChange={onSearchChangeCallback}
				/>
			</div>
			<SquareDropdown
				buttonClassName="border-t-0px border-r-0px border-b-0px"
				optionsClassName="border-t-0px border-r-0px border-l-4px border-b-2px"
				value={sort}
				onChange={onSortChangeCallback}
				options={[
					{
						label: "최신순",
						value: "recent",
					},
					{
						label: "이름순",
						value: "name",
					},
				]}
			/>
		</div>
	);
});

SidebarSearch.displayName = "SidebarSearch";
