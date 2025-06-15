interface ArrowDownProps {
	className?: string;
	width?: string;
	height?: string;
	stroke?: string;
}

export const ArrowDown = ({ className, width = "9", height = "9", stroke = "#D9D9D9" }: ArrowDownProps) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 9 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M4.50122 0.75L4.50122 8.25M4.50122 8.25L1.50122 5.4375M4.50122 8.25L7.50122 5.4375"
				stroke={stroke}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
