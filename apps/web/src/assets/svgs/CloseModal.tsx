import React from "react";

interface CloseModalProps {
	variant?: "default" | "mobile";
}

export const CloseModal: React.FC<CloseModalProps> = ({ variant = "default" }) => {
	if (variant === "mobile") {
		return (
			<div
				style={{
					backgroundColor: "white",
					borderRadius: "50%",
					padding: 2,
					display: "inline-flex",
				}}
			>
				<div
					style={{
						backgroundColor: "black",
						borderRadius: "50%",
						display: "inline-flex",
					}}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.19263 4.19214L11.2637 11.2632"
							stroke="white"
							strokeWidth="2"
						/>
						<path
							d="M4.19263 11.2639L11.2637 4.19285"
							stroke="white"
							strokeWidth="2"
						/>
					</svg>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				backgroundColor: "white",
				borderRadius: "50%",
				padding: 4,
				display: "inline-flex",
			}}
		>
			<div
				style={{
					backgroundColor: "black",
					borderRadius: "50%",
					padding: 4,
					display: "inline-flex",
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="29"
					height="30"
					viewBox="0 0 29 30"
					fill="none"
				>
					<path
						d="M7.67676 7.92871L21.8189 22.0708"
						stroke="white"
						strokeWidth="3"
					/>
					<path
						d="M7.67676 22.0713L21.8189 7.92915"
						stroke="white"
						strokeWidth="3"
					/>
				</svg>
			</div>
		</div>
	);
};
