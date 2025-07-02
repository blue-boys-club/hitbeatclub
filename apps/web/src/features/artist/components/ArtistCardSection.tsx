"use client";
import { checkIsPureEnglish, cn } from "@/common/utils";
import { ArtistAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import React, { useState, useEffect } from "react";
import { ArtistCardProps, ViewType } from "../artist.types";
import { useRouter } from "next/navigation";
import { useDeleteFollowedArtistMutation } from "../../../apis/user/mutations/useDeleteFollowedArtistMutation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useUpdateFollowedArtistMutation } from "../../../apis/user/mutations/useUpdateFollowedArtistMutation";
import UserProfileImage from "@/assets/images/user-profile.png";

const ArtistCardSection = ({
	artists,
	activeView = ViewType.GRID,
	hasNextPage,
	loadMoreRef,
}: ArtistCardProps & { hasNextPage: boolean; loadMoreRef: (node?: Element | null) => void }) => {
	const { data: user } = useQuery(getUserMeQueryOption());
	const { mutate: followArtist } = useUpdateFollowedArtistMutation(user?.id ?? 0);
	const { mutate: deleteFollowedArtist } = useDeleteFollowedArtistMutation(user?.id ?? 0);

	// 아티스트별 팔로우 상태를 추적하는 상태
	const [followStates, setFollowStates] = useState<Record<number, boolean>>({});

	// 초기 팔로우 상태 설정 (모든 아티스트를 팔로우 중으로 가정)
	useEffect(() => {
		if (artists) {
			const initialStates = artists.reduce(
				(acc, artist) => {
					acc[artist.artistId] = true; // 초기에는 모든 아티스트가 팔로우 중
					return acc;
				},
				{} as Record<number, boolean>,
			);
			setFollowStates(initialStates);
		}
	}, [artists]);

	const handleFollow = (e: React.MouseEvent, artistId: number) => {
		e.stopPropagation();

		const isCurrentlyFollowing = followStates[artistId];

		if (isCurrentlyFollowing) {
			// 현재 팔로우 중이면 언팔로우
			deleteFollowedArtist(artistId, {
				onSuccess: () => {
					setFollowStates((prev) => ({
						...prev,
						[artistId]: false,
					}));
				},
			});
		} else {
			// 현재 팔로우하지 않으면 팔로우
			followArtist(artistId, {
				onSuccess: () => {
					setFollowStates((prev) => ({
						...prev,
						[artistId]: true,
					}));
				},
			});
		}
	};

	const router = useRouter();

	const onClickArtist = (slug: string) => {
		router.push(`/artists/${slug}`);
	};

	return (
		<section>
			<ul
				className={cn(
					activeView === ViewType.GRID && "grid grid-cols-4 gap-auto gap-y-4",
					activeView === ViewType.LIST && "flex flex-col",
				)}
			>
				{artists && artists.length > 0 ? (
					artists.map((artist) => {
						const isFollowing = followStates[artist.artistId];
						const artistProfileImageUrl = artist.profileImageUrl || UserProfileImage;

						return (
							<li
								key={artist.artistId}
								className={cn(
									activeView === ViewType.GRID && "flex flex-col items-center justify-center gap-2 cursor-pointer",
									activeView === ViewType.LIST && "flex items-center justify-between border-t-4px py-2 cursor-pointer",
								)}
								onClick={() => artist.slug && onClickArtist(artist.slug)}
							>
								<div
									className={cn(
										activeView === ViewType.GRID && "flex flex-col gap-2",
										activeView === ViewType.LIST && "flex items-center gap-4",
									)}
								>
									<div className="flex items-center justify-center pt-2">
										<ArtistAvatar
											src={artistProfileImageUrl}
											alt={artist.stageName ?? ""}
											className={cn(
												activeView === ViewType.GRID && "size-[174px]",
												activeView === ViewType.LIST && "size-[59px]",
												"bg-hbc-black",
												artistProfileImageUrl === UserProfileImage && "bg-hbc-white",
											)}
										/>
									</div>
									<div
										className={cn(
											activeView === ViewType.GRID && "flex flex-col",
											activeView === ViewType.LIST && "flex flex-col items-start",
										)}
									>
										<p
											className={cn(
												"text-[#000]",
												"text-center",
												"font-suit",
												"text-[20px]",
												"not-italic",
												"font-semibold",
												"leading-[28px]",
												"tracking-[0.2px]",
												checkIsPureEnglish(artist.stageName) && "font-suisse",
											)}
										>
											{artist.stageName}
										</p>
										<p
											className={cn(
												"text-center",
												"text-[#4D4D4F]",
												"font-suit",
												"text-[12px]",
												"not-italic",
												"font-[450]",
												"leading-[150%]",
												"tracking-[0.12px]",
												checkIsPureEnglish(artist.stageName) && "font-suisse",
											)}
										>
											{artist.followerCount} Followers
										</p>
									</div>
								</div>
								<Button
									size="sm"
									rounded="full"
									variant={isFollowing ? "fill" : "outline"}
									onClick={(e) => handleFollow(e, artist.artistId)}
								>
									{isFollowing ? "Following" : "Follow"}
								</Button>
							</li>
						);
					})
				) : (
					<div>팔로우 한 아티스트가 없습니다.</div>
				)}
				{hasNextPage && (
					<div
						ref={loadMoreRef}
						className="h-4"
					/>
				)}
			</ul>
		</section>
	);
};

export default ArtistCardSection;
