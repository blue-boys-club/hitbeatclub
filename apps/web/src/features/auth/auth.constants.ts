import type { DropdownOption } from "@/components/ui/Dropdown";

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
