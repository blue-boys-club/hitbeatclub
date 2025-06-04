import { cn } from "@/common/utils";
import { HTMLAttributes, memo } from "react";
import Image from "next/image";
import { assetImageLoader } from "@/common/utils/image-loader";
import { StaticImageData } from "next/image";

export interface AlbumAvatarProps extends HTMLAttributes<HTMLImageElement> {
	src: string | StaticImageData;
	alt?: string;
	wrapperClassName?: string;
}

export const AlbumAvatar = memo(function AlbumAvatar({
	src,
	alt = "Album avatar",
	className,
	wrapperClassName,
	...props
}: AlbumAvatarProps) {
	return (
		<div
			className={cn(
				// image 192x192 + border 10px*2
				"relative w-[212px] h-[212px]",
				wrapperClassName,
			)}
			{...props}
			data-testid="album-avatar-wrapper"
		>
			<div
				className="absolute rounded-full w-[212px] h-[212px] border-[10px] border-black"
				data-testid="album-avatar-border"
			/>
			<Image
				src={src}
				alt={alt}
				className={cn(
					"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
					"rounded-full w-[200px] h-[200px] object-cover aspect-square border-[4px] border-dashed  border-white",
					className,
				)}
				// image width * 4
				width={768}
				height={768}
				loading="lazy"
				data-testid="album-avatar-image"
				loader={assetImageLoader}
			/>
		</div>
	);
});

AlbumAvatar.displayName = "AlbumAvatar";
