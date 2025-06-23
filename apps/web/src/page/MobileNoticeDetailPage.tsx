"use client";

import { Return } from "@/assets/svgs";
import { MobileNoticePageTitle } from "@/features/mobile/notice/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getNoticeDetailQueryOption } from "@/apis/notice/query/notice.query-options";

interface MobileNoticeDetailPageProps {
	noticeId: string;
}

const MobileNoticeDetailPage = ({ noticeId }: MobileNoticeDetailPageProps) => {
	const noticeDetailQuery = useQuery(getNoticeDetailQueryOption(Number(noticeId)));

	const { data: notice, isLoading, error } = noticeDetailQuery;

	if (isLoading) {
		return (
			<div className="flex flex-col px-4 pb-4">
				<MobileNoticePageTitle title="로딩 중..." />
				<div className="mt-13px flex items-center justify-center py-20">
					<div className="text-14px leading-160% font-semibold">공지사항을 불러오는 중입니다...</div>
				</div>
			</div>
		);
	}

	if (error || !notice) {
		return (
			<div className="flex flex-col px-4 pb-4">
				<MobileNoticePageTitle title="오류" />
				<div className="mt-13px flex items-center justify-center py-20">
					<div className="text-14px leading-160% font-semibold text-red-500">공지사항을 불러올 수 없습니다.</div>
				</div>
			</div>
		);
	}

	const handleBackClick = () => {
		if (typeof window !== "undefined") {
			window.history.back();
		}
	};

	return (
		<div className="flex flex-col px-4 pb-4">
			<MobileNoticePageTitle title={notice.title} />
			<div className="mt-13px flex justify-end">
				<button
					className="flex items-center rounded-30px h-24px px-3 border-2px border-black"
					onClick={handleBackClick}
				>
					<div className="flex gap-5px items-center">
						<span className="text-14px leading-100% font-semibold">BACK</span>
						<Return />
					</div>
				</button>
			</div>

			{/* 공지사항 메타 정보 */}
			<div className="my-17px flex justify-between items-center text-12px text-gray-600">
				<div>작성일: {new Date(notice.createdAt).toLocaleDateString("ko-KR")}</div>
				<div>조회수: {notice.viewCount}</div>
			</div>

			{/* 공지사항 내용 */}
			<div className="text-14px leading-160% font-semibold whitespace-pre-wrap">{notice.content}</div>

			{/* 첨부 파일 */}
			{notice.files && notice.files.length > 0 && (
				<div className="mt-6 border-t pt-4">
					<div className="text-12px font-semibold mb-2">첨부 파일:</div>
					<div className="space-y-2">
						{notice.files.map((file, index) => (
							<a
								key={file.id}
								href={file.url}
								download={file.originalName}
								target="_blank"
								rel="noopener noreferrer"
								className="block text-12px text-blue-600 underline hover:text-blue-800"
							>
								📎 {file.originalName}
							</a>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MobileNoticeDetailPage;
