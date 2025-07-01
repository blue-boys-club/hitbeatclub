"use client";

import { PauseCircle, PlayCircle } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { cva, VariantProps } from "class-variance-authority";
import { StaticImageData } from "next/image";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePlaylist } from "@/hooks/use-playlist";
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

export interface AlbumCoverCardProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
		VariantProps<typeof AlbumCoverCardWrapper>,
		VariantProps<typeof AlbumCoverCardInner> {
	albumImgSrc: string | StaticImageData;
	productId?: number;
	onClick?: () => void;
	AlbumCoverCardWrapperClassName?: string;
	AlbumCoverCardInnerClassName?: string;
	/** 컨텍스트 기반 자동 플레이리스트 설정 (옵션) */
	autoPlaylistConfig?: PlaylistAutoRequest;
	/** 원본 리스트상의 인덱스 (옵션) */
	trackIndex?: number;
}

const AlbumCoverCardWrapper = cva("relative inline-block cursor-pointer group flex w-fit", {
	variants: {
		rounded: {
			none: "rounded-none", //0px
			small: "rounded-sm", //4px
			large: "rounded-lg", //8px
		},
		padding: {
			true: "p-1",
			false: "",
		},
		border: {
			true: "ring-2 ring-black",
			main: "shadow-[1px_3px,_-1px_3px,_1px_-3px,_-1px_-3px_0_var(--hbc-black)]",
			false: "ring-0",
		},
	},
	defaultVariants: {
		border: true,
		padding: true,
		rounded: "large",
	},
});

const AlbumCoverCardInner = cva("relative overflow-hidden", {
	variants: {
		size: {
			xs: "size-[40px]",
			sm: "size-[50px]",
			md: "size-[54px]",
			lg: "size-[70px]",
			xl: "size-[180px]",
		},
		rounded: {
			none: "rounded-none",
			small: "rounded-sm",
			large: "rounded-lg",
		},
	},
	defaultVariants: {
		size: "lg",
		rounded: "large",
	},
});

export const AlbumCoverCard = ({
	size,
	rounded,
	border,
	padding,
	albumImgSrc,
	productId,
	AlbumCoverCardWrapperClassName,
	AlbumCoverCardInnerClassName,
	autoPlaylistConfig,
	trackIndex,
	...props
}: AlbumCoverCardProps) => {
	const { play } = usePlayTrack();
	const { createAutoPlaylistAndPlay } = usePlaylist();
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	const statusIcon = useMemo(() => {
		if (currentProductId !== productId) {
			return <PlayCircle />;
		}

		switch (status) {
			case "playing":
				return <PauseCircle />;
			case "paused":
				return <PlayCircle />;
			default:
				return <PlayCircle />;
		}
	}, [status, currentProductId, productId]);

	const onClickHandler = useCallback(async () => {
		if (autoPlaylistConfig) {
			try {
				if (process.env.NODE_ENV !== "production") {
					console.debug("[AlbumCoverCard] click with autoPlaylistConfig", {
						productId,
						trackIndex,
						autoPlaylistConfig,
					});
				}
				await createAutoPlaylistAndPlay(autoPlaylistConfig, trackIndex ?? 0);
				// 플레이리스트 생성 시 동시에 재생 로직이 실행되므로 중복 호출을 제거합니다.
				return;
			} catch (error) {
				// 실패 시 기본 재생 로직으로 폴백
				console.error("[AlbumCoverCard] createAutoPlaylistAndPlay failed", error);
			}
		}
		// 기본 재생 로직
		play(productId);
	}, [autoPlaylistConfig, trackIndex, createAutoPlaylistAndPlay, play, productId]);

	return (
		<button
			className={cn(AlbumCoverCardWrapper({ rounded, border, padding }), AlbumCoverCardWrapperClassName)}
			onClick={onClickHandler}
			{...props}
		>
			<div className={cn(AlbumCoverCardInner({ rounded, size }), AlbumCoverCardInnerClassName)}>
				<Image
					src={albumImgSrc}
					alt="앨범 커버 이미지"
					fill
					priority
					className="object-cover"
				/>
				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black/30",
						currentProductId === productId ? "opacity-100" : "opacity-0 group-hover:opacity-100",
					)}
				>
					{statusIcon}
				</div>
			</div>
		</button>
	);
};
