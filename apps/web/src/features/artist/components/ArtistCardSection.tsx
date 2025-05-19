"use client";
import { cn } from "@/common/utils";
import { ArtistAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import React from "react";
import { Artist, ArtistCardProps, ViewType } from "../artist.types";
import { useRouter } from "next/navigation";

const ArtistCardSection = ({ artists, activeView }: ArtistCardProps) => {
	const handleFollow = () => {};
	const router = useRouter();

	const onClickArtist = (artistId: string) => {
		router.push(`/artists/${artistId}`);
	};

	return (
		<section>
			<ul
				className={cn(
					activeView === ViewType.GRID && "grid grid-cols-4 gap-auto gap-y-4",
					activeView === ViewType.LIST && "flex flex-col",
				)}
			>
				{artists.length > 0 ? (
					artists.map((artist: Artist) => (
						<li
							key={artist.id}
							className={cn(
								activeView === ViewType.GRID && "flex flex-col items-center justify-center gap-2",
								activeView === ViewType.LIST && "flex items-center justify-between border-t-4px py-2",
							)}
							onClick={() => onClickArtist(artist.id)}
						>
							<div
								className={cn(
									activeView === ViewType.GRID && "flex flex-col gap-2",
									activeView === ViewType.LIST && "flex items-center gap-4",
								)}
							>
								<div className="flex items-center justify-center pt-2">
									<ArtistAvatar
										src={artist.image}
										alt={artist.name}
										className={cn(
											activeView === ViewType.GRID && "size-[174px]",
											activeView === ViewType.LIST && "size-[59px]",
											"bg-black",
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
											"font-suisse-intl",
											"text-[20px]",
											"not-italic",
											"font-semibold",
											"leading-[28px]",
											"tracking-[0.2px]",
										)}
									>
										{artist.name}
									</p>
									<p
										className={cn(
											"text-center",
											"text-[#4D4D4F]",
											"font-suisse-intl",
											"text-[12px]",
											"not-italic",
											"font-[450]",
											"leading-[150%]",
											"tracking-[0.12px]",
										)}
									>
										{artist.followers} Followers
									</p>
								</div>
							</div>
							<Button
								size="sm"
								rounded="full"
								variant={artist.isFollowing ? "fill" : "outline"}
								onClick={handleFollow}
							>
								{artist.isFollowing ? "Following" : "Follow"}
							</Button>
						</li>
					))
				) : (
					<div>팔로우 한 아티스트가 없습니다.</div>
				)}
			</ul>
		</section>
	);
};

export default ArtistCardSection;
