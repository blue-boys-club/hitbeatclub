"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeleteFollowedArtistMutation } from "@/apis/user/mutations/useDeleteFollowedArtistMutation";
import { useState } from "react";

interface MobileMyFollowArtistItemProps {
	stageName: string | null;
	profileImageUrl: string | null;
	followerCount: number;
	slug?: string | null;
	artistId: number;
	userId: number;
}

export const MobileMyFollowArtistItem = ({
	stageName,
	profileImageUrl,
	followerCount,
	slug,
	artistId,
	userId,
}: MobileMyFollowArtistItemProps) => {
	const [isUnfollowed, setIsUnfollowed] = useState(false);
	const deleteFollowedArtistMutation = useDeleteFollowedArtistMutation(userId);

	const handleUnfollow = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		deleteFollowedArtistMutation.mutate(artistId, {
			onSuccess: () => {
				setIsUnfollowed(true);
			},
		});
	};

	// 팔로우 취소된 경우 컴포넌트 숨기기
	if (isUnfollowed) {
		return null;
	}

	return (
		<Link
			href={slug ? `/mobile/my/follow/${slug}` : "#"}
			className="flex flex-col gap-3"
		>
			<div className="relative overflow-hidden aspect-square border-4px border-black rounded-full bg-black">
				<Image
					alt={stageName || ""}
					src={profileImageUrl || "https://placehold.co/150x150/000000/FFFFFF?text=NO+IMAGE"}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center">
					<span className="text-18px leading-28px font-semibold">{stageName}</span>
					<span className="text-12px leading-150%">{followerCount.toLocaleString()} Followers</span>
				</div>
				<button
					onClick={handleUnfollow}
					disabled={deleteFollowedArtistMutation.isPending}
					className="rounded-30px h-21px px-10px bg-black text-12px leading-160% text-white font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{deleteFollowedArtistMutation.isPending ? "언팔로우 중..." : "Following"}
				</button>
			</div>
		</Link>
	);
};
