import { SVGProps } from "react";

interface UploadIconProps extends SVGProps<SVGSVGElement> {
	className?: string;
	width?: number;
	height?: number;
}

export const Upload: React.FC<UploadIconProps> = ({ className, width = 40, height = 41 }: UploadIconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 40 41"
			fill="none"
			className={className}
		>
			<path
				d="M16.6458 26.1916V14.7541L12.6875 18.7541L9.35417 15.5457L19 5.8999L28.6458 15.5457L25.3125 18.7541L21.3542 14.7541V26.1916H16.6458ZM6 33.8999V26.2957H10.7083V29.1916H27.2917V26.2957H32V33.8999H6Z"
				fill="#FF1900"
			/>
		</svg>
	);
};

export default Upload;
