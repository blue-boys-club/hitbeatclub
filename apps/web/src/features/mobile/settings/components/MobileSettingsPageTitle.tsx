import { Setting } from "@/assets/svgs";

export const MobileSettingsPageTitle = ({ title }: { title: string }) => {
	return (
		<div>
			<div className="flex gap-7px items-center">
				<Setting
					width="23px"
					height="22px"
				/>
				<div className="text-22px leading-100% font-bold">{title}</div>
			</div>
			<div className="mt-13px bg-black h-6px" />
		</div>
	);
};
