import { DropdownOption } from "@/components/ui/Dropdown";

// 국가 옵션
export const COUNTRY_OPTIONS: DropdownOption[] = [
	{ label: "대한민국", value: "KR" },
	{ label: "미국", value: "US" },
	{ label: "일본", value: "JP" },
];

// 국가별 지역 옵션
export const REGION_OPTIONS_BY_COUNTRY: Record<string, DropdownOption[]> = {
	KR: [
		{ label: "서울특별시", value: "seoul" },
		{ label: "경기도", value: "gyeonggi" },
		{ label: "인천광역시", value: "incheon" },
		{ label: "부산광역시", value: "busan" },
		{ label: "대구광역시", value: "daegu" },
		{ label: "광주광역시", value: "gwangju" },
		{ label: "대전광역시", value: "daejeon" },
		{ label: "울산광역시", value: "ulsan" },
		{ label: "세종특별자치시", value: "sejong" },
		{ label: "강원도", value: "gangwon" },
		{ label: "충청북도", value: "chungbuk" },
		{ label: "충청남도", value: "chungnam" },
		{ label: "전라북도", value: "jeonbuk" },
		{ label: "전라남도", value: "jeonnam" },
		{ label: "경상북도", value: "gyeongbuk" },
		{ label: "경상남도", value: "gyeongnam" },
		{ label: "제주특별자치도", value: "jeju" },
	],
	US: [
		{ label: "California", value: "california" },
		{ label: "New York", value: "new_york" },
		{ label: "Texas", value: "texas" },
		{ label: "Florida", value: "florida" },
		{ label: "Illinois", value: "illinois" },
		{ label: "Pennsylvania", value: "pennsylvania" },
		{ label: "Ohio", value: "ohio" },
		{ label: "Georgia", value: "georgia" },
		{ label: "North Carolina", value: "north_carolina" },
		{ label: "Michigan", value: "michigan" },
	],
	JP: [
		{ label: "도쿄도", value: "tokyo" },
		{ label: "오사카부", value: "osaka" },
		{ label: "교토부", value: "kyoto" },
		{ label: "가나가와현", value: "kanagawa" },
		{ label: "사이타마현", value: "saitama" },
		{ label: "치바현", value: "chiba" },
		{ label: "효고현", value: "hyogo" },
		{ label: "후쿠오카현", value: "fukuoka" },
		{ label: "아이치현", value: "aichi" },
		{ label: "홋카이도", value: "hokkaido" },
	],
};

// 성별 옵션
export const GENDER_OPTIONS: DropdownOption[] = [
	{ label: "남성", value: "M" },
	{ label: "여성", value: "F" },
];

// 년도 옵션 생성 함수
export const generateYearOptions = (): DropdownOption[] => {
	const currentYear = new Date().getFullYear();
	return Array.from({ length: 100 }, (_, i) => {
		const year = currentYear - i;
		return { label: `${year}`, value: year.toString() };
	});
};

// 월 옵션
export const MONTH_OPTIONS: DropdownOption[] = Array.from({ length: 12 }, (_, i) => {
	const month = i + 1;
	return { label: `${month}`, value: month.toString() };
});

// 일 옵션
export const DAY_OPTIONS: DropdownOption[] = Array.from({ length: 31 }, (_, i) => {
	const day = i + 1;
	return { label: `${day}`, value: day.toString() };
});

// 국가별 지역 옵션 가져오기 함수
export const getRegionOptionsByCountry = (countryCode: string): DropdownOption[] => {
	return REGION_OPTIONS_BY_COUNTRY[countryCode] || [];
};
