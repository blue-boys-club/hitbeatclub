"use client";
import { SquareDropdown } from "@/components/ui";
import { SearchTag } from "@/components/ui/SearchTag";
import { noticeDropdownOptions } from "../notice.constants";

const NoticeSearchBar = () => {
	return (
		<section className="pt-[14px] pb-6 flex justify-end items-center">
			<div className="flex gap-5 items-end">
				<SquareDropdown
					optionClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-[SUIT]"
					buttonClassName="border-x-0 border-t-0 border-b-6 pl-[13px] w-[98px]"
					placeholderClassName="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-[SUIT]"
					options={noticeDropdownOptions}
				/>
				<SearchTag
					wrapperClassName="rounded-none border-b-6 border-x-0 border-t-0 pb-3"
					className="text-black font-extrabold text-[20px] leading-[28px] tracking-[0.2px] font-[SUIT]"
					buttonClassName="w-5 h-5 p-0"
					placeholder="Search"
				/>
			</div>
		</section>
	);
};

export default NoticeSearchBar;
