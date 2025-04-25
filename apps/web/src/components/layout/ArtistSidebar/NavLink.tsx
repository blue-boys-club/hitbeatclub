import { cn } from "@/common/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
	href: string;
	label: string;
	Icon: any;
}

const NavLink = ({ href, label, Icon }: NavLinkProps) => {
	const pathname = usePathname();
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			className={cn("flex items-center p-2 gap-2", isActive ? "bg-[#FF1900]" : "bg-white")}
		>
			<Icon
				fill={isActive ? "white" : "#FF1900"}
				width={40}
				height={40}
			/>
			<div
				className={cn(
					"px-14 py-1 text-center font-extrabold text-[20px] font-suit",
					isActive ? "text-white" : "text-[#FF1900]",
				)}
			>
				{label}
			</div>
		</Link>
	);
};

export default NavLink;
