interface XProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const X = ({ className, width = "14", height = "15", fill = "black" }: XProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 14 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.87388 14.5L0 12.6261L5.12612 7.5L0 2.37388L1.87388 0.5L7 5.62612L12.1261 0.5L14 2.37388L8.87388 7.5L14 12.6261L12.1261 14.5L7 9.37388L1.87388 14.5Z"
				fill={fill}
			/>
		</svg>
	);
};
