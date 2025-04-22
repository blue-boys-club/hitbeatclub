"use client";

import { memo, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { cn } from "@/common/utils";

import { ArrowLeftMosaic, ArrowRightMosaic, Beat, Like } from "@/assets/svgs";
import { AlbumAvatar } from "@/components/ui";
import { FreeDownloadButton } from "@/components/ui/FreeDownloadButton";
import { GenreButton } from "@/components/ui/GenreButton";
import { PurchaseButton } from "@/components/ui/PurchaseButton";

interface MusicRightSidebarProps {
	isOpen: boolean;
	onToggleOpen: (isOpen: boolean) => void;
	trackInfo?: {
		title: string;
		artist: string;
		description: string;
		albumImgSrc: string;
		price?: number;
		genres?: string[];
	};
}

/**
 * 음악 상세 정보를 보여주는 우측 사이드바 컴포넌트
 * - 트랙 정보 표시 (제목, 아티스트, 설명, 장르 등)
 * - 좋아요 기능
 * - 무료 다운로드 및 구매 기능
 * - 사이드바 열기/닫기 기능
 */
export const MusicRightSidebar = memo(
	({
		isOpen,
		onToggleOpen,
		trackInfo = {
			title: "Secret Garden",
			artist: "NotJake",
			description:
				"플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운무 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.",
			albumImgSrc: "https://placehold.co/60x60",
			price: 15000,
			genres: ["C# minor", "BPM 120", "Boom bap", "Old School"],
		},
	}: MusicRightSidebarProps) => {
		const [isLiked, setIsLiked] = useState(false);

		const onLikeClick = () => {
			setIsLiked(!isLiked);
		};

		return (
			<div
				className={cn(
					"fixed right-0 top-0 h-[calc(100vh-92px)] transition-all duration-700 ease-in-out",
					isOpen ? "w-80" : "w-0",
				)}
			>
				<div className="w-80 h-full pb-15 bg-hbc-white border-l-2 border-black flex flex-col overflow-hidden">
					<button
						onClick={() => onToggleOpen(!isOpen)}
						className={cn(
							"absolute top-0 cursor-pointer hover:opacity-80 transition-opacity",
							isOpen ? "left-0" : "-left-8",
						)}
					>
						{isOpen ? <ArrowRightMosaic /> : <ArrowLeftMosaic />}
					</button>

					<div className="flex justify-center items-center mt-12 mb-6">
						<AlbumAvatar src={trackInfo.albumImgSrc} />
					</div>

					<div className="px-6">
						<div className="w-full mb-2 text-hbc-black text-[32px] font-suisse font-bold tracking-[0.32px] leading-[40px]">
							{trackInfo.title}
						</div>

						<div className="flex justify-between items-center gap-2 mb-4">
							<div className="text-lg font-['Suisse_Int'l']">{trackInfo.artist}</div>
							<div>
								<Beat className="w-16 h-4" />
							</div>
						</div>

						{/* divider */}
						<div className="w-full h-[1px] bg-hbc-black outline-[4px] outline-HBC-Black"></div>
					</div>

					<ScrollArea.Root className="flex-1 min-h-0 px-6 my-4">
						<ScrollArea.Viewport className="size-full p-2">
							<div className="mb-3 text-base font-bold font-['SUIT'] leading-snug">곡 정보</div>
							<div className="text-hbc-gray-300 text-base font-bold font-['SUIT'] leading-relaxed mb-6">
								{trackInfo.description}
							</div>

							<div className="flex flex-wrap gap-2">
								{trackInfo.genres?.map((genre) => (
									<GenreButton
										key={genre}
										name={genre}
									/>
								))}
							</div>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							orientation="vertical"
							className={cn(
								"flex select-none touch-none transition-colors duration-[160ms] ease-out",
								"data-[orientation=vertical]:w-2 bg-black/5",
								"hover:bg-black/10",
							)}
						>
							<ScrollArea.Thumb className="flex-1 bg-hbc-gray-200 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>

					<div className="px-6">
						{/* divider */}
						<div className="w-full h-[1px] bg-hbc-black outline-[4px] outline-HBC-Black mb-4"></div>

						<div className="flex justify-between pb-4">
							<div className="flex flex-col gap-0.5">
								<FreeDownloadButton
									variant="secondary"
									className="outline-4 outline-hbc-black px-2.5 font-['Suisse_Int'l']"
								>
									Free Download
								</FreeDownloadButton>
								<PurchaseButton
									iconColor="hbc-white"
									className="outline-4 outline-hbc-black"
								>
									{trackInfo.price?.toLocaleString()} KRW
								</PurchaseButton>
							</div>

							<div
								onClick={onLikeClick}
								className="cursor-pointer w-8 h-8 flex justify-center items-center hover:opacity-80 transition-opacity"
							>
								{isLiked ? (
									<Image
										src="/assets/ActiveLike.png"
										alt="active like"
										width={20}
										height={20}
									/>
								) : (
									<Like />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

MusicRightSidebar.displayName = "MusicRightSidebar";
