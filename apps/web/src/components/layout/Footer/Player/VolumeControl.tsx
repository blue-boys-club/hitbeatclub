"use client";

import { Mute, PlayList, Volume, VolumeThumb } from "@/assets/svgs";
import * as Slider from "@radix-ui/react-slider";
import { VolumeControlProps } from "../types";
export const VolumeControl = ({ volume, isMuted, onVolumeChange, onMuteToggle }: VolumeControlProps) => {
	return (
		<div className="inline-flex justify-center items-center gap-4 relative">
			<div className="cursor-pointer">
				<PlayList />
			</div>

			<div className="flex items-center gap-2">
				<div
					className="cursor-pointer"
					onClick={onMuteToggle}
				>
					{isMuted || volume.currentVolume === 0 ? <Mute /> : <Volume />}
				</div>

				<Slider.Root
					className="relative flex h-5 w-[200px] items-center cursor-pointer group"
					defaultValue={[0.5]}
					value={[volume.currentVolume]}
					min={0}
					max={1}
					step={0.01}
					onValueChange={onVolumeChange}
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
