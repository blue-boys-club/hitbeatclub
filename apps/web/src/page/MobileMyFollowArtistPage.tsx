import { CrossArrow } from "@/assets/svgs/CrossArrow";
import { PlayCircleBlack } from "@/assets/svgs/PlayCircleBlack";
import { MobileProductItem } from "@/features/mobile/product/components";
import Image from "next/image";

export const MobileMyFollowArtistPage = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-3 items-center">
				<div className="overflow-hidden relative w-100px h-100px rounded-full border-6px border-black">
					<Image
						alt=""
						src="https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex-1 flex justify-between items-center">
					<div className="flex flex-col items-start gap-7px">
						<span className="text-22px leading-100% font-bold">Hanroro</span>
						<div className="flex gap-7px text-12px text-hbc-gray-400 leading-150% font-[450]">
							<span>1,105 Followers</span>
							<span>76 Tracks</span>
						</div>
						<button className="rounded-30px h-21px px-10px bg-black text-12px leading-160% text-white font-semibold">
							Following
						</button>
					</div>
					<div className="flex gap-2 items-center">
						<PlayCircleBlack />
						<CrossArrow />
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
			</div>
		</div>
	);
};
