import { forwardRef } from "react";

export const VolumeThumb = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
	return (
		<svg
			{...props}
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
		>
			<circle
				cx="7.5"
				cy="7.5"
				r="5.5"
				fill="#FF0000"
				stroke="black"
				strokeWidth="4"
			/>
			<circle
				cx="7.5"
				cy="7.5"
				r="5.5"
				fill="#FF0000"
				stroke="white"
			/>
		</svg>
	);
});

VolumeThumb.displayName = "VolumeThumb";
