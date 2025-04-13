import { forwardRef, memo } from "react";
import { BaseHeading, BaseHeadingProps } from "./BaseHeading";
import { cn } from "@/common/utils";

/**
 * 헤딩 컴포넌트
 */
export const Heading1 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h1"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading1.displayName = "Heading1";

/**
 * 헤딩 2 컴포넌트
 */
export const Heading2 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h2"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading2.displayName = "Heading2";

/**
 * 헤딩 3 컴포넌트
 */
export const Heading3 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h3"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading3.displayName = "Heading3";

/**
 * 헤딩 4 컴포넌트
 */
export const Heading4 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h4"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading4.displayName = "Heading4";

/**
 * 헤딩 5 컴포넌트
 */
export const Heading5 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h5"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading5.displayName = "Heading5";

/**
 * 헤딩 6 컴포넌트
 */
export const Heading6 = memo(
	forwardRef<HTMLHeadingElement, Omit<BaseHeadingProps, "as">>(({ className, ...props }, ref) => {
		return (
			<BaseHeading
				ref={ref}
				as="h6"
				className={cn(className)}
				{...props}
			/>
		);
	}),
);

Heading6.displayName = "Heading6";
