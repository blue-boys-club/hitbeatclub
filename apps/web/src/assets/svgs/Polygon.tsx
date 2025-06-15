interface PolygonProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const Polygon = ({ className, width = "8", height = "6", fill = "#FFFFFF" }: PolygonProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 8 6"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 6L0.535899 3.14459e-07L7.4641 9.07781e-07L4 6Z"
				fill={fill}
			/>
		</svg>
	);
};
