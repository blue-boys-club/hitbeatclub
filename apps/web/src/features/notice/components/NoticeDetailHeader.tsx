import { checkIsPureEnglish, cn, generateDateObj } from "@/common/utils";
import { NoticeDetailHeaderProps } from "../notice.types";

export const NoticeDetailHeader = ({ data }: NoticeDetailHeaderProps) => {
	const { year, month, date } = generateDateObj(data.createdAt);
	const createdAt = `${year}/${month}/${date}`;
	return (
		<header>
			<div
				className={cn(
					"px-8 pb-3 border-b-6 border-black flex justify-start items-center text-black font-bold text-[31px] leading-[46px] tracking-[0.31px] uppercase font-suit",
					checkIsPureEnglish(data.title) && "font-suisse",
				)}
			>
				{data.title}
			</div>
			<div className="flex justify-between items-center px-5 py-2 border-b-6 border-black">
				<div
					className={cn(
						"text-hbc-black font-suit text-[20px] font-extrabold leading-[28px] tracking-[0.2px]",
						checkIsPureEnglish(createdAt) && "font-suisse",
					)}
				>
					{createdAt}
				</div>
				<div className="text-hbc-black font-suit text-[20px] font-extrabold leading-[28px] tracking-[0.2px]">
					{data.viewCount} VIEWS
				</div>
			</div>
		</header>
	);
};
