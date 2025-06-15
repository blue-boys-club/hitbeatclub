interface ReturnProps {
	className?: string;
	width?: string;
	height?: string;
	fill?: string;
}

export const Return = ({ className, width = "11", height = "11", fill = "black" }: ReturnProps) => {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 11 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2.04808 10.2404V8.875H6.89519C7.61202 8.875 8.23498 8.64744 8.76406 8.19231C9.29315 7.73718 9.55769 7.16827 9.55769 6.48558C9.55769 5.80289 9.29315 5.23398 8.76406 4.77885C8.23498 4.32372 7.61202 4.09615 6.89519 4.09615H2.59423L4.36923 5.87116L3.41346 6.82692L0 3.41346L3.41346 0L4.36923 0.955769L2.59423 2.73077H6.89519C7.99888 2.73077 8.94611 3.08918 9.7369 3.80601C10.5277 4.52284 10.9231 5.41603 10.9231 6.48558C10.9231 7.55513 10.5277 8.44832 9.7369 9.16515C8.94611 9.88197 7.99888 10.2404 6.89519 10.2404H2.04808Z"
				fill={fill}
			/>
		</svg>
	);
};
