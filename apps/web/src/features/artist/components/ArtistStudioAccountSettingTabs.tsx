"use client";

import { memo } from "react";
import { Lock } from "@/assets/svgs";
import { useSearchParams } from "next/navigation";
import { cn } from "@/common/utils";
import Link from "next/link";

/**
 * 탭 타입 정의
 * - profile: 프로필 설정
 * - settlement: 정산 정보 설정
 * - membership: 히트비트 멤버십 정보
 */
type TabType = "profile" | "settlement" | "membership";

/**
 * 탭 아이템 인터페이스
 * @property id - 탭 식별자
 * @property href - 탭 링크 주소
 * @property label - 탭 레이블
 * @property isLocked - 잠금 상태 여부
 */
interface Tab {
	id: TabType;
	href: string;
	label: string;
	isLocked: boolean;
}

/**
 * 탭 설정 데이터
 */
const tabs: Tab[] = [
	{
		id: "profile",
		href: "/artist-studio/1/setting?tab=profile",
		label: "프로필 설정",
		isLocked: true,
	},
	{
		id: "settlement",
		href: "/artist-studio/1/setting?tab=settlement",
		label: "정산 정보 설정",
		isLocked: true,
	},
	{
		id: "membership",
		href: "/artist-studio/1/setting?tab=membership",
		label: "히트비트 멤버십 정보",
		isLocked: false,
	},
];

/**
 * 아티스트 스튜디오 계정 설정 탭 컴포넌트
 *
 * @description
 * 아티스트 스튜디오의 계정 설정 페이지에서 사용되는 탭 네비게이션 컴포넌트입니다.
 * - 프로필 설정, 정산 정보 설정, 멤버십 정보 탭을 제공
 * - 현재 활성화된 탭을 시각적으로 표시
 * - 잠금 상태인 탭에 대해 잠금 아이콘 표시
 */
export const ArtistStudioAccountSettingTabs = memo(() => {
	const searchParams = useSearchParams();
	const activeTab = (searchParams.get("tab") as TabType) || "profile";

	return (
		<nav className="w-[300px] flex flex-col gap-4">
			{tabs.map((tab) => (
				<Link
					key={tab.id}
					href={tab.href}
					className="cursor-pointer"
					aria-current={activeTab === tab.id ? "page" : undefined}
				>
					<div className="flex justify-between">
						<div
							className={cn(
								"pb-2 text-[24px] font-bold leading-[24px] tracking-0.24px transition-colors",
								activeTab === tab.id ? "text-hbc-black" : "text-gray-200",
							)}
						>
							{tab.label}
						</div>
						{tab.isLocked && (
							<Lock className={cn("transition-opacity", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
						)}
					</div>

					<div
						className={cn("w-full h-[4px] transition-colors", activeTab === tab.id ? "bg-hbc-black" : "bg-gray-200")}
					/>
				</Link>
			))}
		</nav>
	);
});

ArtistStudioAccountSettingTabs.displayName = "ArtistStudioAccountSettingTabs";
