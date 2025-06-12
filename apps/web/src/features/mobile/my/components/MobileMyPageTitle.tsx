export const MobileMyPageTitle = ({ icon, title, right }: { icon: React.ReactNode; title: string; right: string }) => {
	return (
		<div>
			<div className="flex justify-between">
				<div className="flex gap-7px items-end">
					{icon}
					<span className="text-22px leading-100% font-bold transform translate-y-1px">{title}</span>
				</div>
				<span className="self-end text-12px leading-100% font-semibold">{right}</span>
			</div>
			<div className="my-4 bg-black h-6px" />
		</div>
	);
};
