"use client";
import { CloseMosaic } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Image from "next/image";
import React, { useState } from "react";
import PlaylistItem from "./PlaylistItem";

const playlists = [
	{ id: "1", coverImage: "/", artist: "Artist 1", title: "Playlist 1" },
	{ id: "2", coverImage: "/", artist: "Artist 2", title: "Playlist 2" },
];

const PlaylistRightSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

	const selectedPlaylist = playlists.find((playlist) => playlist.id === currentPlaylistId);

	return (
		<>
			{isOpen && (
				<button
					onClick={() => setIsOpen(false)}
					className="fixed top-[87px] right-0 z-50 bg-white text-black border-2 border-r-0 rounded-l-[5px] px-[4px] py-[10px] shadow cursor-pointer"
				></button>
			)}

			<aside
				className={cn(
					"bg-white w-[275px] fixed pt-4 px-6 flex flex-col gap-7 top-[87px] right-0 border-l-2 h-screen duration-300",
					isOpen ? "translate-x-full" : "translate-x-0",
				)}
			>
				<button
					onClick={() => setIsOpen(true)}
					className="absolute top-0 right-0 cursor-pointer border p-[2px]"
				>
					<CloseMosaic />
				</button>

				<h2 className="py-[6px] border-b-4 text-black font-bold text-[32px] leading-[32px] tracking-[0.32px]">
					Playlist
				</h2>

				{selectedPlaylist ? (
					<div className="flex gap-4">
						<Image
							src={selectedPlaylist.coverImage}
							alt="앨범 표지"
							width={54}
							height={54}
							className="rounded-[8px]"
						/>
						<div className="pt-1 flex flex-col gap-[2px]">
							<div className="text-black font-bold text-[24px] leading-[28px] tracking-[0.24px] truncate w-[155px]">
								{selectedPlaylist.title}
							</div>
							<div className="text-black font-bold text-[16px] leading-[16px] tracking-[-0.32px] w-[155px]">
								{selectedPlaylist.artist}
							</div>
						</div>
					</div>
				) : (
					<div className="h-[54px]" />
				)}

				<div>
					<h3 className="py-[6px] border-y-[3px] text-black font-bold text-[20px] leading-[20px]">Recent</h3>
					{playlists.length > 0 ? (
						<ul className="flex flex-col gap-[10px] mt-5 overflow-scroll max-h-[480px]">
							{playlists.map((playlist) => (
								<PlaylistItem
									key={playlist.id}
									{...playlist}
									isSelected={playlist.id === currentPlaylistId}
									onClick={setCurrentPlaylistId}
								/>
							))}
						</ul>
					) : (
						<p className="text-center pt-10">곡 목록이 없습니다.</p>
					)}
				</div>
			</aside>
		</>
	);
};

export default PlaylistRightSidebar;
