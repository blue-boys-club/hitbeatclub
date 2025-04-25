import { Lock } from "@/assets/svgs";
import { cn } from "@/common/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
	href: string;
	label: string;
	Icon: any;
	isLocked?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

const NavLink = ({ href, label, Icon, isLocked, onClick }: NavLinkProps) => {
	const pathname = usePathname();

	const isActive = pathname.includes(href);

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
			<span className={cn("flex-1 font-extrabold text-[20px] font-suit", isActive ? "text-white" : "text-[#FF1900]")}>
				{label}
			</span>
			<div className="w-6 flex-shrink-0">
				{isLocked && <Lock className={cn(isActive ? "fill-white" : "fill-[#FF1900]")} />}
			</div>
		</Link>
	);
};

export default NavLink;
