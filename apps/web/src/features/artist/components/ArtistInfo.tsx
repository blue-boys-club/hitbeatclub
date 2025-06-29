"use client";

import { memo, useMemo, useState } from "react";
import {
	FilledInstagram,
	LargeAuthBadge,
	More,
	RedPlayCircle,
	ShuffleOff,
	ShuffleOn,
	SoundCloud,
	Tiktok,
	Youtube,
} from "@/assets/svgs";
import { ArtistAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ArtistDropdown } from "./ArtistDropdown";
import { ArtistReportModal } from "./ArtistReportModal";
import { useToast } from "@/hooks/use-toast";
import { useBlockArtistMutation, useUnblockArtistMutation } from "@/apis/artist/mutation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption, useAllFollowedArtistsQueryOptions } from "@/apis/user/query/user.query-option";
import { getArtistDetailBySlugQueryOption } from "@/apis/artist/query/artist.query-options";
import UserProfileImage from "@/assets/images/user-profile.png";
import { useDeleteFollowedArtistMutation, useUpdateFollowedArtistMutation } from "@/apis/user/mutations";
import { UserFollowArtistListResponse } from "@hitbeatclub/shared-types";
import { usePlaylist } from "@/hooks/use-playlist";
import { createPlaylistConfig } from "@/components/layout/PlaylistProvider";

interface DropdownOption {
	label: string;
	value: string;
	onClick: () => void;
}

/**
 * 아티스트 페이지의 헤더 컴포넌트
 * - 아티스트 프로필 이미지, 이름, 인증 배지 표시
 * - 재생, 셔플, 더보기 기능
 * - 팔로우/팔로워 정보
 * - SNS 링크
 * - 트랙 수, 방문자 수 표시
 * - 아티스트 소개
 */

interface ArtistInfoProps {
	slug: string;
}

