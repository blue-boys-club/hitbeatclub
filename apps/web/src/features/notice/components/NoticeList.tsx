"use client";
import { useRouter } from "next/navigation";

const datas = [
	{ id: 1, title: "2024년 07월 09일 업데이트 사항입니다.", date: "24.11.17", views: 207 },
	{ id: 2, title: "히트비트클럽입니다.", date: "24.11.17", views: 97 },
	{ id: 3, title: "웹사이트 리뉴얼과 관련한 기존 멤버 공지", date: "24.11.17", views: 1098 },
	{ id: 4, title: "판매자 탈퇴 안내", date: "24.11.17", views: 47 },
	{ id: 5, title: "최근 발생한 결제 관련 오류 조치와 관련하여 말씀드립니다.", date: "24.11.17", views: 80 },
	{ id: 6, title: "비트 업로드 시, 새로운 창은 태그 추가 방법", date: "24.11.17", views: 708 },
	{ id: 7, title: "판매자 정산 관련 안내", date: "24.11.17", views: 104 },
	{ id: 8, title: "웹사이트 접속 오류 발생 시, 대처 방법", date: "24.11.17", views: 97 },
	{ id: 9, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 10, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 11, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 12, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 13, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 14, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
	{ id: 15, title: "HITBEATCLUB 웹사이트 리뉴얼", date: "24.11.17", views: 17 },
];

const NoticeList = () => {
	const navigate = useRouter();

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
					{datas.map((data, idx) => (
						<tr
							key={data.id}
							className="border-b-2 border-black text-hbc-black font-[SUIT] text-lg font-extrabold leading-[24px] tracking-[-0.32px] hover:bg-hbc-black hover:text-hbc-white cursor-pointer select-none"
							onClick={() => navigate.push(`/notices/${data.id}`)}
						>
							<td className="py-[10px]">{idx + 1}</td>
							<td className="py-[10px] px-14 truncate">{data.title}</td>
							<td className="py-[10px] px-2">{data.date}</td>
							<td className="py-[10px] px-2">{data.views}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex justify-center items-center gap-1 pt-5">
				{[1, 2, 3, 4, 5].map((page) => (
					<button
						key={page}
						className={`flex items-center justify-center cursor-pointer text-base font-black  ${
							page === 1 ? "text-hbc-red" : "text-hbc-black"
						}`}
					>
						{page}
					</button>
				))}
			</div>
		</section>
	);
};

export default NoticeList;
