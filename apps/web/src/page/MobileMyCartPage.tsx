import { Cart } from "@/assets/svgs";
import { MobileMyPageTitle } from "@/features/mobile/my/components";
import { MobileMyCartItem } from "@/features/mobile/my/components";

export const MobileMyCartPage = () => {
	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<MobileMyPageTitle
					icon={
						<Cart
							width="20px"
							height="25px"
						/>
					}
					title="My Cart"
					right="5 Items"
				/>
				<div className="flex flex-col gap-2">
					<MobileMyCartItem />
					<MobileMyCartItem />
					<MobileMyCartItem />
				</div>
			</div>
			<div className="flex flex-col gap-4 border-t-4px border-black">
				<div className="mt-10px flex justify-between font-semibold leading-100%">
					<span className="">Total (5 Items)</span>
					<span className="text-hbc-gray-300">700,000 KRW</span>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-col gap-10px">
						<span className="font-semibold text-9px leading-100%">
							디지털 음원 구매 후, 다운로드 또는 스트리밍을 시작하지 않은 경우에
							<br />
							한해 구매일로부터 7일 이내 환불 요청이 가능합니다.
						</span>
						<div className="flex gap-6px items-center">
							<div className="w-11px h-11px rounded-2px bg-hbc-gray-400" />
							<span className="font-semibold text-9px leading-16px">
								결제 관련 이용약관을 확인하였으며, 이에 동의합니다.
							</span>
						</div>
						<button className="h-10 rounded-5px bg-black text-white font-semibold text-16px leading-100%">
							Checkout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
