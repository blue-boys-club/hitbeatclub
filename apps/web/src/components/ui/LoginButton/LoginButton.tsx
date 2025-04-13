import { cn } from "@/common/utils";

import { HTMLAttributes, memo } from "react";

export type LoginButtonProps = HTMLAttributes<HTMLButtonElement>;

export const LoginButton = memo(({ className, ...props }: LoginButtonProps) => {
	return (
		<button
			{...props}
			className={cn(
				"flex items-center justify-center h-[30px] border-[3px] border-hbc-black rounded-full px-[12px] py-[4px] cursor-pointer ",
				"bg-hbc-white text-hbc-black hover:bg-hbc-black hover:text-hbc-white transition-colors",
				className,
			)}
		>
			<span className="font-suit text-[20px] font-bold leading-[100%] tracking-[0.2px]">로그인</span>
		</button>
	);
});

LoginButton.displayName = "LoginButton";
export default LoginButton;
