import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";

import { ArrowLeftMosaic, ArrowRightMosaic, Beat, Like } from "@/assets/svgs";
import { AlbumAvatar } from "@/components/ui";
import { FreeDownloadButton } from "@/components/ui/FreeDownloadButton";
import { GenreButton } from "@/components/ui/GenreButton";
import { PurchaseButton } from "@/components/ui/PurchaseButton";

interface MusicRightSidebarProps {
	// musicData: MusicData;
}
export const MusicRightSidebar = () => {
	const [isLiked, setIsLiked] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const onLikeClick = () => {
		setIsLiked(!isLiked);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div
			className={`fixed right-0 top-0 h-screen transition-all duration-700 ease-in-out ${isSidebarOpen ? "w-80" : "w-0"}`}
		>
			<div className="w-80 h-full bg-hbc-white border-l-2 border-black flex flex-col overflow-hidden">
				<button
					onClick={toggleSidebar}
					className={`absolute top-0 cursor-pointer hover:opacity-80 transition-opacity ${isSidebarOpen ? "left-0" : "-left-8"}`}
				>
					{isSidebarOpen ? <ArrowRightMosaic /> : <ArrowLeftMosaic />}
				</button>

				<div className="flex justify-center items-center mt-12 mb-6">
					<AlbumAvatar src="https://placehold.co/60x60" />
				</div>

				<div className="px-6">
					<div className="w-full mb-2 text-hbc-black text-3xl font-bold font-['Suisse_Int'l'] leading-10 tracking-tight">
						Secret Garden
					</div>

					<div className="flex justify-between items-center gap-2 mb-4">
						<div className="text-lg font-['Suisse_Int'l']">NotJake</div>
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
							플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트
							입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능
							타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운
							가능 타입비트 입니다.플레이보이 카티 타입비트 료다운 가능 타입비트 입니다.플레이보이 카티 타입비트
							무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운무 가능 타입비트 입니다.플레이보이 카티
							타입비트 무료다운 가능 타입비트 입니다.
						</div>

						<div className="flex flex-wrap gap-2">
							<GenreButton name="C# minor" />
							<GenreButton name="BPM 120" />
							<GenreButton name="Boom bap" />
							<GenreButton name="Old School" />
						</div>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation="vertical"
						className="flex select-none touch-none transition-colors duration-[160ms] ease-out hover:bg-black/10 data-[orientation=vertical]:w-2 bg-black/5"
					>
						<ScrollArea.Thumb className="flex-1 bg-hbc-gray-200 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>

				<div className="px-6">
					{/* divider */}
					<div className="w-full h-[1px] bg-hbc-black outline-[4px] outline-HBC-Black mb-4"></div>

					<div className="flex justify-between items-center pb-4">
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
								15,000 KRW
							</PurchaseButton>
						</div>

						<div
							onClick={onLikeClick}
							className="cursor-pointer w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
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
};
