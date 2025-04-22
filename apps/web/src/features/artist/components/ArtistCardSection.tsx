"use client";
import { cn } from "@/common/utils";
import { ArtistAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import React from "react";
import { Artist, ArtistCardProps } from "../artist.types";

const ArtistCardSection = ({ activeView, artists }: ArtistCardProps) => {
	const handleFollow = () => {};
	return (
		<section>
			<ul
				className={cn(
					activeView === "grid" && "grid grid-cols-4 gap-auto gap-y-4",
					activeView === "list" && "flex flex-col",
				)}
			>
				{artists.length > 0 ? (
					artists.map((artist: Artist) => (
						<li
							key={artist.id}
							className={cn(
								activeView === "grid" && "flex flex-col items-center justify-center gap-2",
								activeView === "list" && "flex items-center justify-between border-t-4px py-2",
							)}
						>
							<div
								className={cn(
									activeView === "grid" && "flex flex-col gap-2",
									activeView === "list" && "flex items-center gap-4",
								)}
							>
								<div className="flex items-center justify-center pt-2">
									<ArtistAvatar
										src={artist.image}
										alt={artist.name}
										className={cn(
											activeView === "grid" && "size-[174px]",
											activeView === "list" && "size-[59px]",
											"bg-black",
										)}
									/>
								</div>
								<div
									className={cn(
										activeView === "grid" && "flex flex-col",
										activeView === "list" && "flex flex-col items-start",
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
