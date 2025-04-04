import { forwardRef } from "react";
import { BaseBody, BaseBodyProps } from "./BaseBody";
import { cn } from "@/common/utils";

/**
 * BodyLarge
 */
export const BodyLarge = forwardRef<HTMLDivElement, BaseBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseBody ref={ref} size="large" className={cn(className)} {...props} />
    );
  }
);

BodyLarge.displayName = "BodyLarge";

/**
 * BodyMedium
 */
export const BodyMedium = forwardRef<HTMLDivElement, BaseBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseBody ref={ref} size="medium" className={cn(className)} {...props} />
    );
  }
);

BodyMedium.displayName = "BodyMedium";

/**
 * BodySmall
 */
export const BodySmall = forwardRef<HTMLDivElement, BaseBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseBody ref={ref} size="small" className={cn(className)} {...props} />
    );
  }
);

BodySmall.displayName = "BodySmall";
