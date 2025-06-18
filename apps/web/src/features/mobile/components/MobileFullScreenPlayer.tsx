import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { MobileDownArrowSquareSVG } from "./MobileDownArrowSquareSVG";
import { MobilePlayListSquareSVG } from "./MobilePlayListSquareSVG";
import { Beat, Like } from "@/assets/svgs";
import { MobileFullScreenPlayerBeatSVG } from "./MobileFullScreenPlayerBeatSVG";
import { MobileFullScreenPlayerNextSVG } from "./MobileFullScreenPlayerNextSVG";
import { MobileFullScreenPlayerPauseSVG } from "./MobileFullScreenPlayerPauseSVG";
import { MobileFullScreenPlayerPreviousSVG } from "./MobileFullScreenPlayerPreviousSVG";
import { MobileFullScreenPlayerRepeatSVG } from "./MobileFullScreenPlayerRepeatSVG";
import { MobileFullScreenPlayerShuffleSVG } from "./MobileFullScreenPlayerShuffleSVG";
import { MobileLikeSVG } from "./MobileLikeSVG";
import { MobileAddCircleSVG } from "./MobileAddCircleSVG";

interface MobileFullScreenPlayerProps {
	onHide: () => void;
}

export const MobileFullScreenPlayer = ({ onHide }: MobileFullScreenPlayerProps) => {
	const [progress, setProgress] = useState(0.5); // 재생 진행률 0~1 사이 값
	const [isVisible, setIsVisible] = useState(false); // 애니메이션 상태
	const progressBarRef = useRef<HTMLDivElement>(null);
	const totalDuration = 213; // 총 재생 시간 (초) - 3:33

	// 컴포넌트 마운트 시 애니메이션 트리거
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 50); // 약간의 지연으로 부드러운 애니메이션 효과

		return () => clearTimeout(timer);
	}, []);

	// 숨기기 애니메이션 핸들러
	const handleHide = useCallback(() => {
		setIsVisible(false);

		// 애니메이션 완료 후 onHide 호출
		setTimeout(() => {
			onHide();
		}, 300); // transition duration과 동일
	}, [onHide]);

	// 시간을 mm:ss 형식으로 변환하는 함수
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// 재생바 드래그/터치 핸들러
	const handleProgressChange = useCallback((event: React.MouseEvent | React.TouchEvent) => {
		if (!progressBarRef.current) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const clientX = "touches" in event ? event.touches[0]?.clientX : event.clientX;
		if (clientX === undefined) return;

		// 가로 재생바이므로 X 좌표를 사용하고, 왼쪽에서부터의 거리를 계산
		const relativeX = clientX - rect.left; // 왼쪽에서부터의 거리
		const newProgress = Math.max(0, Math.min(1, relativeX / rect.width));

		setProgress(newProgress);
	}, []);

	// 재생바 드래그 이벤트 핸들러
	const handleProgressMouseDown = (event: React.MouseEvent) => {
		handleProgressChange(event);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = progressBarRef.current?.getBoundingClientRect();
			if (!rect) return;

			const relativeX = e.clientX - rect.left;
			const newProgress = Math.max(0, Math.min(1, relativeX / rect.width));
			setProgress(newProgress);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	// 재생바 터치 이벤트 핸들러
	const handleProgressTouchStart = (event: React.TouchEvent) => {
		handleProgressChange(event);

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const rect = progressBarRef.current?.getBoundingClientRect();
			if (!rect || !e.touches[0]) return;

			const relativeX = e.touches[0].clientX - rect.left;
			const newProgress = Math.max(0, Math.min(1, relativeX / rect.width));
			setProgress(newProgress);
		};

		const handleTouchEnd = () => {
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};

		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);
	};

	return (
		<div
			className={`bg-white z-[1000] fixed top-0 left-0 right-0 bottom-0 flex flex-col transition-transform duration-300 ease-out ${
				isVisible ? "translate-y-0" : "translate-y-full"
			}`}
		>
			<div className="relative flex-1 flex flex-col pb-108px overflow-y-auto">
				<div className="w-full aspect-square p-4 relative flex flex-col">
					<div className="absolute top-9 left-3 right-3 -bottom-3 pointer-events-none">
						<div className="relative w-full h-full overflow-hidden rounded-full border-6px border-black">
							<Image
								src="https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"
								alt="cover"
								fill
								className="object-cover"
							/>
						</div>
					</div>
					<div className="flex justify-between">
						<button onClick={handleHide}>
							<MobileDownArrowSquareSVG />
						</button>
						<MobilePlayListSquareSVG />
					</div>
				</div>
				<div className="mt-8 flex flex-col px-4 pb-4">
					<div className="font-bold text-32px leading-40px">Secret Garden</div>
					<div className="flex justify-between">
						<span className="font-[450] text-18px leading-100%">NotJake</span>
						<MobileFullScreenPlayerBeatSVG />
					</div>
				</div>
				<div className="px-4 flex flex-col">
					<div
						ref={progressBarRef}
						className="relative w-full h-6px flex items-center cursor-pointer"
						onMouseDown={handleProgressMouseDown}
						onTouchStart={handleProgressTouchStart}
					>
						<div className="w-full h-2px bg-black" />
						<div
							className="absolute h-6px bg-black"
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
					<div className="flex justify-between mt-3px text-12px font-[450] leading-16px">
						<span>{formatTime(progress * totalDuration)}</span>
						<span>{formatTime(totalDuration)}</span>
					</div>
				</div>
				<div className="px-4 mt-3 text-14px font-[450] leading-18px">
					<span>General Information</span>
					<br />
					<p className="text-hbc-gray-300">
						Kind : MPEG audio file
						<br />
						Time : 4:32
						<br />
						Size : 5.8MB
						<br />
						Date : 4/12/2024 10:47 PM
					</p>
					<br />
					<span>Detail Information</span>
					<br />
					<p className="text-hbc-gray-300">
						Bit Rate : 160kbps
						<br />
						Sample Rate : 44.100 kHz
						<br />
						Channels : Joint Stereo
						<br />
						ID3 tag : v2.2
						<br />
						Encoded by : X v2.0.1
					</p>
				</div>
			</div>
			<div className="fixed bg-white bottom-77px left-0 right-0 px-4 py-6 flex justify-between">
				<div className="flex flex-col">
					<button className="h-30px font-bold text-16px leading-16px text-black border-4px border-black rounded-40px">
						Free Download
					</button>
					<button className="font-bold text-16px leading-16px text-white bg-black h-30px px-2 border-4px border-black rounded-40px flex items-center gap-2">
						<MobileAddCircleSVG fill="white" />
						15,000 KRW
					</button>
				</div>
				<div className="self-end">
					<MobileLikeSVG />
				</div>
			</div>
			<div className="h-auto border-t-10px border-black px-2 py-1 flex items-center justify-between">
				<MobileFullScreenPlayerRepeatSVG />
				<MobileFullScreenPlayerPreviousSVG />
				<MobileFullScreenPlayerPauseSVG />
				<MobileFullScreenPlayerNextSVG />
				<MobileFullScreenPlayerShuffleSVG />
			</div>
		</div>
	);
};
