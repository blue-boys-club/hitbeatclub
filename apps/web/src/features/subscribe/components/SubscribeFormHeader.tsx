import { Toggle } from "@/components/ui/Toggle";
import { RecurringPeriod } from "@hitbeatclub/shared-types/subscribe";

/**
 * 구독 폼 헤더 컴포넌트
 */
interface SubscribeFormHeaderProps {
	isSubscribed: boolean;
	recurringPeriod: RecurringPeriod;
	onPeriodChange: (period: RecurringPeriod) => void;
}

export const SubscribeFormHeader = ({ isSubscribed, recurringPeriod, onPeriodChange }: SubscribeFormHeaderProps) => {
	const handlePeriodToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const isMonthly = event.target.checked;
		onPeriodChange(isMonthly ? "monthly" : "yearly");
	};

	if (isSubscribed) {
		return (
			<div className="justify-start font-extrabold leading-80% text-black uppercase text-32px font-suit tracking-032px">
				WELCOME TO THE HITCLUB !!
			</div>
		);
	}

	return (
		<>
			<div className="justify-start font-extrabold leading-80% text-black uppercase text-32px font-suit tracking-032px">
				히트비트 멤버십
			</div>
			<div className="flex justify-start items-center gap-2.5">
				<div className="justify-start font-extrabold leading-none text-14px hbc-black font-suit tracking-014px">
					연간
				</div>
				<Toggle
					toggleClassName="w-28px h-16px after:w-12px after:h-12px bg-[#0061ff] peer-checked:bg-hbc-black"
					onChange={handlePeriodToggle}
					defaultChecked={recurringPeriod === "monthly"}
				/>
				<div className="justify-start font-extrabold leading-none text-14px text-hbc-gray-300 font-suit tracking-014px">
					월간
				</div>
			</div>
		</>
	);
};
