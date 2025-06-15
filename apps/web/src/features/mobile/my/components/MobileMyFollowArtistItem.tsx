import Image from "next/image";

export const MobileMyFollowArtistItem = () => {
	return (
		<div className="flex flex-col gap-3">
			<div className="relative overflow-hidden aspect-square border-4px border-black rounded-full bg-black">
				<Image
					alt=""
					src="https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center">
					<span className="text-18px leading-28px font-semibold">Not Jake</span>
					<span className="text-12px leading-150%">1,105 Followers</span>
				</div>
				<button className="rounded-30px h-21px px-10px bg-black text-12px leading-160% text-white font-semibold">
					Following
				</button>
			</div>
		</div>
	);
};
