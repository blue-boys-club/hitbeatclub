import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/common/utils";
import { LicenseColor, LicenseType } from "../product.constants";

export type LicenseNote = string | { text: string; color: LicenseColor };

interface ProductDetailLicenseProps {
	type: LicenseType;
	price: string;
	notes: LicenseNote[];
	isClickable?: boolean;
}

interface LicenseTypePriceProps {
	type: LicenseType;
	price: string;
	isSelected?: boolean;
	onClick?: () => void;
	isClickable?: boolean;
}

interface LicenseUsageRightsProps {
	type: LicenseType;
	notes: LicenseNote[];
}

const LicenseTypePrice = memo(({ type, price, isSelected, isClickable = true, onClick }: LicenseTypePriceProps) => {
	return (
		<Button
			variant="outline"
			className={cn(
				"p-2 h-fit flex flex-col items-center justify-center",
				isSelected && "bg-hbc-black text-white hover:bg-hbc-black hover:text-white",
				!isClickable && "cursor-default hover:bg-transparent",
			)}
			onClick={onClick}
		>
			<div className="text-[18px] font-bold leading-[28.8px] tracking-0.18px">{type}</div>
			<div className="text-[18px] font-bold leading-[28.8px] tracking-0.18px">{price}</div>
			<div className="text-[12px] font-medium leading-[18px] tracking-0.12px">MP3, WAV, Stems</div>
		</Button>
	);
});

LicenseTypePrice.displayName = "LicenseTypePrice";

const LicenseUsageRights = memo(({ type, notes }: LicenseUsageRightsProps) => {
	return (
		<div className="flex flex-col gap-2.5">
			<h3 className="text-16px font-bold leading-[25.6px] -tracking-0.32px">{type} 라이센스 사용범위</h3>
			<ul
				className="flex flex-col gap-2.5"
				role="list"
			>
				{notes.map((right, index) => (
					<li
						key={index}
						className={cn(
							"text-12px font-semibold leading-[18px] tracking-0.12px",
							typeof right === "object" && right.color,
						)}
					>
						{typeof right === "string" ? right : right.text}
					</li>
				))}
			</ul>
		</div>
	);
});

LicenseUsageRights.displayName = "LicenseUsageRights";

const ProductDetailLicense = memo(({ type, price, notes, isClickable }: ProductDetailLicenseProps) => {
	return (
		<div className="flex flex-1 gap-5">
			<LicenseTypePrice
				type={type}
				price={price}
				isClickable={isClickable}
			/>
			<LicenseUsageRights
				type={type}
				notes={notes}
			/>
		</div>
	);
});

ProductDetailLicense.displayName = "ProductDetailLicense";

export { ProductDetailLicense, LicenseTypePrice, LicenseUsageRights };
