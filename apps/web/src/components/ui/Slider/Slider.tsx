import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/common/utils";

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
	className?: string;
}

const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
	({ className, ...props }, ref) => (
		<SliderPrimitive.Root
			ref={ref}
			className={cn("relative flex w-full touch-none select-none items-center", className)}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-1px w-full grow overflow-hidden bg-white">
				<SliderPrimitive.Range className="absolute h-full bg-white" />
			</SliderPrimitive.Track>
			{props.value?.map((_, index) => (
				<SliderPrimitive.Thumb
					key={index}
					className="block h-[12px] w-[12px] rounded-full border border-white bg-[#5b5b5b]"
				/>
			))}
		</SliderPrimitive.Root>
	),
);

Slider.displayName = "Slider";

export { Slider };
