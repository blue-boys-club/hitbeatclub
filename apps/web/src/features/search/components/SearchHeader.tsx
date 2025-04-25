"use client";

import { Replay } from "@/assets/svgs";
import { useSearchQueryOptions } from "../hooks/useSearchQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cn } from "@/common/utils";

export const SearchHeader = () => {
	const { data, isLoading, isRefetching, refetch } = useQuery({
		...useSearchQueryOptions(),
		select: (data) => data.total,
		placeholderData: keepPreviousData,
	});

	return (
		<div className="self-stretch pl-9 pb-2px border-b-[6px] border-hbc-black inline-flex justify-start items-center gap-2.5">
			<div className="flex items-center justify-start gap-10px">
				<div className="justify-start font-bold text-black text-32px font-suisse leading-40px tracking-032px">
					SEARCH
				</div>
				<div className="justify-start font-semibold text-black text-18px font-suisse leading-160% tracking-018px">
					{data || 0} Results
				</div>
			</div>
			<button
				className={cn(isLoading || isRefetching ? "[animation:spin_1s_linear_infinite_reverse]" : "", "cursor-pointer")}
				onClick={() => {
					refetch();
				}}
			>
				<Replay />
			</button>
		</div>
	);
};
