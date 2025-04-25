"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { Acapella, Beat, Like, RedPlayCircle } from "@/assets/svgs";
import { AlbumAvatar, FreeDownloadButton, PurchaseButton, UserAvatar } from "@/components/ui";
import { GenreButton } from "@/components/ui/GenreButton";
import { TagButton } from "@/components/ui/TagButton";
import { ProductDetailLicense } from "./ProductDetailLicense";
import { ProductDetailLicenseModal } from "./modal/ProductDetailLicenseModal";
import { LicenseColor, LicenseType } from "../product.constants";

interface TrackInfo {
	title: string;
	artist: string;
	description: string;
	albumImgSrc: string;
	price: number;
	genres: string[];
	tags: string[];
}

const LICENSE_INFO = {
	Exclusive: {
		price: "140,000 KRW",
		specialNote: {
			text: "저작권 표기 필수",
			color: LicenseColor.RED,
		},
	},
	Master: {
		price: "40,000 KRW",
		specialNote: {
			text: "저작권 일체 판매",
			color: LicenseColor.BLUE,
		},
	},
} as const;

const trackInfo: TrackInfo = {
	title: "Secret Garden",
	artist: "NotJake",
	description:
		"플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운무 가능 타입비트 입니다.플레이보이 카티 타입비트 무료다운 가능 타입비트 입니다.",
	albumImgSrc: "https://placehold.co/192x192",
	price: 15000,
	genres: ["C# minor", "BPM 120", "Boom bap", "Old School"],
	tags: ["G-funk", "Trippy", "Flower"],
};

interface ProductDetailPageProps {}

export const ProductDetailPage = memo(({}: ProductDetailPageProps) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

	const onLikeClick = () => {
		setIsLiked(!isLiked);
	};

	const onPurchaseClick = () => {
		setIsLicenseModalOpen(true);
	};

	return (
		<>
			<main className="px-9 pt-10">
				<article className="flex gap-10">
					<aside>
						<AlbumAvatar src={trackInfo.albumImgSrc} />
					</aside>

					<section className="flex flex-col gap-5">
						<header className="flex justify-between items-center gap-2">
							<div className="flex items-center gap-2">
								<div className="w-[400px] flex items-center gap-2">
									<h1 className="text-32px font-extrabold leading-[40px] tracking-0.32px truncate">
										{trackInfo.title}
									</h1>
									<div>
										<Beat className="w-[48px] h-[13px]" />
									</div>
								</div>
							</div>

							<button
								className="cursor-pointer"
								aria-label="재생하기"
							>
								<RedPlayCircle />
							</button>
						</header>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<UserAvatar
									src="https://placehold.co/51x51"
									className="w-[51px] h-[51px] bg-black"
									size="large"
								/>
								<span className="text-16px font-bold">{trackInfo.artist}</span>
							</div>

							<button
								className="cursor-pointer w-8 h-8 flex justify-center items-center hover:opacity-80 transition-opacity"
								onClick={onLikeClick}
								aria-label={isLiked ? "좋아요 취소" : "좋아요"}
							>
								{isLiked ? (
									<Image
										src="/assets/ActiveLike.png"
										alt="active like"
										width={20}
										height={20}
									/>
								) : (
									<Like />
								)}
							</button>
						</div>

						<div className="flex justify-between">
							<nav
								className="flex flex-wrap gap-2"
								aria-label="장르 목록"
							>
								{trackInfo.genres?.map((genre) => (
									<GenreButton
										key={genre}
										name={genre}
									/>
								))}
							</nav>

							<div className="flex flex-col gap-0.5">
								<FreeDownloadButton
									variant="secondary"
									className="outline-4 outline-hbc-black px-2.5 font-suisse"
								>
									Free Download
								</FreeDownloadButton>
								<PurchaseButton
									iconColor="hbc-white"
									className="outline-4 outline-hbc-black font-suisse"
									onClick={onPurchaseClick}
								>
									{trackInfo.price?.toLocaleString()} KRW
								</PurchaseButton>
							</div>
						</div>

						<section>
							<h2 className="text-[16px] font-bold">곡 정보</h2>
							<p className="text-16px text-[#777] leading-[22px]">{trackInfo.description}</p>
						</section>

						<nav
							className="flex flex-wrap gap-2"
							aria-label="태그 목록"
						>
							{trackInfo.tags.map((tag) => (
								<TagButton
									key={tag}
									name={tag}
									isClickable={false}
								/>
							))}
						</nav>
					</section>
				</article>

				<hr className="w-full h-[4px] bg-hbc-black my-7 border-0" />

				<section>
					<h2 className="mb-2.5 text-26px font-bold leading-[32px] tracking-0.26px text-center">라이센스</h2>

					<div className="flex gap-10 w-[787px] mx-auto py-10 border-t-2px border-hbc-black">
						{Object.entries(LICENSE_INFO).map(([type, info]) => (
							<div
								key={type}
								className="flex flex-1 gap-5"
							>
								<ProductDetailLicense
									type={type as LicenseType}
									price={info.price}
									specialNote={info.specialNote}
									isClickable={false}
								/>
							</div>
						))}
					</div>
				</section>
			</main>

			<ProductDetailLicenseModal
				isOpen={isLicenseModalOpen}
				onClose={() => setIsLicenseModalOpen(false)}
			/>
		</>
	);
});

ProductDetailPage.displayName = "ProductDetailPage";
