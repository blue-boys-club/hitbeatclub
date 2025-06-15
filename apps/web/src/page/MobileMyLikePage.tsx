import { HeartFilled } from "@/assets/svgs";
import { MobileMyPageTitle } from "@/features/mobile/my/components";
import { MobileProductItem } from "@/features/mobile/product/components";

export const MobileMyLikePage = () => {
	return (
		<div className="flex flex-col">
			<MobileMyPageTitle
				icon={<HeartFilled />}
				title="Like"
				right={"17 Items"}
			/>
			<div className="flex flex-col gap-2">
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
				<MobileProductItem />
			</div>
		</div>
	);
};
