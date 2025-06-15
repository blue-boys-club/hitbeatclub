import { Search } from "@/assets/svgs";
import { StarInCircle } from "@/assets/svgs/StarInCircle";
import { MobileMyFollowArtistItem, MobileMyPageTitle } from "@/features/mobile/my/components";

export const MobileMyFollowPage = () => {
	return (
		<div className="flex flex-col">
			<MobileMyPageTitle
				icon={<StarInCircle />}
				title="My Artists"
				right={"87 Following"}
			/>
			<div className="bg-hbc-gray-100 h-8 px-4 rounded-30px flex items-center mb-7">
				<input
					className="flex-1 placeholder:text-hbc-gray-400 focus:outline-none"
					placeholder="My Artists 검색하기"
				/>
				<Search
					width={19}
					height={19}
					fill="#4D4D4F"
				/>
			</div>
			<div className="grid grid-cols-3 gap-x-6 gap-y-3 w-full">
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
				<MobileMyFollowArtistItem />
			</div>
		</div>
	);
};
