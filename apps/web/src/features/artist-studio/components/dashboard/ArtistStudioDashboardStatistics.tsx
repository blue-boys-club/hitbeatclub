"use client";
import { Plus } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { AlbumAvatar, UserAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";

const ArtistStudioDashboardStatistics = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<section className="pt-8 grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-3">
			<div className="border-b-6 pl-[2px] pb-2 text-hbc-black font-suit text-[24px] font-extrabold leading-[100%] tracking-[0.24px]">
				트랙 통계
			</div>

			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl"></div>
			<div></div>
			<div className="border-b-6 border-hbc-black flex flex-col gap-7 pb-[28px]">
				<div className="grid grid-cols-3 gap-auto pt-[18px] pb-3">
					<div className="flex flex-col gap-2 items-center">
						<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-bold text-hbc-black font-[SUIT]">
							가장 좋아요를 많이 받은 트랙
						</div>
						<div className="flex gap-1.5">
							<span className="text-[32px] leading-[24px] tracking-[0.32px] font-bold text-hbc-black">
								{(1765).toLocaleString()}
							</span>
							<span className="text-[20px] leading-[24px] tracking-[0.2px] font-medium text-hbc-gray-300">Like</span>
						</div>
						{/* 이미지 넣어줘야 함 */}
						<AlbumAvatar src="" />
						<div className="text-[20px] leading-[24px] tracking-[0.2px] font-bold text-hbc-black">Secret Garden</div>
					</div>
				</div>
				<div className={cn("grid grid-cols-3 gap-auto", !isOpen && "hidden")}>
					<div className="grid grid-cols-2 gap-x-3 gap-y-4 px-7">
						<div className="flex flex-col gap-2 justify-center items-center">
							<div className="text-hbc-black text-center font-[SUIT] text-[12px] font-black leading-[120%] tracking-[0.12px]">
								2위
							</div>
							<UserAvatar
								src=""
								size={"large"}
							/>
							<div className="text-hbc-black text-center font-[Suisse] text-[12px] font-bold leading-[120%] tracking-[0.12px]">
								Cheek to Cheek
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<Button
						rounded={"full"}
						onClick={() => setIsOpen(!isOpen)}
					>
						{!isOpen ? (
							<div className="flex items-center gap-1">
								<div className="text-center font-[SUIT] text-[16px] font-extrabold leading-[100%] tracking-[0.16px] text-hbc-white">
									더보기
								</div>
								<Plus />
							</div>
						) : (
							<div className="flex items-center gap-1">
								<div className="text-center font-[SUIT] text-[16px] font-extrabold leading-[100%] tracking-[0.16px] text-hbc-white">
									접기
								</div>
								<div className="rotate-45">
									<Plus />
								</div>
							</div>
						)}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default ArtistStudioDashboardStatistics;
