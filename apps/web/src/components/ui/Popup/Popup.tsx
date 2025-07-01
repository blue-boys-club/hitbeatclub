"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PopupButton as BasicPopupButton } from "@/components/ui/PopupButton";

import { cn } from "@/common/utils";
import { CloseModal } from "@/assets/svgs/CloseModal";

type PopupVariant = "default" | "mobile";

interface PopupContextValue {
	variant: PopupVariant;
}

const PopupContext = React.createContext<PopupContextValue>({ variant: "default" });

interface PopupRootProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
	variant?: PopupVariant;
}

interface PopupContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
	overlayClassName?: string;
}

const PopupRoot: React.FC<PopupRootProps> = ({ variant = "default", children, ...props }) => (
	<PopupContext.Provider value={{ variant }}>
		<DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
	</PopupContext.Provider>
);
PopupRoot.displayName = "PopupRoot";

const Popup = PopupRoot;

const PopupTrigger = DialogPrimitive.Trigger;

const PopupPortal = DialogPrimitive.Portal;

const PopupClose = DialogPrimitive.Close;

const PopupOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-[70] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
));
PopupOverlay.displayName = DialogPrimitive.Overlay.displayName;

const PopupContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, PopupContentProps>(
	({ className, children, overlayClassName, ...props }, ref) => {
		const { variant } = React.useContext(PopupContext);
		const isMobile = variant === "mobile";

		return (
			<PopupPortal>
				<PopupOverlay className={overlayClassName} />
				<DialogPrimitive.Content
					ref={ref}
					className={cn(
						"fixed left-[50%] top-[50%] z-[70] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-[5px] bg-hbc-white duration-200",
						"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
						"data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
						className,
					)}
					{...props}
				>
					<div
						className={cn("relative overflow-y-auto max-h-[80vh] grid gap-[25px]", isMobile ? "p-[32px]" : "p-[50px]")}
					>
						{children}
					</div>
					<DialogPrimitive.Close
						className={cn(
							"absolute z-[60] cursor-pointer",
							"disabled:hidden disabled:pointer-events-none",
							isMobile ? "right-[-8px] top-[-10px]" : "right-[-18px] top-[-18px]",
						)}
					>
						<CloseModal variant={variant} />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</PopupPortal>
		);
	},
);
PopupContent.displayName = DialogPrimitive.Content.displayName;

const PopupHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-col text-center items-center gap-[25px]", className)}
		{...props}
	/>
);
PopupHeader.displayName = "PopupHeader";

const PopupFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-row items-center justify-center gap-[25px]", className)}
		{...props}
	/>
);
PopupFooter.displayName = "PopupFooter";

const PopupTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("text-[26px] leading-[32px] tracking-[0.26px] font-medium font-suit", className)}
		{...props}
	/>
));
PopupTitle.displayName = DialogPrimitive.Title.displayName;

const PopupDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn(
			"text-[16px] text-hbc-black font-regular leading-[160%] tracking-[-0.32px] font-suit whitespace-pre-line",
			className,
		)}
		{...props}
	/>
));
PopupDescription.displayName = DialogPrimitive.Description.displayName;

const PopupButton = React.forwardRef<
	React.ElementRef<"button">,
	React.ComponentPropsWithoutRef<typeof BasicPopupButton>
>(({ className, ...props }, ref) => (
	<PopupClose asChild>
		{/* <button
				ref={ref}
				className={cn(
					"flex px-[12px] py-[5px] gap-[10px] items-center align-center bg-hbc-black rounded-[30px] cursor-pointer",
					"text-center font-suit text-[18px] font-bold leading-[100%] text-hbc-white tracking-[0.18px]",
					className,
				)}
				{...props}
			/> */}
		<BasicPopupButton
			ref={ref}
			className={cn(
				"flex px-[12px] py-[5px] gap-[10px] items-center align-center bg-hbc-black rounded-[30px] cursor-pointer",
				"text-center font-suit text-[18px] font-bold leading-[100%] text-hbc-white tracking-[0.18px] ring-0",
				className,
			)}
			{...props}
		/>
	</PopupClose>
));
PopupButton.displayName = "PopupButton";

export {
	Popup,
	PopupPortal,
	PopupOverlay,
	PopupTrigger,
	PopupClose,
	PopupContent,
	PopupHeader,
	PopupFooter,
	PopupTitle,
	PopupDescription,
	PopupButton,
};
