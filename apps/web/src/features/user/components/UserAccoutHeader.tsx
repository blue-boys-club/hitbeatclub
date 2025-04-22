import { Setting } from "@/assets/svgs";
import React from "react";

const UserAccoutHeader = () => {
	return (
		<header className="px-9 pb-4 border-b-6px border-black">
			<div className="flex gap-2">
				<Setting />
				<span className="text-[32px] leading-[32px] tracking-[0.32px] font-bold text-black">Settings</span>
			</div>
		</header>
	);
};

export default UserAccoutHeader;
