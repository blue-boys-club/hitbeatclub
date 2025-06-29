"use client";

import { Mute, PlayList, Volume, VolumeThumb } from "@/assets/svgs";
import { useAudioContext } from "@/contexts/AudioContext";
import { Slider } from "@base-ui-components/react/slider";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";
import { useCallback, useMemo, useState, useRef } from "react";

export const VolumeControl = () => {
	const { onVolumeChange, onMuteToggle, volume, isMuted } = useAudioContext();

	// 개별 상태 구독
	// const volume = useVolume();
	// const isMuted = useIsMuted();

	// 볼륨 슬라이더 드래그 중 임시 값 저장
	const [tempVolumeValue, setTempVolumeValue] = useState<number>(0.5);
	const [isVolumeChanging, setIsVolumeChanging] = useState<boolean>(false);

	const {
		isOpen,
		currentType,
		setRightSidebar,
		// currentTrackId = 12,
	} = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			currentType: state.rightSidebar.currentType,
			setRightSidebar: state.setRightSidebar,
		})),
	);

	const playlistColor = useMemo(() => {
		// return isOpen ? "black" : "white";
		return isOpen && currentType === SidebarType.PLAYLIST ? "var(--hbc-red)" : "var(--hbc-black)";
	}, [currentType, isOpen]);

	const toggleRightSidebar = useCallback(() => {
		if (isOpen && currentType !== SidebarType.PLAYLIST) {
			setRightSidebar(true, { currentType: SidebarType.PLAYLIST });
		} else if (isOpen && currentType === SidebarType.PLAYLIST) {
			setRightSidebar(false);
		} else {
			setRightSidebar(true, { currentType: SidebarType.PLAYLIST });
		}
	}, [isOpen, currentType, setRightSidebar]);

	// 볼륨 슬라이더 드래그 시작
	const handleVolumeChangeStart = useCallback(() => {
		setIsVolumeChanging(true);
		setTempVolumeValue(volume);
	}, [volume]);

	// 볼륨 슬라이더 값 변경 중 (드래그 중)
	const handleVolumeChange = useCallback((value: number[]) => {
		const newVolume = value[0] ?? 0;
		setTempVolumeValue(newVolume);
	}, []);

	// 볼륨 슬라이더 드래그 완료
	const handleVolumeChangeEnd = useCallback(
		(value: number[]) => {
			const newVolume = value[0] ?? 0;
			onVolumeChange(newVolume);
			setTempVolumeValue(newVolume);
			setIsVolumeChanging(false);
		},
		[onVolumeChange],
	);

	// 사용자가 조작 중이 아닐 때만 volume으로 업데이트
	const sliderVolume = isVolumeChanging ? tempVolumeValue : volume;

	return (
		<div className="inline-flex justify-center items-center gap-4 relative">
			<button
				className="cursor-pointer"
				onClick={toggleRightSidebar}
			>
				<PlayList color={playlistColor} />
			</button>

			<div className="flex items-center gap-2">
				<div
					className="cursor-pointer"
					onClick={onMuteToggle}
				>
					{isMuted || volume === 0 ? <Mute /> : <Volume />}
				</div>

				<Slider.Root
					value={[sliderVolume]}
					min={0}
					max={1}
					step={0.01}
					onValueChange={handleVolumeChange}
					onValueCommitted={handleVolumeChangeEnd}
					onPointerDown={handleVolumeChangeStart}
				>
					<Slider.Control className="relative flex h-5 w-[200px] items-center cursor-pointer group">
						<Slider.Track className="relative h-[6px] grow">
							<div className="absolute h-[2px] w-full top-1/2 -translate-y-1/2 bg-black" />
							<Slider.Indicator className="relative h-[6px] w-full top-1/2 -translate-y-1/2 bg-black" />
							<Slider.Thumb
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								aria-label="Volume"
							>
								<VolumeThumb />
							</Slider.Thumb>
						</Slider.Track>
					</Slider.Control>
				</Slider.Root>
			</div>
		</div>
	);
};
