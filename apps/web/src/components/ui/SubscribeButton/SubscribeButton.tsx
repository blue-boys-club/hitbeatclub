import { cn } from "@/common/utils";
import { cva, VariantProps } from "class-variance-authority";
import { type HTMLAttributes, memo } from "react";
import { Lock } from "@/assets/svgs/Lock";
import Link, { type LinkProps } from "next/link";

const subscribeButtonVariants = cva(
	cn(
		"flex items-center justify-center h-[30px] gap-[2px] border-[3px] border-hbc-black bg-hbc-white rounded-full pl-3 pr-1 py-[3px] text-hbc-black",
		"font-suisse text-[20px] font-bold leading-[100%] tracking-[0.2px]",
		"cursor-pointer hover:bg-hbc-black hover:text-hbc-white transition-colors",
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
	},
);

export interface SubscribeButtonButtonProps
	extends VariantProps<typeof subscribeButtonVariants>,
		HTMLAttributes<HTMLButtonElement> {
	component?: "button" | undefined;
}

export interface SubscribeButtonLinkProps
	extends VariantProps<typeof subscribeButtonVariants>,
		LinkProps,
		HTMLAttributes<HTMLAnchorElement> {
	component: "Link";
}

export type SubscribeButtonProps = SubscribeButtonButtonProps | SubscribeButtonLinkProps;

export const SubscribeButton = memo((props: SubscribeButtonProps) => {
	const { component = "button", isSubscribed, className, ...restProps } = props;
	const classes = cn(subscribeButtonVariants({ isSubscribed }), className);

	const content = (
		<>
			<span>ARTIST STUDIO</span>
			{!isSubscribed && <Lock className="bg-transparent" />}
		</>
	);

	if (component === "Link") {
		return (
			<Link
				{...(restProps as SubscribeButtonLinkProps)}
				className={classes}
			>
				{content}
			</Link>
		);
	}

	return (
		<button
			{...(restProps as SubscribeButtonButtonProps)}
			className={classes}
		>
			{content}
		</button>
	);
});

SubscribeButton.displayName = "SubscribeButton";
export default SubscribeButton;
