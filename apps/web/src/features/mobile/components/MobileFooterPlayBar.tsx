import { Like } from "@/assets/svgs";
import { Heart } from "@/assets/svgs/Heart";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { MobileAddCircleSVG } from "./MobileAddCircleSVG";
import { MobileLikeSVG } from "./MobileLikeSVG";
import { MobileSpeakerSVG } from "./MobileSpeakerSVG";
import { MobilePauseCircleSVG } from "./MobilePauseCircleSVG";

export const MobileFooterPlayBar = () => {
	const [showVolumeBar, setShowVolumeBar] = useState(false);
	const [volumeLevel, setVolumeLevel] = useState(0.5); // 0~1 사이 값
	const [progress, setProgress] = useState(0.5); // 재생 진행률 0~1 사이 값
	const volumeBarRef = useRef<HTMLDivElement>(null);
	const speakerRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);

	// 볼륨바 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (
				volumeBarRef.current &&
				!volumeBarRef.current.contains(event.target as Node) &&
				speakerRef.current &&
				!speakerRef.current.contains(event.target as Node)
			) {
				setShowVolumeBar(false);
			}
		};

		if (showVolumeBar) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchstart", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [showVolumeBar]);

	// 스피커 아이콘 클릭 핸들러
	const handleSpeakerClick = () => {
		setShowVolumeBar(!showVolumeBar);
	};

	// 볼륨바 드래그/터치 핸들러
	const handleVolumeChange = useCallback((event: React.MouseEvent | React.TouchEvent) => {
		if (!volumeBarRef.current) return;

		const rect = volumeBarRef.current.getBoundingClientRect();
		const clientY = "touches" in event ? event.touches[0]?.clientY : event.clientY;
		if (clientY === undefined) return;

		// 세로 볼륨바이므로 Y 좌표를 사용하고, 위에서부터의 거리를 계산
		const relativeY = rect.bottom - clientY; // 하단에서부터의 거리
		const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));

		setVolumeLevel(newVolume);
	}, []);

	// 드래그 이벤트 핸들러
	const handleMouseDown = (event: React.MouseEvent) => {
		handleVolumeChange(event);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = volumeBarRef.current?.getBoundingClientRect();
			if (!rect) return;

			const relativeY = rect.bottom - e.clientY;
			const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));
			setVolumeLevel(newVolume);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	// 터치 이벤트 핸들러
	const handleTouchStart = (event: React.TouchEvent) => {
		handleVolumeChange(event);

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const rect = volumeBarRef.current?.getBoundingClientRect();
			if (!rect || !e.touches[0]) return;

			const relativeY = rect.bottom - e.touches[0].clientY;
			const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));
			setVolumeLevel(newVolume);
		};

		const handleTouchEnd = () => {
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};

		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);
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
		<div className="flex gap-3 border-t-4px border-black p-2">
			<div className="w-50px h-50px relative border-5px border-black">
				<Image
					alt=""
					src="https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-1 flex flex-col justify-between">
				<div className="flex justify-between">
					<div className="flex flex-col gap-3px">
						<span className="font-bold text-20px leading-16px">Secret Garden</span>
						<span className="font-bold text-14px leading-16px">NotJake</span>
					</div>
					<div className="flex gap-3">
						<div className="flex gap-5px relative">
							<MobileLikeSVG />
							<MobileAddCircleSVG />
							<div
								ref={speakerRef}
								onClick={handleSpeakerClick}
								className="cursor-pointer"
							>
								<MobileSpeakerSVG />
							</div>

							{/* 볼륨바 */}
							{showVolumeBar && (
								<div
									ref={volumeBarRef}
									className="absolute bottom-full right-4px mb-5 w-14px h-64px bg-white p-1 z-50"
									style={{ boxShadow: "0px 4px 20px 0px #0000004D" }}
									onMouseDown={handleMouseDown}
									onTouchStart={handleTouchStart}
								>
									<div className="relative w-full h-full flex justify-center">
										{/* 배경 바 */}
										<div className="absolute w-1px h-full bg-black" />
										{/* 볼륨 레벨 바 */}
										<div
											className="absolute bottom-0 w-4px bg-black"
											style={{ height: `${volumeLevel * 100}%` }}
										/>
									</div>
								</div>
							)}
						</div>
						<div>
							<MobilePauseCircleSVG />
						</div>
					</div>
				</div>
				<div
					ref={progressBarRef}
					className="relative w-full h-6px flex items-center cursor-pointer"
					onMouseDown={handleProgressMouseDown}
					onTouchStart={handleProgressTouchStart}
				>
					<div className="absolute w-full h-2px bg-black" />
					<div
						className="absolute h-6px bg-black"
						style={{ width: `${progress * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
};
