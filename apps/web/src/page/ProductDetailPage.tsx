"use client";

import { memo, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Acapella, Beat, Like, RedPlayCircle, PauseCircle } from "@/assets/svgs";
import { AlbumAvatar, FreeDownloadButton, UserAvatar } from "@/components/ui";
import { GenreButton } from "@/components/ui/GenreButton";
import { TagButton } from "@/components/ui/TagButton";
import { LicenseNote, ProductDetailLicense, PurchaseWithCartTrigger } from "../features/product/components";
import { LicenseColor, LicenseType } from "../features/product/product.constants";
import { LICENSE_MAP_TEMPLATE } from "@/apis/product/product.dummy";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getProductFileDownloadLinkQueryOption,
	getProductQueryOption,
} from "@/apis/product/query/product.query-option";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useToast } from "@/hooks/use-toast";
import { useLikeProductMutation } from "@/apis/product/mutations/useLikeProductMutation";
import { useUnlikeProductMutation } from "@/apis/product/mutations/useUnLikeProductMutation";
import UserProfileImage from "@/assets/images/user-profile.png";
import { cn } from "@/common/utils";
import Link from "next/link";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { getProductFileDownloadLink } from "@/apis/product/product.api";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { usePlayTrack } from "@/hooks/use-play-track";

interface ProductDetailPageProps {
	trackId: number;
}

