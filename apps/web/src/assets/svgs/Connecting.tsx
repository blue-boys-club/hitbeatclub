import { SVGProps } from "react";

interface ConnectingProps extends SVGProps<SVGSVGElement> {
	width?: number;
	height?: number;
}

export const Connecting = ({ width = 15, height = 15, ...props }: ConnectingProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 15 15"
			fill="none"
			{...props}
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
};
