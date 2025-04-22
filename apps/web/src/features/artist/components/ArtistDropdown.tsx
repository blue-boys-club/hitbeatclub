"use client";

import { memo } from "react";

interface DropdownOption {
	label: string;
	value: string;
	onClick: () => void;
}

interface ArtistDropdownProps {
	options: DropdownOption[];
}

/**
 * 아티스트 페이지의 드롭다운 메뉴 컴포넌트
 * - 팔로잉 취소, 차단, 신고 등의 옵션 제공
 * - 각 옵션 클릭 시 해당 액션 실행
 * - 호버 시 배경색과 텍스트 색상 변경 효과
 */
export const ArtistDropdown = memo(({ options }: ArtistDropdownProps) => {
	return (
		<div className="relative">
			<ul className="absolute top-4 -left-10 w-32 p-2.5 bg-white rounded-[5px] outline-2 outline-offset-[-2px] outline-black inline-flex flex-col justify-center items-start gap-2.5">
				{options.map((option) => (
					<li
						key={option.value}
						className="px-2.5 pt-1 pb-[3px] bg-white rounded-[40px] inline-flex items-center cursor-pointer transition-colors hover:bg-black group"
					>
						<div
							className="font-bold text-black group-hover:text-white"
							onClick={option.onClick}
						>
							{option.label}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
});

ArtistDropdown.displayName = "ArtistDropdown";
