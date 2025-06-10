interface CheckProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const Check = ({ className, width = "19", height = "13", fill = "black" }: CheckProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 19 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6.94346 13L0.985107 7.06974L2.9421 5.08493L6.94346 9.08629L16.0578 0L18.0148 1.95671L6.94346 13Z"
				fill={fill}
			/>
		</svg>
	);
};
