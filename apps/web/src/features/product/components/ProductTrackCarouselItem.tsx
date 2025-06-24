import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Link from "next/link";
import { AlbumCoverCard } from "@/components/ui";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import { DraggableProductWrapper } from "@/features/dnd/components/DraggableProductWrapper";

interface ProductTrackCarouselItemProps {
	track: ProductRowByDashboardResponse;
}
export const ProductTrackCarouselItem = ({ track }: ProductTrackCarouselItemProps) => {
	const { productName, seller, coverImage } = track;
	const isTitlePureEnglish = checkIsPureEnglish(track.productName);
	const isArtistPureEnglish = checkIsPureEnglish(track.seller?.stageName || "");

	return (
		<DraggableProductWrapper
			productId={track.id}
			meta={track}
		>
			<div
				// TODO: 상품 상세 페이지 링크 추가
				// href={`/products/${track.id}`}
				className="inline-flex flex-col items-start justify-start w-48 gap-6px"
			>
				<AlbumCoverCard
					albumImgSrc={coverImage?.url || ""}
					size="xl"
					rounded="none"
					border="main"
					productId={track.id}
				/>
				<div className="flex flex-col items-start justify-start gap-3px">
					<div className="inline-flex items-center justify-center gap-10px">
						<Link
							href={`/products/${track.id}`}
							className={cn(
								"justify-start text-hbc-black text-18px font-semibold leading-24px tracking-018px",
								isTitlePureEnglish ? "font-suisse" : "font-suit",
							)}
						>
							{productName}
						</Link>
						{/* {isHit && <Hit />} */}
					</div>
					<Link
						href={`/artists/${track.seller?.slug || track.seller?.id}`}
						className={cn(
							"w-48 justify-start text-zinc-500 text-16px font-normal leading-18px tracking-016px",
							isArtistPureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{seller?.stageName}
					</Link>
				</div>
			</div>
		</DraggableProductWrapper>
	);
};
