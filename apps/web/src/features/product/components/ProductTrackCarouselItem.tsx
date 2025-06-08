import { Hit } from "@/assets/svgs";
import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Link from "next/link";
import { AlbumCoverCard } from "@/components/ui";
import { ProductListItem } from "../product.types";
import { useDevice } from "@/hooks/use-device";
import Image from "next/image";

interface ProductTrackCarouselItemProps {
	track: ProductListItem;
}
export const ProductTrackCarouselItem = ({ track }: ProductTrackCarouselItemProps) => {
	// const { title, artist, albumImgSrc, isHit } = track;
	const { productName, seller, coverImage } = track;
	const isTitlePureEnglish = checkIsPureEnglish(productName);
	const isArtistPureEnglish = checkIsPureEnglish(seller?.stageName || "");
	const { isPC } = useDevice();

	return isPC ? (
		<Link
			// TODO: 상품 상세 페이지 링크 추가
			href={`/products/${track.id}`}
			className="inline-flex flex-col items-start justify-start w-48 gap-6px"
		>
			<AlbumCoverCard
				albumImgSrc={coverImage?.url || ""}
				size="xl"
				rounded="none"
				border="main"
			/>
			<div className="flex flex-col items-start justify-start gap-3px">
				<div className="inline-flex items-center justify-center gap-10px">
					<div
						className={cn(
							"justify-start text-hbc-black text-18px font-semibold leading-24px tracking-018px",
							isTitlePureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{productName}
					</div>
					{/* {isHit && <Hit />} */}
				</div>
				<div
					className={cn(
						"w-48 justify-start text-zinc-500 text-16px font-normal leading-18px tracking-016px",
						isArtistPureEnglish ? "font-suisse" : "font-suit",
					)}
				>
					{seller?.stageName}
				</div>
			</div>
		</Link>
	) : (
		<Link
			// TODO: 상품 상세 페이지 링크 추가
			href={`/products/${track.id}`}
			className="inline-flex flex-col items-start justify-start gap-6px"
		>
			<div className="border-y-3px border-x-1px border-black relative w-110px h-110px">
				<Image
					alt="커버이미지"
					src={coverImage?.url || ""}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-start justify-start gap-3px">
				<div className="inline-flex items-center justify-center gap-10px">
					<div
						className={cn(
							"w-110px justify-start text-hbc-black text-12px font-semibold leading-16px truncate",
							isTitlePureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{productName}
					</div>
					{/* {isHit && <Hit />} */}
				</div>
				<div
					className={cn(
						"w-110px justify-start text-10px font-normal leading-10px truncate",
						isArtistPureEnglish ? "font-suisse" : "font-suit",
					)}
				>
					<span className="text-hbc-gray-300">{seller?.stageName}</span>
				</div>
			</div>
		</Link>
	);
};
