"use client";

import { useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Like, ShoppingBag } from "@/assets/svgs";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControl } from "./VolumeControl";

export const Footer = () => {
	// UI-related state
	const [like, setLike] = useState(false);
	const [cart, setCart] = useState(false);

	// Audio player state and controls
	const audioPlayerState = useAudioPlayer();
	const url = "https://youtu.be/IeADiGzI9S8?si=x3Vnd2veGVZd751K";

	const onClickLike = () => {
		setLike(!like);
	};

	const onClickCart = () => {
		setCart(!cart);
	};

	return (
		<div className="w-full h-20 relative bg-white border-t-8 border-black">
			<div className="w-full p-2 flex justify-between items-center">
				{/* 트랙 정보 및 좋아요/장바구니 */}
				<div className="w-96 flex items-center gap-2">
					<div className="flex justify-between items-center gap-4">
						<img
							className="w-14 h-14 border-black"
							src="https://placehold.co/60x60"
						/>
						<div className="flex flex-col gap-1">
							<div className="text-black text-xl font-bold font-['SUIT'] leading-none">빈지노 타입비트...</div>
							<div className="w-36 text-black/70 text-base font-bold font-['SUIT'] leading-none">빈지노</div>
						</div>
					</div>

					<div className="flex justify-between items-center gap-[10px]">
						<div
							className="w-8 h-8 flex justify-center items-center cursor-pointer"
							onClick={onClickLike}
						>
							{like ? (
								<img
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
				<div className="flex-1 flex justify-center ">
					<AudioPlayer
						{...audioPlayerState}
						url={"dummyMusic.mp3"}
					/>
				</div>

				{/* 볼륨 컨트롤 */}
				<div className="w-96 flex justify-end">
					<VolumeControl {...audioPlayerState} />
				</div>
			</div>
		</div>
	);
};
