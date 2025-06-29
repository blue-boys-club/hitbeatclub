interface MobileFullScreenPlayerShuffleSVGProps {
	active?: boolean;
}

export const MobileFullScreenPlayerShuffleSVG = ({ active = false }: MobileFullScreenPlayerShuffleSVGProps) => {
	return (
		<svg
			width="48"
			height="49"
			viewBox="0 0 48 49"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M28.6004 41.5002V37.5252H34.0254L25.9504 29.5002L28.8254 26.6502L36.9754 34.6502V29.1752H41.0504V41.5002H28.6004ZM9.77539 41.5002L7.02539 38.5752L34.1254 11.5252H28.6004V7.4502H41.0504V19.8502H36.9754V14.4002L9.77539 41.5002ZM19.3504 22.6002L7.02539 10.3752L9.82539 7.4502L22.2504 19.7252L19.3504 22.6002Z"
				fill={active ? '#007AFF' : 'black'}
			/>
		</svg>
	);
};
