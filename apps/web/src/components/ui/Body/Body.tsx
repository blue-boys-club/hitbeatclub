import { forwardRef, memo } from "react";
import { BaseBody, BaseBodyProps } from "./BaseBody";
import { cn } from "@/common/utils";

export type BodyProps = Omit<BaseBodyProps, "size">;

/**
 * BodyLarge
 */
export const BodyLarge = memo(
	forwardRef<HTMLDivElement, BodyProps>(({ className, ...props }, ref) => {
		return (
			<BaseBody
				ref={ref}
				size="large"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

BodyLarge.displayName = "BodyLarge";

/**
 * BodyMedium
 */
export const BodyMedium = memo(
	forwardRef<HTMLDivElement, BodyProps>(({ className, ...props }, ref) => {
		return (
			<BaseBody
				ref={ref}
				size="medium"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

BodyMedium.displayName = "BodyMedium";

/**
 * BodySmall
 */
export const BodySmall = memo(
	forwardRef<HTMLDivElement, BodyProps>(({ className, ...props }, ref) => {
		return (
			<BaseBody
				ref={ref}
				size="small"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

BodySmall.displayName = "BodySmall";
