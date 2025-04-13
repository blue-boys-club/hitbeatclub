import { cn } from "@/common/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, memo } from "react";
import { Lock } from "@/assets/svgs/Lock";

const subscribeButtonVariants = cva(
  cn(
    "flex items-center justify-center h-[30px] gap-[2px] border-[3px] border-hbc-black bg-hbc-white rounded-full pl-3 pr-1 py-[3px] text-hbc-black",
    "font-suisse text-[20px] font-bold leading-[100%] tracking-[0.2px]",
    "cursor-pointer hover:bg-hbc-black hover:text-hbc-white transition-colors"
  ),
  {
    variants: {
      isSubscribed: {
        true: "bg-hbc-red px-3 text-hbc-white border-hbc-red hover:bg-hbc-black hover:text-hbc-white hover:border-hbc-black",
        false: "",
      },
    },
    defaultVariants: {
      isSubscribed: false,
    },
  }
);

export interface SubscribeButtonProps
  extends VariantProps<typeof subscribeButtonVariants>,
    HTMLAttributes<HTMLButtonElement> {}

export const SubscribeButton = memo(
  ({ isSubscribed, className, ...props }: SubscribeButtonProps) => {
    return (
      <button
        {...props}
        className={cn(subscribeButtonVariants({ isSubscribed }), className)}
      >
        <span>ARTIST STUDIO</span>
        {!isSubscribed && <Lock className="bg-transparent" />}
      </button>
    );
  }
);

SubscribeButton.displayName = "SubscribeButton";
export default SubscribeButton;
