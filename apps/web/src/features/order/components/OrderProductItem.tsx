"use client";

import { useState } from "react";
import { Acapella, Beat, Download } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { type ClassValue } from "clsx";
import Image from "next/image";
import { DownloadConfirmationModal } from "./modal/DownloadConfirmationModal";
import { ArtistInfo, Product } from "../types";
import { useToast } from "@/hooks/use-toast";
import UI from "@/components/ui";

type OrderProductItemProps = {
	product: Product;
	artistInfo: ArtistInfo;
	className?: ClassValue;
};

/**
 * 개별 주문 상품 항목을 표시하는 컴포넌트입니다.
 */
export const OrderProductItem = ({ product, artistInfo, className }: OrderProductItemProps) => {
	const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
	const { toast } = useToast();

	const handleDownload = () => {
		// create a tag and download the file
		window.open(product.downloadUrl, "_blank");

		toast({
			description: "파일이 다운로드 되었습니다.",
		});
		setIsDownloadModalOpen(false);
	};

	const handleDownloadClick = () => {
		if (product.downloadStatus === "available") {
			setIsDownloadModalOpen(true);
		} else if (product.downloadStatus === "downloaded") {
			handleDownload();
		}
	};

	const handleConfirmDownload = () => {
		handleDownload();
		setIsDownloadModalOpen(false);
	};

	return (
		<>
			<div
				key={product.id}
				className={cn(
					"self-stretch py-3 bg-hbc-white border-t border-dashed border-hbc-black flex flex-col justify-start items-start gap-2.5",
					className,
				)}
			>
				<div className={cn("self-stretch h-20 relative inline-flex justify-between items-center")}>
					<div className={cn("flex justify-start items-center gap-3")}>
						<Image
							className={cn("size-20 rounded-5px border border-hbc-black")}
							src={product.imageUrl}
							alt={product.title}
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
									{product.title}
								</span>
								{product.type === "acapella" && <Acapella />}
								{product.type === "beat" && <Beat />}
							</div>
							<div className={cn("h-4 py-5px inline-flex justify-start items-center gap-228px")}>
								<UI.BodySmall
									className={cn("text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight")}
								>
									{product.licenseType}
								</UI.BodySmall>
							</div>
							<div className={cn("rounded-5px inline-flex justify-center items-center gap-2.5 overflow-hidden")}>
								<button
									className={"text-hbc-blue text-12px font-bold font-suit leading-16px tracking-012px cursor-pointer"}
								>
									라이센스 보기
								</button>

								{(product.bpm || product.key) && (
									<div
										className={cn(
											"absolute left-[388px] top-61px text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight",
										)}
									>
										{product.bpm && `${product.bpm}BPM`} {product.bpm && product.key && " / "} {product.key}
									</div>
								)}
							</div>
						</div>
					</div>
					<div className={cn("w-28 h-20 py-1 inline-flex flex-col justify-between items-end")}>
						<div className={cn("inline-flex justify-start items-center")}>
							<div className={cn("text-hbc-black text-12px font-medium font-suisse leading-none tracking-tight")}>
								{product.price.toLocaleString()}
							</div>
							<div className={cn("text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>원</div>
						</div>
						<button
							className={cn(
								"w-28 h-10 px-2 py-1 rounded-5px outline-2 outline-offset-[-2px] inline-flex justify-center items-center gap-2.5 transition-opacity",
								"bg-hbc-white outline-hbc-black text-hbc-black group hover:bg-[#3884FF] hover:outline-[#3884FF] hover:text-hbc-white cursor-pointer",
								product.downloadStatus === "unavailable" && "opacity-50 cursor-not-allowed",
							)}
							disabled={product.downloadStatus === "unavailable"}
							onClick={handleDownloadClick}
						>
							<div
								className={cn(
									"size-4 relative group-hover:[&_path]:fill-hbc-white",
									product.downloadStatus === "downloaded" && "[&_path]:fill-gray-600",
								)}
							>
								<Download />
							</div>
							<div className={cn("text-12px font-medium font-suisse leading-none tracking-tight")}>
								{product.downloadStatus === "unavailable" ? "Unavailable" : "Download"}
							</div>
						</button>
					</div>
				</div>
			</div>

			<DownloadConfirmationModal
				isOpen={isDownloadModalOpen}
				onClose={() => setIsDownloadModalOpen(false)}
				onConfirmDownload={handleConfirmDownload}
				links={artistInfo.links}
			/>
		</>
	);
};
