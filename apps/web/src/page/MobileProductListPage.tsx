"use client";

import { Plus } from "@/assets/svgs";
import { MobileProductListFilter } from "@/features/mobile/product/components/MobileProductListFilter";
import { MobileProductList } from "@/features/mobile/product/components/MobileProductList";
import { memo, useState } from "react";
import { getSearchQueryOption } from "@/apis/search/query/search.query-option";
import { useQuery } from "@tanstack/react-query";
import { ProductSearchQuery } from "@/apis/search/search.type";

interface MobileProductListPageProps {
	title: string;
	filter?: boolean;
	category: "ACAPELA" | "BEAT" | "null";
	sort: "RECENT" | "RECOMMEND" | "null";
}

const MobileProductListPage = memo(({ title, filter, category, sort }: MobileProductListPageProps) => {
	const [isShowFilter, setIsShowFilter] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState<Partial<ProductSearchQuery>>({});

	const { data } = useQuery({
		...getSearchQueryOption({
			category,
			page: 1,
			limit: 10,
			sort,
			...appliedFilters,
		}),
	});

	const handleApplyFilter = (filters: Partial<ProductSearchQuery>) => {
		setAppliedFilters(filters);
		// useQuery는 queryKey 변경을 감지하여 자동으로 재실행되므로 refetch() 불필요
	};

	return (
		<div className="px-4 pb-2 space-y-3">
			<div className="flex justify-between items-center">
				<span className="font-suisse text-22px leading-24px font-bold">{title}</span>
				{filter && (
					<button
						className="h-6 bg-[#dadada] px-2 flex items-center gap-6px text-14px leading-16px font-semibold rounded-40px"
						onClick={() => setIsShowFilter((prev) => !prev)}
					>
						<span className="font-suisse">Filters</span>
						<Plus
							width="11px"
							height="11px"
							stroke="black"
						/>
					</button>
				)}
			</div>
			<div className="w-full h-6px bg-black" />
			<MobileProductList
				products={data?.products || []}
				artists={data?.artists || []}
			/>
			{isShowFilter && (
				<MobileProductListFilter
					onClose={() => setIsShowFilter(false)}
					onApplyFilter={handleApplyFilter}
					initialFilters={appliedFilters}
				/>
			)}
		</div>
	);
});

MobileProductListPage.displayName = "MobileProductListPage";

export default MobileProductListPage;
