import { useState, memo } from "react";
import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { LicenseTypePrice, LicenseUsageRights } from "../ProductDetailLicense";
import { LicenseColor, LicenseType } from "../../product.constants";

interface LicenseOption {
	price: string;
	specialNote: {
		text: string;
		color: LicenseColor;
	};
}

interface ProductDetailLicenseModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const LICENSE_OPTIONS: Record<LicenseType, LicenseOption> = {
	Exclusive: {
		price: "140,000 KRW",
		specialNote: {
			text: "저작권 표기 필수",
			color: LicenseColor.RED,
		},
	},
	Master: {
		price: "40,000 KRW",
		specialNote: {
			text: "저작권 일체 판매",
			color: LicenseColor.BLUE,
		},
	},
};

export const ProductDetailLicenseModal = memo(({ isOpen, onClose }: ProductDetailLicenseModalProps) => {
	const [selectedLicense, setSelectedLicense] = useState<LicenseType>(LicenseType.EXCLUSIVE);

	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle>
						<h2 className="text-26px font-extrabold leading-[32px] tracking-0.26px">라이센스 선택</h2>
					</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<main className="flex flex-col items-center gap-6">
						<section className="flex justify-center gap-4">
							{(Object.keys(LICENSE_OPTIONS) as LicenseType[]).map((type) => (
								<LicenseTypePrice
									key={type}
									type={type}
									price={LICENSE_OPTIONS[type].price}
									isSelected={selectedLicense === type}
									onClick={() => setSelectedLicense(type)}
								/>
							))}
						</section>

						<section className="flex flex-col items-center gap-4">
							<LicenseUsageRights
								type={selectedLicense}
								specialNote={LICENSE_OPTIONS[selectedLicense].specialNote}
							/>
						</section>
					</main>
				</PopupDescription>

				<PopupFooter>
					<nav className="w-full flex gap-4 mt-4">
						<Button
							rounded="full"
							className="flex-1"
							onClick={() => {
								// TODO: 장바구니 담기 로직
							}}
						>
							장바구니 담기
						</Button>
						<Button
							rounded="full"
							className="flex-1"
							onClick={() => {
								// TODO: 구매하기 로직
							}}
						>
							구매하기
						</Button>
					</nav>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

ProductDetailLicenseModal.displayName = "ProductDetailLicenseModal";
