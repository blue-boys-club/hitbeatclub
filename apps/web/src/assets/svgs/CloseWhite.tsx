export const CloseWhite = ({
	width = "16px",
	height = "16px",
	backgroundColor = "#fff",
	fillColor = "black",
}: {
	width?: string;
	height?: string;
	backgroundColor?: string;
	fillColor?: string;
}) => {
	return (
		<div style={{ width, height, backgroundColor, borderRadius: "50%" }}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={width}
				height={height}
				viewBox="0 0 16 16"
				fill="none"
			>
				<mask
					id="mask0_110_61"
					style={{ maskType: "alpha" }}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width={width}
					height={height}
				>
					<rect
						width={width}
						height={height}
						fill="#D9D9D9"
					/>
				</mask>
				<g mask="url(#mask0_110_61)">
					<path
						d="M4.26244 12.6688L3.3291 11.7355L7.06244 8.00212L3.3291 4.26878L4.26244 3.33545L7.99577 7.06878L11.7291 3.33545L12.6624 4.26878L8.9291 8.00212L12.6624 11.7355L11.7291 12.6688L7.99577 8.93545L4.26244 12.6688Z"
						fill={fillColor}
					/>
				</g>
			</svg>
		</div>
	);
};