const ProductDetailPage = memo(({ trackId }: ProductDetailPageProps) => {
	const router = useRouter();
	const { data: product } = useQuery({
		...getProductQueryOption(trackId),
	});

	const { toast } = useToast();
	const likeProductMutation = useLikeProductMutation();
	const unlikeProductMutation = useUnlikeProductMutation();

	const { data: user } = useQuery(getUserMeQueryOption());
	const { productId: currentProductId, isPlaying } = useAudioStore(
		useShallow((state) => ({
			productId: state.productId,
			isPlaying: state.isPlaying,
		})),
	);

	const { play } = usePlayTrack();

	const isCurrentTrackPlaying = useMemo(
		() => product?.id === currentProductId && isPlaying,
		[product?.id, currentProductId, isPlaying],
	);

	const isSubscribed = useMemo(() => {
		return !!user?.subscribedAt;
	}, [user?.subscribedAt]);

	const onPlay = useCallback(() => {
		if (!product) return;
		play(product.id);
	}, [product, play]);

	const onLikeClick = () => {
		if (!user) {
			toast({
				description: "로그인 후 이용해주세요.",
			});
			return;
		}

		if (!product) {
			return;
		}

		// 현재 좋아요 상태에 따라 적절한 mutation 실행
		if (product.isLiked) {
			unlikeProductMutation.mutate(product.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요 취소에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		} else {
			likeProductMutation.mutate(product.id, {
				onSuccess: () => {},
				onError: () => {
					toast({
						description: "좋아요에 실패했습니다.",
						variant: "destructive",
					});
				},
			});
		}
	};

	const queryClient = useQueryClient();
	const onClickFreeDownload = useCallback(async () => {
		if (!user) {
			toast({
				description: "로그인 후 이용해주세요.",
			});
			return;
		}

		if (isSubscribed && product?.id) {
			const downloadUrl = await queryClient.fetchQuery(
				// getProductFileDownloadLinkQueryOption(product.id, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE),
				getProductFileDownloadLinkQueryOption(product.id, ENUM_FILE_TYPE.PRODUCT_ZIP_FILE),
			);
			if (downloadUrl) {
				const link = document.createElement("a");
				link.href = downloadUrl.data.url;
				// link.download = downloadUrl.data.originalName || `${product?.productName}.zip`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				toast({
					description: "다운로드 링크를 가져오는데 실패했습니다.",
					variant: "destructive",
				});
			}
		} else {
			toast({
				description: "구독 후 이용가능합니다.",
			});
			// alert("준비중입니다.");
		}
	}, [isSubscribed, product?.id, queryClient, toast]);

	// 라이센스 정보 처리 (라이센스 표시용)
	const licenses = useMemo(() => {
		if (!product?.licenseInfo) return [];

		return product.licenseInfo.map((licenseInfo) => ({
			id: licenseInfo.id,
			type: licenseInfo.type as LicenseType,
			price: licenseInfo.price,
			...LICENSE_MAP_TEMPLATE[licenseInfo.type as keyof typeof LICENSE_MAP_TEMPLATE],
		}));
	}, [product?.licenseInfo]);

	const artistProfileUrl = useMemo(() => {
		if (!product?.seller?.profileImageUrl || product?.seller?.profileImageUrl === "") {
			return UserProfileImage;
		}
		return product.seller.profileImageUrl;
	}, [product?.seller?.profileImageUrl]);

	return (
		<>
			<main className="px-9 pt-10">
				<article className="flex gap-10">
					<aside>
						<AlbumAvatar
							src={product?.coverImage?.url || "https://placehold.co/192x192"}
							isPlaying={isCurrentTrackPlaying}
							onClick={onPlay}
						/>
					</aside>

					<section className="flex flex-col gap-5 w-full">
						<header className="flex justify-between items-center gap-2">
							<div className="flex items-center gap-2">
								<div className="w-[400px] flex items-center gap-2">
									<h1 className="text-32px font-extrabold leading-[40px] tracking-0.32px truncate">
										{product?.productName}
									</h1>
									<div>
										{product?.category === "BEAT" && <Beat className="w-[48px] h-[13px]" />}
										{product?.category === "ACAPELA" && <Acapella className="w-fit h-[13px]" />}
									</div>
								</div>
							</div>

							<button
								className="cursor-pointer"
								aria-label={isCurrentTrackPlaying ? "일시정지" : "재생하기"}
								onClick={onPlay}
							>
								{isCurrentTrackPlaying ? (
									<div className="[&_g_path]:fill-black">
										<PauseCircle />
									</div>
								) : (
									<RedPlayCircle />
								)}
							</button>
						</header>

						<div className="flex justify-between items-center">
							<Link
								href={`/artists/${product?.seller?.slug || product?.seller?.id}`}
								className="flex items-center gap-2 hover:underline"
							>
								<UserAvatar
									src={artistProfileUrl}
									className={cn("w-[51px] h-[51px] bg-black", artistProfileUrl === UserProfileImage && "bg-white")}
									size="large"
								/>
								<span className="text-16px font-bold">{product?.seller?.stageName}</span>
							</Link>

							<button
								className="cursor-pointer w-8 h-8 flex justify-center items-center hover:opacity-80 transition-opacity"
								onClick={onLikeClick}
								aria-label={product?.isLiked ? "좋아요 취소" : "좋아요"}
							>
								{product?.isLiked ? (
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
							<div className="flex flex-col gap-9px">
								<nav
									className="flex flex-wrap gap-9px"
									aria-label="음계 및 BPM 정보"
								>
									<GenreButton
										name={`${product?.musicKey || ""} ${(product?.scaleType || "").toLowerCase()}`}
										showDeleteButton={false}
										readOnly
									/>
									<GenreButton
										name={
											product?.minBpm === product?.maxBpm
												? `BPM ${product?.minBpm || 0}`
												: `BPM ${product?.minBpm || 0} - ${product?.maxBpm || 0}`
										}
										showDeleteButton={false}
										readOnly
									/>
								</nav>

								<nav
									className="flex flex-wrap gap-9px"
									aria-label="장르 목록"
								>
									{product?.genres?.map((genre) => (
										<GenreButton
											key={genre.name}
											name={genre.name}
											showDeleteButton={false}
											readOnly
										/>
									))}
								</nav>
							</div>

							<div className="flex flex-col gap-0.5">
								{!!product?.isFreeDownload && (
									<FreeDownloadButton
										variant="secondary"
										className="outline-4 outline-hbc-black px-2.5 font-suisse"
										onClick={onClickFreeDownload}
									>
										Free Download
									</FreeDownloadButton>
								)}
								{product && <PurchaseWithCartTrigger productId={product.id} />}
							</div>
						</div>

						<section>
							<h2 className="text-[16px] font-bold">곡 정보</h2>
							<p className="text-16px text-[#777] leading-[22px]">{product?.description}</p>
						</section>

						<nav
							className="flex flex-wrap gap-2"
							aria-label="태그 목록"
						>
							{product?.tags?.map((tag) => (
								<TagButton
									key={tag.name}
									name={tag.name}
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
						{licenses.map((license) => (
							<div
								key={license.id}
								className="flex flex-1 gap-5"
							>
								<ProductDetailLicense
									type={license.type}
									price={`${license.price.toLocaleString()} KRW`}
									notes={license.notes as LicenseNote[]}
									isClickable={false}
								/>
							</div>
						))}
					</div>
				</section>
			</main>
		</>
	);
});

ProductDetailPage.displayName = "ProductDetailPage";

export default ProductDetailPage;
