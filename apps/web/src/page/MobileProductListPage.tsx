"use client";

import { Plus } from "@/assets/svgs";
import { MobileProductListFilter } from "@/features/mobile/product/components/MobileProductListFilter";
import { MobileProductList } from "@/features/mobile/product/components/MobileProductList";
import { memo, useState } from "react";

interface MobileProductListPageProps {
	title: string;
	filter?: boolean;
}

const MobileProductListPage = memo(({ title, filter }: MobileProductListPageProps) => {
	const [isShowFilter, setIsShowFilter] = useState(false);
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
			<MobileProductList />
			{isShowFilter && <MobileProductListFilter onClose={() => setIsShowFilter(false)} />}
		</div>
	);
});

MobileProductListPage.displayName = "MobileProductListPage";

export default MobileProductListPage;
