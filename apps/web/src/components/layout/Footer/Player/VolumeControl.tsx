"use client";

import { Mute, PlayList, Volume, VolumeThumb } from "@/assets/svgs";
import { useAudioContext } from "@/contexts/AudioContext";
import * as Slider from "@radix-ui/react-slider";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";
import { useCallback, useMemo } from "react";

export const VolumeControl = () => {
	const { volume, isMuted, onVolumeChange, onMuteToggle } = useAudioContext();
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
					className="relative flex h-5 w-[200px] items-center cursor-pointer group"
					defaultValue={[0.5]}
					value={[volume]}
					min={0}
					max={1}
					step={0.01}
					onValueChange={(value) => onVolumeChange(value[0] ?? 0)}
				>
					<Slider.Track className="relative h-[2px] grow bg-black">
						<Slider.Range className="absolute h-[6px] top-1/2 -translate-y-1/2 bg-black" />
					</Slider.Track>
					<Slider.Thumb
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
						aria-label="Volume"
					>
						<VolumeThumb />
					</Slider.Thumb>
				</Slider.Root>
			</div>
		</div>
	);
};
