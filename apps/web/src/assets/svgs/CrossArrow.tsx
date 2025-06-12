interface CrossArrowProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const CrossArrow = ({ className, width = "26", height = "27", fill = "black" }: CrossArrowProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 26 27"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.8407 26.0251V23.1008H20.8318L14.8912 17.1969L17.0063 15.1002L23.0021 20.9857V16.9578H26V26.0251H16.8407ZM2.99151 26.0251L0.968384 23.8732L20.9054 3.97301H16.8407V0.975098H26V10.0976H23.0021V6.08809L2.99151 26.0251ZM10.0357 12.1207L0.968384 3.12697L3.0283 0.975098L12.1692 10.0056L10.0357 12.1207Z"
				fill={fill}
			/>
		</svg>
	);
};
