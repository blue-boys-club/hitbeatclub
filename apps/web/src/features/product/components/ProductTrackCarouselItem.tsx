import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Link from "next/link";
import { AlbumCoverCard } from "@/components/ui";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import { DraggableProductWrapper } from "@/features/dnd/components/DraggableProductWrapper";
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

interface ProductTrackCarouselItemProps {
	track: ProductRowByDashboardResponse;
	/** 원본 리스트상의 인덱스 (옵션) */
	index?: number;
	/** 컨텍스트 기반 자동 플레이리스트 설정 (옵션) */
	playlistConfig?: PlaylistAutoRequest;
}
export const ProductTrackCarouselItem = ({ track, index, playlistConfig }: ProductTrackCarouselItemProps) => {
	const { productName, seller, coverImage } = track;
	const isTitlePureEnglish = checkIsPureEnglish(track.productName);
	const isArtistPureEnglish = checkIsPureEnglish(track.seller?.stageName || "");

	return (
		<DraggableProductWrapper
			productId={track.id}
			meta={track}
			index={index}
			playlistConfig={playlistConfig}
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
					autoPlaylistConfig={playlistConfig}
					trackIndex={index}
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
