interface StarProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const Star = ({ className, width = "28", height = "26", fill = "black" }: StarProps) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 28 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.80008 20.4333L14.0001 17.9L18.2001 20.4666L17.1001 15.6666L20.8001 12.4666L15.9334 12.0333L14.0001 7.49996L12.0667 12L7.20008 12.4333L10.9001 15.6666L9.80008 20.4333ZM5.76675 26L7.93341 16.6333L0.666748 10.3333L10.2667 9.49996L14.0001 0.666626L17.7334 9.49996L27.3334 10.3333L20.0667 16.6333L22.2334 26L14.0001 21.0333L5.76675 26Z"
				fill={fill}
			/>
		</svg>
	);
};
