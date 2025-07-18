interface EqualizerProps {
	className?: string;
	width?: string;
	height?: string;
}

export const Equalizer = ({ className, width = "24", height = "24" }: EqualizerProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<mask
				id="mask0_1_21364"
				style={{ maskType: "alpha" }}
				maskUnits="userSpaceOnUse"
				x="0"
				y="0"
				width="24"
				height="24"
			>
				<rect
					width="24"
					height="24"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask0_1_21364)">
				<path
					d="M7 18V6H9V18H7ZM11 22V2H13V22H11ZM3 14V10H5V14H3ZM15 18V6H17V18H15ZM19 14V10H21V14H19Z"
					fill="white"
				/>
			</g>
		</svg>
	);
};
