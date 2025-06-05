import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/utils";
import { HTMLAttributes, memo } from "react";
import Image, { StaticImageData } from "next/image";

const artistAvatarVariants = cva("rounded-full object-cover aspect-square", {
	variants: {
		size: {
			small: "w-174px h-174px",
			large: "w-252px h-252px",
		},
	},
	defaultVariants: {
		size: "small",
	},
});

export interface ArtistAvatarProps extends HTMLAttributes<HTMLImageElement>, VariantProps<typeof artistAvatarVariants> {
	src: string | StaticImageData;
	alt?: string;
}

export const ArtistAvatar = memo(function ArtistAvatar({
	className,
	size = "small",
	src,
	alt = "Artist avatar",
	...props
}: ArtistAvatarProps) {
	return (
		<Image
			src={src}
			alt={alt}
			className={cn(artistAvatarVariants({ size }), className)}
			width={size === "small" ? 348 : 504}
			height={size === "small" ? 348 : 504}
			loading="lazy"
			data-testid="artist-avatar-image"
			{...props}
		/>
	);
});

ArtistAvatar.displayName = "ArtistAvatar";
