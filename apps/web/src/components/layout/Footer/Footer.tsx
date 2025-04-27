"use client";

import { useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Like, ShoppingBag } from "@/assets/svgs";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControl } from "./VolumeControl";
import Image from "next/image";
export const Footer = () => {
	// UI-related state
	const [like, setLike] = useState(false);
	const [cart, setCart] = useState(false);

	// Audio player state and controls
	const audioPlayerState = useAudioPlayer();

	const onClickLike = () => {
		setLike(!like);
	};

	const onClickCart = () => {
		setCart(!cart);
	};

	return (
		<div className="relative w-full h-20 bg-white border-t-8 border-black">
			<div className="flex items-center justify-between w-full p-2">
				{/* 트랙 정보 및 좋아요/장바구니 */}
				<div className="flex items-center gap-2 w-96">
					<div className="flex items-center justify-between gap-4">
						<Image
							width={60}
							height={60}
							alt="track"
							className="border-black w-14 h-14"
							src="https://placehold.co/60x60"
						/>
						<div className="flex flex-col gap-1">
							<div className="text-xl font-bold leading-none text-black">빈지노 타입비트...</div>
							<div className="text-base font-bold leading-none w-36 text-black/70">빈지노</div>
						</div>
					</div>

					<div className="flex justify-between items-center gap-[10px]">
						<div
							className="flex items-center justify-center w-8 h-8 cursor-pointer"
							onClick={onClickLike}
						>
							{like ? (
								<Image
									width={20}
									height={20}
									className="w-5 h-5"
									src="/assets/ActiveLike.png"
									alt="like"
								/>
							) : (
								<Like />
							)}
						</div>
						<div
							onClick={onClickCart}
							className="cursor-pointer"
						>
							<ShoppingBag color={cart ? "#3884FF" : "white"} />
						</div>
					</div>
				</div>

				{/* 재생 컨트롤 */}
				<div className="flex justify-center flex-1 ">
					<AudioPlayer
						{...audioPlayerState}
						url={"dummyMusic.mp3"}
					/>
				</div>

				{/* 볼륨 컨트롤 */}
				<div className="flex justify-end w-96">
					<VolumeControl {...audioPlayerState} />
				</div>
			</div>
		</div>
	);
};
