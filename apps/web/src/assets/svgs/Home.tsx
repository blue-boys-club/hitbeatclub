import React from "react";

export const Home = ({
	width = "27",
	height = "31",
	fill = "black",
}: {
	width?: string;
	height?: string;
	fill?: string;
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 27 31"
			fill="none"
		>
			<path
				d="M3.12981 27.8057H8.62681V17.3145H18.3666V27.8057H23.8636V11.9315L13.4967 3.99754L3.12981 11.9336V27.8057ZM0 31V10.3343L13.4967 0L27 10.3335V31H15.3586V20.3845H11.6348V31H0Z"
				fill={fill}
			/>
		</svg>
	);
};
