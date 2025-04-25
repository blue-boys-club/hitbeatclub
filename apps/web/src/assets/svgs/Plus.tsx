interface PlusProps {
	width?: string;
	height?: string;
	stroke?: string;
}
export const Plus = ({ width = "14", height = "14", stroke = "white" }: PlusProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 14 14"
			fill="none"
		>
			<path
				d="M7.07129 0L7.07129 14"
				stroke={stroke}
				strokeWidth="2"
			/>
			<path
				d="M0 7.07129L14 7.07129"
				stroke={stroke}
				strokeWidth="2"
			/>
		</svg>
	);
};
