import { Dollars } from "@/assets/svgs";

export const SubscribeHeader = () => {
	return (
		<div className="ml-[8.5px] pl-35px pb-15px inline-flex flex-col justify-start items-start gap-5px">
			<div className="inline-flex justify-center items-center gap-[5px]">
				<Dollars />
				<div className="justify-start text-black text-32px font-extrabold font-suit leading-100% tracking-032px">
					Membership
				</div>
			</div>
		</div>
	);
};
