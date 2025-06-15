import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Link from "next/link";
import Image from "next/image";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";

interface MobileProductTrackGalleryItemProps {
	track: ProductRowByDashboardResponse;
}
export const MobileProductTrackGalleryItem = ({ track }: MobileProductTrackGalleryItemProps) => {
	const isTitlePureEnglish = checkIsPureEnglish(track.productName);
	const isArtistPureEnglish = checkIsPureEnglish(track.seller?.stageName || "");

	return (
		<Link
			// TODO: 상품 상세 페이지 링크 추가
			href={`/products/${track.id}`}
			className="inline-flex flex-col items-start justify-start gap-6px w-full"
		>
			<div className="border-y-3px border-x-1px border-black relative w-full aspect-square">
				<Image
					alt="커버이미지"
					src={track.coverImage?.url || ""}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-start justify-start gap-3px w-full">
				<div className="flex items-center w-full">
					<div
						className={cn(
							"text-hbc-black text-12px font-semibold leading-16px truncate max-w-full",
							isTitlePureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{track.productName}
					</div>
					{/* {isHit && <Hit />} */}
				</div>
				<div
					className={cn("text-10px font-normal leading-10px w-full", isArtistPureEnglish ? "font-suisse" : "font-suit")}
				>
					<span className="text-hbc-gray-300 truncate block">{track.seller?.stageName}</span>
				</div>
			</div>
		</Link>
	);
};
