"use client";

import { useState } from "react";
import { Acapella, Beat, Download } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { type ClassValue } from "clsx";
import Image from "next/image";
import { DownloadConfirmationModal } from "./modal/DownloadConfirmationModal";
import type { PaymentOrderItem } from "@hitbeatclub/shared-types/payment";
import type { ContactLink } from "../types";
import { useToast } from "@/hooks/use-toast";
import UI from "@/components/ui";

type OrderProductItemProps = {
	item: PaymentOrderItem;
	className?: ClassValue;
};

/**
 * 개별 주문 상품 항목을 표시하는 컴포넌트입니다.
 */
export const OrderProductItem = ({ item, className }: OrderProductItemProps) => {
	const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
	const { toast } = useToast();

	const handleDownload = () => {
		// Download the zip file
		if (item.product.zipFile?.url) {
			window.open(item.product.zipFile.url, "_blank");
			toast({
				description: "파일이 다운로드 되었습니다.",
			});
		} else {
			toast({
				description: "다운로드 파일을 찾을 수 없습니다.",
				variant: "destructive",
			});
		}
		setIsDownloadModalOpen(false);
	};

	const handleDownloadClick = () => {
		setIsDownloadModalOpen(true);
	};

	const handleConfirmDownload = () => {
		handleDownload();
		setIsDownloadModalOpen(false);
	};

	// Determine product type from category (스키마에서 ACAPELA로 정의되어 있음)
	const isAcappella = item.product.category === "ACAPELA";
	const isBeat = item.product.category === "BEAT";

	// Create artist contact links from product seller data
	// 현재 ProductDetailResponse의 seller에는 연락처 정보가 없으므로 빈 배열 반환
	const artistLinks: ContactLink[] = [];

	// TODO: 판매자 연락처 정보가 필요하다면 다음과 같은 필드들이 seller에 추가되어야 함:
	// - instagramAccount, youtubeAccount, kakaoAccount, discordAccount 등
	// 그러면 다음과 같이 변환할 수 있음:
	// const artistLinks: ContactLink[] = [
	//   { type: "instagram", value: item.product.seller.instagramAccount },
	//   { type: "youtube", value: item.product.seller.youtubeAccount },
	//   // ... 기타 연락처
	// ].filter(link => link.value); // 빈 값 제거

	return (
		<>
			<div
				key={item.product.id}
				className={cn(
					"self-stretch py-3 bg-hbc-white border-t border-dashed border-hbc-black flex flex-col justify-start items-start gap-2.5",
					className,
				)}
			>
				<div className={cn("self-stretch h-20 relative inline-flex justify-between items-center")}>
					<div className={cn("flex justify-start items-center gap-3")}>
						<Image
							className={cn("size-20 rounded-5px border border-hbc-black")}
							src={item.product.coverImage?.url || "https://placehold.co/79x79"}
							alt={item.product.productName}
							width={79}
							height={79}
						/>
						<div className={cn("w-96 h-20 py-1 inline-flex flex-col justify-between items-start")}>
							<div className={cn("self-stretch inline-flex justify-start items-center overflow-hidden gap-2")}>
								<span
									className={cn(
										"max-w-80 text-hbc-black text-20px font-bold font-suit leading-120% tracking-02px truncate",
									)}
								>
									{item.product.productName}
								</span>
								{isAcappella && <Acapella />}
								{isBeat && <Beat />}
							</div>
							<div className={cn("h-4 py-5px inline-flex justify-start items-center gap-228px")}>
								<UI.BodySmall
									className={cn("text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight")}
								>
									{item.licenseType}
								</UI.BodySmall>
							</div>
							<div className={cn("rounded-5px inline-flex justify-center items-center gap-2.5 overflow-hidden")}>
								<button
									className={"text-hbc-blue text-12px font-bold font-suit leading-16px tracking-012px cursor-pointer"}
								>
									라이센스 보기
								</button>

								{/* BPM and key information */}
								{(item.product.minBpm || item.product.maxBpm || item.product.musicKey) && (
									<div
										className={cn(
											"absolute left-[388px] top-61px text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight",
										)}
									>
										{item.product.minBpm && item.product.maxBpm && `${item.product.minBpm}-${item.product.maxBpm}BPM`}
										{item.product.minBpm && item.product.maxBpm && item.product.musicKey && " / "}
										{item.product.musicKey && `${item.product.musicKey} ${item.product.scaleType || ""}`}
									</div>
								)}
							</div>
						</div>
					</div>
					<div className={cn("w-28 h-20 py-1 inline-flex flex-col justify-between items-end")}>
						<div className={cn("inline-flex justify-start items-center")}>
							<div className={cn("text-hbc-black text-12px font-medium font-suisse leading-none tracking-tight")}>
								{item.price.toLocaleString()}
							</div>
							<div className={cn("text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>원</div>
						</div>
						<button
							className={cn(
								"w-28 h-10 px-2 py-1 rounded-5px outline-2 outline-offset-[-2px] inline-flex justify-center items-center gap-2.5 transition-opacity",
								"bg-hbc-white outline-hbc-black text-hbc-black group hover:bg-[#3884FF] hover:outline-[#3884FF] hover:text-hbc-white cursor-pointer",
							)}
							onClick={handleDownloadClick}
						>
							<div className={cn("size-4 relative group-hover:[&_path]:fill-hbc-white")}>
								<Download />
							</div>
							<div className={cn("text-12px font-medium font-suisse leading-none tracking-tight")}>Download</div>
						</button>
					</div>
				</div>
			</div>

			<DownloadConfirmationModal
				isOpen={isDownloadModalOpen}
				onClose={() => setIsDownloadModalOpen(false)}
				onConfirmDownload={handleConfirmDownload}
				links={artistLinks}
			/>
		</>
	);
};
