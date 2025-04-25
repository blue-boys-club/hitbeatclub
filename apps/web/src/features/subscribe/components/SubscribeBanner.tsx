import { SubscribeHBCLogo } from "./SubscribeHBCLogo";
import UI from "@/components/ui";

export const SubscribeBanner = () => {
	return (
		<div className="inline-flex flex-col items-center justify-center w-full py-6 bg-hbc-black gap-10px">
			<div className="py-5px">
				<SubscribeHBCLogo />
			</div>

			<div className="w-full text-center justify-start text-white text-64px font-semibold font-suisse leading-80% tracking-064px">
				ROAD TO THE HITMAKER
			</div>

			<div className="w-full h-24">
				<UI.Heading3 className="text-center text-white">
					자유로운 음악 생활,
					<br />
					히트비트 멤버십과 함께하세요
				</UI.Heading3>
			</div>
		</div>
	);
};
