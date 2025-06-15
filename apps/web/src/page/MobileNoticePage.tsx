"use client";

import { Search } from "@/assets/svgs";
import {
	MobileNoticeSelect,
	MobileNoticeList,
	MobileNoticePagination,
	MobileNoticePageTitle,
} from "@/features/mobile/notice/components";
import { useState } from "react";

const MobileNoticePage = () => {
	const [sortBy, setSortBy] = useState<"제목" | "날짜" | "조회수">("제목");
	return (
		<div className="px-4 pb-50px">
			<MobileNoticePageTitle title="Notice" />
			<div className="mt-13px flex flex-col">
				<div className="flex justify-between">
					<div className="h-19px flex items-center gap-1 border-b border-black">
						<input className="w-100px text-12px leading-100% font-medium focus:outline-none" />
						<Search
							width="10px"
							height="10px"
						/>
					</div>
					<MobileNoticeSelect
						value={sortBy}
						onChange={setSortBy}
					/>
				</div>
				<div className="mt-6px">
					<MobileNoticeList />
				</div>
				<div className="mt-28px">
					<MobileNoticePagination />
				</div>
			</div>
		</div>
	);
};

export default MobileNoticePage;
