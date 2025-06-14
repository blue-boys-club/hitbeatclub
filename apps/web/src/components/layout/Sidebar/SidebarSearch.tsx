import { Search } from "@/assets/svgs";
import { SquareDropdown } from "@/components/ui";
import { memo, useCallback, useEffect, useState } from "react";

interface SearchProps {
	search?: string;
	onSearchChange?: (search: string) => void;
	sort?: "RECENT" | "NAME";
	onSortChange?: (sort: "RECENT" | "NAME") => void;
	debounceMs?: number; // 디바운스 지연 시간 (기본값: 300ms)
}

export const SidebarSearch = memo(({ search, onSearchChange, sort, onSortChange, debounceMs = 300 }: SearchProps) => {
	// 로컬 입력 상태 (즉시 반응)
	const [inputValue, setInputValue] = useState(search || "");

	// 외부 search prop이 변경되면 로컬 상태도 동기화
	useEffect(() => {
		setInputValue(search || "");
	}, [search]);

	// 디바운스 적용: inputValue가 변경되면 일정 시간 후 onSearchChange 호출
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (onSearchChange && inputValue !== search) {
				onSearchChange(inputValue);
			}
		}, debounceMs);

		// 클린업: 새로운 입력이 들어오면 이전 타이머 취소
		return () => clearTimeout(timeoutId);
	}, [inputValue, onSearchChange, search, debounceMs]);

	const onSortChangeCallback = useCallback(
		(value: string) => {
			onSortChange?.(value as "RECENT" | "NAME");
		},
		[onSortChange],
	);

	const onSearchChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		// 로컬 상태만 즉시 업데이트 (UI 반응성)
		setInputValue(e.target.value);
	}, []);

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
					value={inputValue}
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
						value: "RECENT",
					},
					{
						label: "이름순",
						value: "NAME",
					},
				]}
			/>
		</div>
	);
});

SidebarSearch.displayName = "SidebarSearch";
