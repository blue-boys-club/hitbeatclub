import Link from "next/link";
import { NoticeListResponse } from "@hitbeatclub/shared-types/notice";

interface MobileNoticeListProps {
	notices: NoticeListResponse[];
	isLoading: boolean;
	error: Error | null;
}

export const MobileNoticeList = ({ notices, isLoading, error }: MobileNoticeListProps) => {
	if (isLoading) {
		return (
			<div className="flex flex-col">
				{Array.from({ length: 10 }).map((_, index) => (
					<div
						key={index}
						className="h-28px border-t-2px border-black flex items-center gap-10px animate-pulse"
					>
						<div className="w-30px h-14px bg-gray-200 rounded"></div>
						<div className="flex-1 h-14px bg-gray-200 rounded"></div>
						<div className="w-50px h-14px bg-gray-200 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<span className="text-14px text-red-500">공지사항을 불러오는 중 오류가 발생했습니다.</span>
			</div>
		);
	}

	if (notices.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<span className="text-14px text-gray-500">공지사항이 없습니다.</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{notices.map((notice, index) => (
				<MobileNoticeListItem
					key={notice.id}
					id={Number(notice.id)}
					number={String(index + 1).padStart(2, "0")}
					title={notice.title}
					date={new Date(notice.createdAt)
						.toLocaleDateString("ko-KR", {
							year: "2-digit",
							month: "2-digit",
							day: "2-digit",
						})
						.replace(/\./g, ".")
						.slice(0, -1)}
				/>
			))}
		</div>
	);
};

interface MobileNoticeListItemProps {
	id: number;
	number: string;
	title: string;
	date: string;
}

export const MobileNoticeListItem = ({ id, number, title, date }: MobileNoticeListItemProps) => {
	return (
		<Link
			href={`/mobile/notice/${id}`}
			className="h-28px border-t-2px border-black flex items-center gap-10px"
		>
			<span className="w-30px text-14px font-medium leading-100%">{number}</span>
			<span className="flex-1 text-14px font-bold leading-100%">{title}</span>
			<span className="text-14px font-medium leading-100%">{date}</span>
		</Link>
	);
};
