"use client";

import { PauseCircle, PlayCircle } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import React, { useCallback, useState } from "react";

export interface AlbumCoverCardProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
		VariantProps<typeof AlbumCoverCardWrapper>,
		VariantProps<typeof AlbumCoverCardInner> {
	albumImgSrc: string;
	onClick?: () => void;
	AlbumCoverCardWrapperClassName?: string;
	AlbumCoverCardInnerClassName?: string;
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
	onClick,
	AlbumCoverCardWrapperClassName,
	AlbumCoverCardInnerClassName,
	...props
}: AlbumCoverCardProps) => {
	const [isPlay, setIsPlay] = useState(false);

	const onClickHandler = useCallback(() => {
		setIsPlay((prev) => !prev);
		onClick?.();
	}, [onClick]);

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
				<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 bg-black/30 group-hover:opacity-100">
					{isPlay ? <PauseCircle /> : <PlayCircle />}
				</div>
			</div>
		</button>
	);
};
