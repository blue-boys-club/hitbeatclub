"use client";
import { CloseMosaic, ArrowLeftMosaic } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Image from "next/image";
import React, { useState } from "react";
import PlaylistItem from "./PlaylistItem";
import { useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";

const playlists = [
	{ id: "1", coverImage: "/", artist: "Artist 1", title: "Playlist 1" },
	{ id: "2", coverImage: "/", artist: "Artist 2", title: "Playlist 2" },
];

const PlaylistRightSidebar = () => {
	const {
		isOpen,
		setRightSidebar,
		currentTrackId = 12,
	} = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			currentTrackId: state.rightSidebar.trackId,
		})),
	);

	const handleToggleOpen = () => {
		setRightSidebar(!isOpen);
	};

	const selectedPlaylist = playlists.find((playlist) => playlist.id === currentTrackId);

	return (
		<>
			<div
				className={cn(
					"fixed right-0 top-87px h-[calc(100vh-92px-72px-15px)] transition-all duration-500 ease-in-out",
					isOpen ? "w-[275px]" : "w-0",
				)}
			>
				{/* 열기 버튼 - 닫혀있을 때만 보임 */}
				{!isOpen && (
					<button
						onClick={handleToggleOpen}
						className="absolute top-0 -left-8 cursor-pointer hover:opacity-80 transition-opacity"
					>
						<ArrowLeftMosaic />
					</button>
				)}

				<div className="flex flex-col h-full overflow-hidden border-l-2 border-black w-[275px] pb-15 bg-white">
					{/* 닫기 버튼 - 열려있을 때만 보임 */}
					{isOpen && (
						<button
							onClick={handleToggleOpen}
							className="absolute top-0 right-0 cursor-pointer border p-[2px]"
						>
							<CloseMosaic />
						</button>
					)}

					<div className="px-6 pt-4">
						<h2 className="py-[6px] border-b-4 text-black font-bold text-[32px] leading-[32px] tracking-[0.32px] mb-7">
							Playlist
						</h2>

						{selectedPlaylist ? (
							<div className="flex gap-4 mb-7">
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
							<div className="h-[54px] mb-7" />
						)}
					</div>

					<div className="flex-1 min-h-0 px-6">
						<h3 className="py-[6px] border-y-[3px] text-black font-bold text-[20px] leading-[20px] mb-5">Recent</h3>
						{playlists.length > 0 ? (
							<div className="overflow-auto h-full">
								<ul className="flex flex-col gap-[10px]">
									{playlists.map((playlist) => (
										<PlaylistItem
											key={playlist.id}
											{...playlist}
											isSelected={playlist.id === currentTrackId}
											onClick={handleToggleOpen}
										/>
									))}
								</ul>
							</div>
						) : (
							<p className="text-center pt-10">곡 목록이 없습니다.</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default PlaylistRightSidebar;
