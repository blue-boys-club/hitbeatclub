import { memo } from "react";

interface SidebarArrowProps {
	className?: string;
}
export const SidebarArrow = memo(({ className }: SidebarArrowProps) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		width="30"
		height="30"
		viewBox="0 0 30 30"
		fill="none"
	>
		<rect
			x="29"
			y="29"
			width="28"
			height="28"
			transform="rotate(-180 29 29)"
			fill="var(--color-hbc-white)"
			stroke="var(--color-hbc-black)"
			strokeWidth="2"
		/>
		<rect
			x="21"
			y="13"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="17"
			y="13"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="13"
			y="13"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="9"
			y="13"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="5"
			y="13"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="9"
			y="17"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="13"
			y="21"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="9"
			y="9"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
		<rect
			x="13"
			y="5"
			width="4"
			height="4"
			fill="var(--color-hbc-black)"
		/>
	</svg>
));

SidebarArrow.displayName = "SidebarArrow";
