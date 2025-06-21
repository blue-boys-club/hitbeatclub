import Image from "next/image";

interface MobileMyFollowArtistItemProps {
	stageName: string | null;
	profileImageUrl: string | null;
	followerCount: number;
}

export const MobileMyFollowArtistItem = ({
	stageName,
	profileImageUrl,
	followerCount,
}: MobileMyFollowArtistItemProps) => {
	return (
		<div className="flex flex-col gap-3">
			<div className="relative overflow-hidden aspect-square border-4px border-black rounded-full bg-black">
				<Image
					alt={stageName || ""}
					src={profileImageUrl || "https://placehold.co/150x150/000000/FFFFFF?text=NO+IMAGE"}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center">
					<span className="text-18px leading-28px font-semibold">{stageName}</span>
					<span className="text-12px leading-150%">{followerCount.toLocaleString()} Followers</span>
				</div>
				<button className="rounded-30px h-21px px-10px bg-black text-12px leading-160% text-white font-semibold">
					Following
				</button>
			</div>
		</div>
	);
};
