export const Grid = ({ fill = "black" }: { fill?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
		>
			<rect
				width="9.33333"
				height="9.33333"
				fill={fill}
			/>
			<rect
				x="10.667"
				width="9.33333"
				height="9.33333"
				fill={fill}
			/>
			<rect
				y="10.668"
				width="9.33333"
				height="9.33333"
				fill={fill}
			/>
			<rect
				x="10.667"
				y="10.666"
				width="9.33333"
				height="9.33333"
				fill={fill}
			/>
		</svg>
	);
};
