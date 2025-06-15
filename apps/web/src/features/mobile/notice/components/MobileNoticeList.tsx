import Link from "next/link";

const noticeData = [
	{
		id: 1,
		number: "01",
		title: "히트비트클럽 웹사이트 리뉴얼",
		date: "25.01.28",
	},
	{
		id: 2,
		number: "02",
		title: "신규 회원 가입 이벤트 안내",
		date: "25.01.25",
	},
	{
		id: 3,
		number: "03",
		title: "2025년 정기 공연 일정 공지",
		date: "25.01.20",
	},
	{
		id: 4,
		number: "04",
		title: "음향 시설 점검으로 인한 연습실 사용 제한",
		date: "25.01.18",
	},
	{
		id: 5,
		number: "05",
		title: "밴드 오디션 모집 공고",
		date: "25.01.15",
	},
	{
		id: 6,
		number: "06",
		title: "겨울 방학 특별 워크샵 안내",
		date: "25.01.12",
	},
	{
		id: 7,
		number: "07",
		title: "클럽 회비 납부 안내",
		date: "25.01.10",
	},
	{
		id: 8,
		number: "08",
		title: "새해 첫 정기 모임 일정",
		date: "25.01.08",
	},
	{
		id: 9,
		number: "09",
		title: "악기 대여 서비스 이용 안내",
		date: "25.01.05",
	},
	{
		id: 10,
		number: "10",
		title: "신년 신입 회원 환영회",
		date: "25.01.03",
	},
	{
		id: 11,
		number: "11",
		title: "연말 정산 및 클럽 결산 보고",
		date: "24.12.30",
	},
	{
		id: 12,
		number: "12",
		title: "크리스마스 특별 공연 후기",
		date: "24.12.28",
	},
	{
		id: 13,
		number: "13",
		title: "2024년 하반기 활동 사진 공유",
		date: "24.12.25",
	},
	{
		id: 14,
		number: "14",
		title: "겨울 정기 공연 예매 안내",
		date: "24.12.20",
	},
	{
		id: 15,
		number: "15",
		title: "연습실 예약 시스템 업데이트",
		date: "24.12.18",
	},
	{
		id: 16,
		number: "16",
		title: "클럽 멤버십 혜택 변경 안내",
		date: "24.12.15",
	},
	{
		id: 17,
		number: "17",
		title: "음향 장비 교체 및 업그레이드",
		date: "24.12.12",
	},
	{
		id: 18,
		number: "18",
		title: "월간 잼 세션 일정 안내",
		date: "24.12.10",
	},
	{
		id: 19,
		number: "19",
		title: "신규 강사진 소개 및 레슨 안내",
		date: "24.12.08",
	},
	{
		id: 20,
		number: "20",
		title: "클럽 10주년 기념 이벤트 예고",
		date: "24.12.05",
	},
];

export const MobileNoticeList = () => {
	return (
		<div className="flex flex-col">
			{noticeData.map((notice) => (
				<MobileNoticeListItem
					key={notice.id}
					id={notice.id}
					number={notice.number}
					title={notice.title}
					date={notice.date}
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
