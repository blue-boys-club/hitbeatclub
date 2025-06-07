interface ChevronRightSharpProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const ChevronRightSharp = ({
	className,
	width = "8",
	height = "12",
	fill = "black",
}: ChevronRightSharpProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 8 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 1L6 6L1 11"
				stroke={fill}
				strokeWidth="2"
			/>
		</svg>
	);
};
