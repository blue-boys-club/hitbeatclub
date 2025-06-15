interface OutlinkProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const Outlink = ({ className, width = "10", height = "12", fill = "black" }: OutlinkProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 10 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0_1_23428)">
				<path
					d="M7.45 9.53537H0.620833V2.55099H4.34583V1.93016H0V10.1562H8.07083V5.81037H7.45V9.53537Z"
					fill={fill}
				/>
				<path
					d="M5.58717 0.843781V1.46461H8.25235L3.34998 6.36701L3.78894 6.80597L8.69133 1.9036V4.56878H9.31217V0.843781H5.58717Z"
					fill={fill}
				/>
			</g>
			<defs>
				<clipPath id="clip0_1_23428">
					<rect
						width="9.31215"
						height="10.3124"
						fill="white"
						transform="translate(0 0.843781)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};
