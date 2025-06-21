import { generateDateObj } from "@/common/utils";
import { NoticeDetailHeaderProps } from "../notice.types";

export const NoticeDetailHeader = ({ data }: NoticeDetailHeaderProps) => {
	const { year, month, date } = generateDateObj(data.createdAt);
	const createdAt = `${year}/${month}/${date}`;
	return (
		<header>
			<div className="px-8 pb-3 border-b-6 border-black flex justify-start items-center text-black font-bold text-[31px] leading-[46px] tracking-[0.31px] uppercase font-['Suisse_Intl']">
				{data.title}
			</div>
			<div className="flex justify-between items-center px-5 py-2 border-b-6 border-black">
				<div className="text-hbc-black font-['Suisse_Intl'] text-[20px] font-extrabold leading-[28px] tracking-[0.2px]">
					{createdAt}
				</div>
				<div className="text-hbc-black font-['Suisse_Intl'] text-[20px] font-extrabold leading-[28px] tracking-[0.2px]">
					{data.viewCount} VIEWS
				</div>
			</div>
		</header>
	);
};
