"use client";

import { useQuery } from "@tanstack/react-query";
import { getInquiryDetailQueryOption } from "@/apis/inquiry/query/inquiry.query-options";
import { generateDateObj } from "@/common/utils";
import { useParams, useRouter } from "next/navigation";

const InquiryDetailPage = () => {
	const router = useRouter();
	const { inquiryId } = useParams();

	const { data: inquiry, isPending, isError } = useQuery(getInquiryDetailQueryOption(Number(inquiryId)));

	if (isPending) return <div>로딩 중...</div>;
	if (isError || !inquiry) return <div>문의를 찾을 수 없습니다.</div>;

	const { year, month, date } = generateDateObj(new Date(inquiry.createdAt));
	const createdAt = `${year}.${month}.${date}`;

	return (
		<div className="px-8 py-6">
			{/* 헤더 */}
			<header className="pb-3 border-b-6 border-black flex justify-between items-center">
				<div className="text-black font-bold text-[31px] leading-[46px] tracking-[0.31px] uppercase font-['Suisse_Intl']">
					문의 내역
				</div>
				<button
					onClick={() => router.back()}
					className="text-black font-extrabold text-[16px] leading-[160%] tracking-[0.18px] cursor-pointer hover:underline"
				>
					목록으로 돌아가기
				</button>
			</header>

			{/* 문의 정보 */}
			<section className="pt-8 pb-12">
				<div className="space-y-6">
					{/* 기본 정보 */}
					<div className="grid grid-cols-[200px_1fr] gap-6 border-b-2 border-black pb-4">
						<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">문의 번호</div>
						<div className="text-black font-semibold text-[18px] leading-[160%] tracking-[0.18px]">
							{String(inquiry.id).padStart(3, "0")}
						</div>
					</div>

					<div className="grid grid-cols-[200px_1fr] gap-6 border-b-2 border-black pb-4">
						<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">이름</div>
						<div className="text-black font-semibold text-[18px] leading-[160%] tracking-[0.18px]">{inquiry.name}</div>
					</div>

					<div className="grid grid-cols-[200px_1fr] gap-6 border-b-2 border-black pb-4">
						<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">이메일</div>
						<div className="text-black font-semibold text-[18px] leading-[160%] tracking-[0.18px]">{inquiry.email}</div>
					</div>

					{inquiry.phoneNumber && (
						<div className="grid grid-cols-[200px_1fr] gap-6 border-b-2 border-black pb-4">
							<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">휴대폰 번호</div>
							<div className="text-black font-semibold text-[18px] leading-[160%] tracking-[0.18px]">
								{inquiry.phoneNumber}
							</div>
						</div>
					)}

					<div className="grid grid-cols-[200px_1fr] gap-6 border-b-2 border-black pb-4">
						<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">작성일</div>
						<div className="text-black font-semibold text-[18px] leading-[160%] tracking-[0.18px]">{createdAt}</div>
					</div>

					{/* 문의 내용 */}
					<div className="space-y-4">
						<div className="text-black font-extrabold text-[18px] leading-[160%] tracking-[0.18px]">문의 내용</div>
						<div className="border-2 border-black rounded-lg p-6 min-h-[200px]">
							<div className="text-black font-semibold text-[16px] leading-[160%] tracking-[0.18px] whitespace-pre-wrap">
								{inquiry.content}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default InquiryDetailPage;