export const ArtistInfo = memo(({ slug }: ArtistInfoProps) => {
	const [isShuffleOn, setIsShuffleOn] = useState(false);
	const [isOpenDropdown, setIsOpenDropdown] = useState(false);
	const [isOpenReportModal, setIsOpenReportModal] = useState(false);
	const { toast } = useToast();

	const { data: userMe } = useQuery({ ...getUserMeQueryOption() });

	const { mutate: followArtist } = useUpdateFollowedArtistMutation(userMe?.id ?? 0);
	const { mutate: deleteFollowedArtist } = useDeleteFollowedArtistMutation(userMe?.id ?? 0);
	const { data: followedArtistList } = useQuery({
		...useAllFollowedArtistsQueryOptions(userMe?.id ?? 0),
	});

	const { mutateAsync: blockArtist } = useBlockArtistMutation();
	const { mutateAsync: unblockArtist } = useUnblockArtistMutation();

	const { data: artist } = useQuery({
		...getArtistDetailBySlugQueryOption(slug),
	});

	// Playlist hooks
	const { createAutoPlaylistAndPlay, toggleShuffle, isShuffleEnabled } = usePlaylist();

	const isFollwingArtist = followedArtistList?.some(
		(followedArtist: UserFollowArtistListResponse) => followedArtist.artistId === artist?.id,
	);
	const isBlockedArtist = userMe?.blockArtistList.some((blockedArtist) => blockedArtist.artistId === artist?.id);

	const onPlay = async () => {
		if (isBlockedArtist) return;
		if (!artist?.id) return;
		try {
			await createAutoPlaylistAndPlay(createPlaylistConfig.artist(artist.id, { isPublic: true }), 0);
		} catch (error) {
			console.error("[ArtistInfo] createAutoPlaylistAndPlay failed", error);
		}
	};

	const onShuffle = () => {
		if (isBlockedArtist) return;
		toggleShuffle();
		setIsShuffleOn((prev) => !prev);
	};

	const onOpenDropdown = () => {
		setIsOpenDropdown((prev) => !prev);
	};

	const onOpenReportModal = () => {
		setIsOpenDropdown(false);
		setIsOpenReportModal((prev) => !prev);
	};

	const onCloseReportModal = () => {
		setIsOpenReportModal(false);
		toast({
			description: "신고 접수가 완료되었습니다.",
		});
	};

	const options: DropdownOption[] = [
		{
			label: "팔로잉 취소",
			value: "unfollow",
			onClick: () => {
				if (!artist?.id) return;
				deleteFollowedArtist(artist.id);
				setIsOpenDropdown(false);
				toast({
					description: "팔로잉이 취소되었습니다.",
				});
			},
		},
		{
			label: isBlockedArtist ? "차단 해제" : "차단하기",
			value: "block",
			onClick: () => {
				if (!artist?.id) return;
				if (isBlockedArtist) {
					unblockArtist({ artistId: artist.id });
				} else {
					blockArtist({ artistId: artist.id });
				}

				setIsOpenDropdown(false);
				toast({
					description: isBlockedArtist ? "아티스트가 차단 해제되었습니다." : "아티스트가 차단되었습니다.",
				});
			},
		},
		{
			label: "신고하기",
			value: "report",
			onClick: onOpenReportModal,
		},
	];

	const artistProfileImage = useMemo(() => {
		return artist?.profileImage?.url || artist?.profileImageUrl || UserProfileImage;
	}, [artist]);

	return (
		<div className="flex items-center gap-9 font-suisse px-8.5 py-10 border-b-2">
			<ArtistAvatar
				src={artistProfileImage}
				alt="artist avatar"
				className="w-[192px] h-[192px] outline-4 bg-white"
			/>

			<div className="w-[343px] flex flex-col gap-2">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<div className="text-[40px] font-bold leading-[40px] tracking-0.4px">{artist?.stageName}</div>
						{artist?.isVerified && <LargeAuthBadge />}
					</div>

					<div className="flex items-center gap-3">
						<div
							className="cursor-pointer"
							onClick={onPlay}
						>
							<RedPlayCircle />
						</div>
						<div
							className="cursor-pointer"
							onClick={onShuffle}
						>
							{isShuffleOn ? <ShuffleOn /> : <ShuffleOff />}
						</div>
						<div
							className="cursor-pointer"
							onClick={onOpenDropdown}
						>
							<More />
						</div>

						{isOpenDropdown && <ArtistDropdown options={options} />}

						{artist && (
							<ArtistReportModal
								isOpen={isOpenReportModal}
								onCloseModal={onCloseReportModal}
								artistId={artist.id}
							/>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant={isFollwingArtist ? "fill" : "outline"}
						rounded="full"
						onClick={() => {
							if (!artist?.id) return;
							if (isFollwingArtist) {
								deleteFollowedArtist(artist.id);
							} else {
								followArtist(artist.id);
							}
						}}
					>
						{isFollwingArtist ? "Following" : "Follow"}
					</Button>

					<div className="text-[12px] font-semibold leading-[18px] tracking-0.12px">
						{artist?.followerCount} Followers
					</div>
				</div>

				<div className="flex items-center gap-2">
					{artist?.instagramAccount && (
						<a
							href={`https://www.instagram.com/${artist?.instagramAccount}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<FilledInstagram />
						</a>
					)}
					{artist?.youtubeAccount && (
						<a
							href={`https://www.youtube.com/${artist?.youtubeAccount}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Youtube />
						</a>
					)}
					{artist?.soundcloudAccount && (
						<a
							href={`https://www.soundcloud.com/${artist?.soundcloudAccount}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<SoundCloud />
						</a>
					)}
					{artist?.tiktokAccount && (
						<a
							href={`https://www.tiktok.com/${artist?.tiktokAccount}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Tiktok />
						</a>
					)}
				</div>

				<div className="text-[12px] text-[#777] font-medium leading-[16.8px]">
					<div>{artist?.trackCount} Tracks</div>
					<div>{artist?.viewCount} Visits</div>
				</div>

				<div className="text-[12px] text-[#1F1F21] font-semibold leading-[18px] tracking-0.12px">
					{artist?.description}
				</div>
			</div>
		</div>
	);
});

ArtistInfo.displayName = "ArtistInfo";
