import {
	getArtistDetailBySlugQueryOption,
	getArtistDetailQueryOption,
	getArtistProductListBySlugQueryOption,
} from "@/apis/artist/query/artist.query-options";
import { CrossArrow } from "@/assets/svgs/CrossArrow";
import { PlayCircleBlack } from "@/assets/svgs/PlayCircleBlack";
import { MobileProductItem } from "@/features/mobile/product/components";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const MobileMyFollowArtistPage = ({ slug }: { slug: string }) => {
	const { data: artist } = useQuery(getArtistDetailBySlugQueryOption(slug));
	const { data: products } = useQuery(
		getArtistProductListBySlugQueryOption(slug, { page: 1, limit: 10, isPublic: true }),
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-3 items-center">
				<div className="overflow-hidden relative w-100px h-100px rounded-full border-6px border-black">
					{artist?.profileImageUrl && (
						<Image
							alt=""
							src={artist.profileImageUrl}
							fill
							className="object-cover"
						/>
					)}
				</div>
				<div className="flex-1 flex justify-between items-center">
					<div className="flex flex-col items-start gap-7px">
						<span className="text-22px leading-100% font-bold">{artist?.stageName}</span>
						<div className="flex gap-7px text-12px text-hbc-gray-400 leading-150% font-[450]">
							<span>{artist?.followerCount} Followers</span>
							<span>{artist?.trackCount} Tracks</span>
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
				{products?.data?.map((product) => (
					<MobileProductItem
						key={product.id}
						type="search"
						product={product}
					/>
				))}
			</div>
		</div>
	);
};
