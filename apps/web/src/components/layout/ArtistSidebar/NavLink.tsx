import { Lock } from "@/assets/svgs";
import { checkIsPureEnglish, cn } from "@/common/utils";
import Link from "next/link";

export interface NavLinkProps {
	href: string;
	label: string;
	Icon: React.ElementType;
	isActive?: boolean;
	isLocked?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

const NavLink = ({ href, label, Icon, isActive, isLocked, onClick }: NavLinkProps) => {
	const handleClick = (e: React.MouseEvent) => {
		if (isLocked && onClick) {
			e.preventDefault();
			onClick(e);
		}
	};

	return (
		<Link
			href={href}
			className={cn("flex items-center gap-2 px-2 py-2 text-center", isActive ? "bg-[#FF1900]" : "bg-white")}
			onClick={handleClick}
		>
			<Icon
				fill={isActive ? "white" : "#FF1900"}
				width={40}
				height={40}
			/>
			<span
				className={cn(
					"flex-1 font-extrabold text-[20px] font-suit",
					isActive ? "text-white" : "text-[#FF1900]",
					checkIsPureEnglish(label) && "font-suisse",
				)}
			>
				{label}
			</span>
			<div className="w-6 flex-shrink-0">
				{isLocked && <Lock className={cn(isActive ? "fill-white" : "fill-[#FF1900]")} />}
			</div>
		</Link>
	);
};

export default NavLink;
