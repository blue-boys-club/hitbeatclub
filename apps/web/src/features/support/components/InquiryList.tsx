"use client";

import { useRouter } from "next/navigation";
import { InquiryListProps } from "../support.types";
import { Pagination } from "@/features/notice/components/Pagination";
import moment from "moment";

export const InquiryList = ({ data, currentPage = 1, onPageChange }: InquiryListProps) => {
	const navigate = useRouter();

	// 페이지네이션은 일단 임시로 설정 (API에서 페이지네이션 지원 시 수정 필요)
	const totalItems = data.length;
	const itemsPerPage = 10;
	const totalPage = Math.ceil(totalItems / itemsPerPage);

	return (
		<section className="pb-12 overflow-hidden">
			<table className="w-full table-fixed">
				<thead>
					<tr className="border-b-6 border-black text-left text-hbc-black font-[SUIT] text-lg font-extrabold leading-[24px] tracking-[-0.32px]">
						<th className="w-20 pb-1 px-2">NO.</th>
						<th className="w-32 pb-1 px-4">이름</th>
						<th className="pb-1 px-4">문의 내용</th>
						<th className="w-28 pb-1 px-2">작성일</th>
					</tr>
				</thead>
				<tbody>
					{data.map((inquiry, index) => {
						const displayNumber = totalItems - index;
						return (
							<tr
								key={inquiry.id}
								className="border-b-2 border-black text-hbc-black font-[SUIT] text-lg font-extrabold leading-[24px] tracking-[-0.32px] hover:bg-hbc-black hover:text-hbc-white cursor-pointer select-none"
								onClick={() => navigate.push(`/support/inquiries/${inquiry.id}`)}
							>
								<td className="py-[10px] px-2">{String(displayNumber).padStart(3, "0")}</td>
								<td className="py-[10px] px-4 truncate">{inquiry.name}</td>
								<td className="py-[10px] px-4 truncate">{inquiry.content}</td>
								<td className="py-[10px] px-2">{moment(inquiry.createdAt).format("YY.MM.DD")}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* TODO: API에서 페이지네이션 지원 시 수정 필요 */}
			<Pagination
				currentPage={currentPage}
				totalPage={totalPage}
				total={totalItems}
				onPageChange={onPageChange || (() => {})}
				itemName="문의사항"
			/>
		</section>
	);
};
