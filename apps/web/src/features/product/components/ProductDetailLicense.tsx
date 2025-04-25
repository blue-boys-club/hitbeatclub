import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/common/utils";
import { LicenseColor, LicenseType } from "../product.constants";

interface SpecialNote {
	text: string;
	color: LicenseColor;
}

interface ProductDetailLicenseProps {
	type: LicenseType;
	price: string;
	specialNote: SpecialNote;
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
	specialNote: SpecialNote;
}

const LICENSE_USAGE_RIGHTS = [
	"무제한 뮤직비디오 제작 가능",
	"상업적 라이브 공연에서 자유롭게 사용 가능",
	"라디오 방송 권한 (무제한 방송국 포함)",
	"온라인 오디오 스트리밍 무제한 가능",
	"음원 복제 및 유통 수량 제한 없음",
	"음악 녹음 및 발매용 사용 가능",
	"상업적 이용 가능",
] as const;

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

const LicenseUsageRights = memo(({ type, specialNote }: LicenseUsageRightsProps) => {
	return (
		<div className="flex flex-col gap-2.5">
			<h3 className="text-16px font-bold leading-[25.6px] -tracking-0.32px">{type} 라이센스 사용범위</h3>
			<ul
				className="flex flex-col gap-2.5"
				role="list"
			>
				{LICENSE_USAGE_RIGHTS.map((right) => (
					<li
						key={right}
						className="text-12px font-semibold leading-[18px] tracking-0.12px"
					>
						{right}
					</li>
				))}
				<li className={cn("text-[12px] font-semibold leading-[18px] tracking-0.12px", specialNote.color)}>
					{specialNote.text}
				</li>
			</ul>
		</div>
	);
});

LicenseUsageRights.displayName = "LicenseUsageRights";

const ProductDetailLicense = memo(({ type, price, specialNote, isClickable }: ProductDetailLicenseProps) => {
	return (
		<div className="flex flex-1 gap-5">
			<LicenseTypePrice
				type={type}
				price={price}
				isClickable={isClickable}
			/>
			<LicenseUsageRights
				type={type}
				specialNote={specialNote}
			/>
		</div>
	);
});

ProductDetailLicense.displayName = "ProductDetailLicense";

export { ProductDetailLicense, LicenseTypePrice, LicenseUsageRights };
export type { SpecialNote };
