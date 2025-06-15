import { MobileMyNav } from "@/features/mobile/my/components";

const MobileMyLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
			<MobileMyNav />
		</div>
	);
};

export default MobileMyLayout;
