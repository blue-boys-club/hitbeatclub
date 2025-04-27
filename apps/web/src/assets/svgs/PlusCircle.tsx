export const PlusCircle = ({ color = "currentColor" }: { color?: string }) => {
	return (
		<div
			style={{
				border: "2px solid",
				borderColor: color,
				borderRadius: "50%",
				padding: 3,
				display: "inline-flex",
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="13"
				height="12"
				viewBox="0 0 13 12"
				fill="none"
			>
				<path
					d="M6.20312 0V12"
					stroke={color}
					strokeWidth="2"
				/>
				<path
					d="M12.2031 6L0.203125 6"
					stroke={color}
					strokeWidth="2"
				/>
			</svg>
		</div>
	);
};
