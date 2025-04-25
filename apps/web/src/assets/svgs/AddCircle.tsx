export const AddCircle = () => {
	return (
		<div className="w-6 h-6 p-0.5 bg-black rounded-full flex items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
			>
				<path
					d="M6 1V11"
					stroke="white"
					strokeWidth="2"
				/>
				<path
					d="M11 6L1 6"
					stroke="white"
					strokeWidth="2"
				/>
			</svg>
		</div>
	);
};
