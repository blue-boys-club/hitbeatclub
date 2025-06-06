interface ArrowLeftShortProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const ArrowLeftShort = ({ className, width = "12", height = "12", fill = "black" }: ArrowLeftShortProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3.11722 5.18901L12 5.18901L12 6.81099L3.11722 6.81099L7.15783 10.8516L6 12L5.24537e-07 6L6 -5.24537e-07L7.15783 1.1484L3.11722 5.18901Z"
				fill={fill}
			/>
		</svg>
	);
};
