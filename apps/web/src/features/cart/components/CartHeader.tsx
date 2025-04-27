import { Cart } from "@/assets/svgs";

export const CartHeader = () => {
	return (
		<div className="inline-flex flex-col items-start justify-start w-full border-b-6 pl-35px pb-15px gap-5px border-hbc-black">
			<div className="inline-flex justify-center items-center gap-[14px]">
				<Cart />
				<div className="justify-start text-black text-32px font-extrabold font-suit leading-100% tracking-032px">
					Cart
				</div>
			</div>
		</div>
	);
};
