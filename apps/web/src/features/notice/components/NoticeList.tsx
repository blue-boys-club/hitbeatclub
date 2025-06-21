"use client";
import { generateDateObj } from "@/common/utils";
import { useRouter } from "next/navigation";
import { NoticeListProps } from "../notice.types";
import { Pagination } from "./Pagination";

export const NoticeList = ({ data, currentPage = 1, onPageChange }: NoticeListProps) => {
	const navigate = useRouter();

	// 페이지네이션 정보 추출
	const { page, totalPage, total } = data._pagination;

	return (
		<section className="pb-12">
			<table className="w-full">
				<thead>
					<tr className="border-b-6 border-black text-left text-hbc-black font-[SUIT] text-lg font-extrabold leading-[24px] tracking-[-0.32px]">
						<th>NO.</th>
						<th className="pb-1 px-14 w-[1300px]">제목</th>
						<th className="pb-1 px-2 whitespace-nowrap">작성일</th>
						<th className="pb-1 px-2 whitespace-nowrap">조회수</th>
					</tr>
				</thead>
				<tbody>
					{data.data.map((notice) => {
						const { year, month, date } = generateDateObj(notice.createdAt);
						const createdAt = `${year.substring(2, 4)}.${month}.${date}`;
						return (
							<tr
								key={notice.id}
								className="border-b-2 border-black text-hbc-black font-[SUIT] text-lg font-extrabold leading-[24px] tracking-[-0.32px] hover:bg-hbc-black hover:text-hbc-white cursor-pointer select-none"
								onClick={() => navigate.push(`/notices/${notice.id}`)}
							>
								<td className="py-[10px]">{String(notice.id).padStart(3, "0")}</td>
								<td className="py-[10px] px-14 truncate">{notice.title}</td>
								<td className="py-[10px] px-2">{createdAt}</td>
								<td className="py-[10px] px-2">{notice.viewCount}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* 페이지네이션 컴포넌트 */}
			<Pagination
				currentPage={currentPage}
				totalPage={totalPage}
				total={total}
				onPageChange={onPageChange || (() => {})}
				itemName="공지사항"
			/>
		</section>
	);
};
