"use client";

import { useState, memo } from "react";
import { cn } from "@/common/utils";
import { FavoriteTracks, RedPlayCircle, ShuffleOff, ShuffleOn } from "@/assets/svgs";

interface LikesHeaderProps {
	totalCount?: number;
	username?: string;
	onPlay?: () => void;
}

/**
 * 좋아요한 트랙들의 헤더 컴포넌트
 * - 전체 트랙 수와 사용자 이름 표시
 * - 전체 재생 및 셔플 기능 제공
 */
export const LikesHeader = memo(({ totalCount = 32, username = "홍길동", onPlay }: LikesHeaderProps) => {
	const [isShuffleOn, setIsShuffleOn] = useState(false);

	const onShuffle = () => {
		setIsShuffleOn((prev) => !prev);
	};

	return (
		<>
			<div className={cn("w-full pl-9 transition-all duration-700 ease-in-out pr-10", "flex items-center gap-5")}>
				<div className="flex items-center min-w-0 gap-4">
					<FavoriteTracks />

					<div className="flex items-center min-w-0">
						<div className="inline-flex flex-col">
							<div className="text-[32px] font-suisse font-bold tracking-[0.32px] leading-[40px]">Favorite Tracks</div>
							<div className="text-[#777] font-bold tracking-tight">
								{username} • 전체 {totalCount}
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div
						className="cursor-pointer"
						onClick={onPlay}
					>
						<RedPlayCircle />
					</div>
					<div
						className="cursor-pointer"
						onClick={onShuffle}
					>
						{isShuffleOn ? <ShuffleOn /> : <ShuffleOff />}
					</div>
				</div>
			</div>

			{/* divider */}
			<div className="w-full h-1.5 bg-hbc-black mx-auto transition-all duration-700 ease-in-out"></div>
		</>
	);
});

LikesHeader.displayName = "LikesHeader";
