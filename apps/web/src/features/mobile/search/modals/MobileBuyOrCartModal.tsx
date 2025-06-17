"use client";

import { Acapella } from "@/assets/svgs";
import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import Image from "next/image";
import { memo } from "react";

interface MobileBuyOrCartModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const MobileBuyOrCartModal = memo(({ isOpen, onClose }: MobileBuyOrCartModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
			variant="mobile"
		>
			<PopupContent className="w-[238px] flex flex-col bg-[#DADADA]">
				<div className="flex flex-col gap-4">
					<div className="flex gap-2">
						<div className="w-76px h-76px relative rounded-5px overflow-hidden">
							<Image
								alt=""
								src="https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"
								fill
								className="object-cover"
							/>
						</div>
						<div className="flex flex-col gap-10px">
							<div className="flex flex-col">
								<span className="font-semibold text-12px leading-100%">Smile For Me</span>
								<span className="text-10px leading-10px mt-1px">NotJake</span>
								<Acapella className="mt-3px" />
							</div>
							<div className="flex flex-col gap-2px font-[450] text-8px leading-100%">
								<span>89BPM</span>
								<span>A min</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-2px">
						<div className="font-medium text-12px leading-100%">Basic 라이센스 사용범위</div>
						<div className="flex gap-10px font-bold text-8px leading-150%">
							<span>믹스테잎용 곡 녹음</span>
							<span>1개의 상업적 곡 녹음</span>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<button className="h-44px rounded-3px bg-white flex flex-col justify-center items-center gap-1 font-[450] text-8px leading-100%">
							<span>Basic</span>
							<span>40,000 KRW</span>
							<span>MP3, WAV</span>
						</button>
						<button className="h-44px rounded-3px bg-black text-white flex flex-col justify-center items-center gap-1 font-[450] text-8px leading-100%">
							<span>Exclusive</span>
							<span>140,000 KRW</span>
							<span>MP3, WAV</span>
						</button>
					</div>
					<div className="flex gap-1">
						<button className="rounded-3px h-20px flex-1 font-bold text-8px leading-100% bg-black text-white">
							장바구니 담기
						</button>
						<button className="rounded-3px h-20px flex-1 font-bold text-8px leading-100% bg-black text-white">
							구매하기
						</button>
					</div>
				</div>
			</PopupContent>
		</Popup>
	);
});

MobileBuyOrCartModal.displayName = "MobileBuyOrCartModal";
