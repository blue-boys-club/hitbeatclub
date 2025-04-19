import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/utils";
import { HTMLAttributes, memo } from "react";
import Image from "next/image";
import { Connecting } from "@/assets/svgs/Connecting";

const userAvatarVariants = cva("relative rounded-full", {
	variants: {
		size: {
			small: "w-51px h-51px",
			large: "w-87px h-87px",
			sidebar: "w-87px h-87px @200px/sidebar:w-51px @200px/sidebar:h-51px",
		},
	},
	defaultVariants: {
		size: "small",
	},
});

const userAvatarNotificationVariants = cva("absolute z-10 top-0 right-0", {
	variants: {
		size: {
			small: "w-15px h-15px",
			large: "w-25px h-25px",
			sidebar: "w-25px h-25px @200px/sidebar:w-15px @200px/sidebar:h-15px",
		},
	},
	defaultVariants: {
		size: "small",
	},
});

export interface UserAvatarProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof userAvatarVariants> {
	src: string;
	alt?: string;
	isNotification?: boolean;
}

export const UserAvatar = memo(function UserAvatar({
	className,
	size = "small",
	src,
	alt = "User avatar",
	isNotification = false,
	...props
}: UserAvatarProps) {
	return (
		<div
			className={cn(userAvatarVariants({ size, className }))}
			{...props}
			data-testid="user-avatar"
		>
			<Image
				src={src}
				alt={alt}
				className="absolute object-cover w-full h-full rounded-full aspect-square"
				width={size === "small" ? 204 : 348}
				height={size === "small" ? 204 : 348}
				loading="lazy"
				data-testid="user-avatar-image"
			/>
			{isNotification && (
				<Connecting
					className={cn(userAvatarNotificationVariants({ size }))}
					data-testid="notification-badge"
				/>
			)}
		</div>
	);
});

UserAvatar.displayName = "UserAvatar";
