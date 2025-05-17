import { useState, memo, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";
import { PaymentSuccessModal } from "@/features/cart/components/modal/PaymentSuccessModal";
import { PaymentFailureModal } from "@/features/cart/components/modal/PaymentFailureModal";
import { PaymentSelectModal } from "@/features/cart/components/modal/PaymentSelectModal";
// import { LicenseTypePrice, LicenseUsageRights } from "../ProductDetailLicense";
// import { LicenseColor, LicenseType } from "../../product.constants";

interface LicenseOption {
	id: number;
	name: string;
	description: string;
	price: number;
	benefits?: string[];
}

interface ProductDetailLicenseModalProps {
	isOpen: boolean;
	onClose: () => void;
	item: {
		id: number; // Or string, depending on your product ID type
		name: string;
		// price: number; // Base price, if needed, but typically license price is used
	};
	licenses?: LicenseOption[];
}

const defaultLicenseOptions: LicenseOption[] = [
	{
		id: 1,
		name: "Exclusive",
		description: "MP3, WAV, Stems",
		price: 100000,
		benefits: [
			"무제한 뮤직비디오 제작 가능",
			"상업적 라이브 공연에서 자유롭게 사용 가능",
			"라디오 방송 권한 (무제한 방송국 포함)",
			"온라인 오디오 스트리밍 무제한 가능",
			"음원 복제 및 유통 수량 제한 없음",
			"음악 녹음 및 발매용 사용 가능",
			"상업적 이용 가능",
			"저작권 표기 필수",
		],
	},
	{
		id: 2,
		name: "Master",
		description: "MP3, WAV, Stems",
		price: 15000,
		benefits: [
			"무제한 뮤직비디오 제작 가능",
			"상업적 라이브 공연에서 자유롭게 사용 가능",
			"라디오 방송 권한 (무제한 방송국 포함)",
			"온라인 오디오 스트리밍 무제한 가능",
			"음원 복제 및 유통 수량 제한 없음",
			"음악 녹음 및 발매용 사용 가능",
			"상업적 이용 가능",
			"저작권 표기 필수",
		],
	},
];

export const ProductDetailLicenseModal = memo(
	({ isOpen, onClose, item, licenses = defaultLicenseOptions }: ProductDetailLicenseModalProps) => {
		const [selectedLicenseId, setSelectedLicenseId] = useState<number>(licenses![0]!.id!);
		const selectedLicense = useMemo(
			() => licenses.find((license) => license.id === selectedLicenseId),
			[licenses, selectedLicenseId],
		);

		const price = useMemo(() => selectedLicense?.price, [selectedLicense]);

		const [paymentModalOpen, setPaymentModalOpen] = useState(false);
		const [successModalOpen, setSuccessModalOpen] = useState(false);
		const [failureModalOpen, setFailureModalOpen] = useState(false);
		const [paymentResult, setPaymentResult] = useState<any>(null);
		const [paymentError, setPaymentError] = useState<any>(null);

		const handlePaymentComplete = (result: any) => {
			console.log("Payment completed:", result);

			if (result && result.code && typeof result.code === "string" && result.code.startsWith("FAILURE")) {
				handlePaymentError({
					message: result.message || "결제가 실패했습니다.",
					code: result.code,
					...result,
				});
				return;
			}

			setPaymentResult({
				amount: price,
				orderId: result.paymentId || crypto.randomUUID(),
				method: result.payMethod || "CARD",
				approvedAt: new Date().toISOString(),
				...result,
			});
			setPaymentModalOpen(false);
			setSuccessModalOpen(true);
			onClose(); // Close the license modal as well
		};

		const handlePaymentError = (error: any) => {
			console.error("Payment error:", error);
			setPaymentError({
				message: error?.message || "결제 중 오류가 발생했습니다.",
				code: error?.code || "ERROR",
				...error,
			});
			setPaymentModalOpen(false);
			setFailureModalOpen(true);
			onClose(); // Close the license modal as well
		};

		const handleCart = () => {
			// TODO: Implement actual add to cart logic
			alert("장바구니 추가 기능 개발 예정입니다.");
		};

		if (!item) {
			// Handle case where item is not provided, or return a loading/error state
			return null;
		}

		return (
			<>
				<Popup.Popup
					open={isOpen}
					onOpenChange={onClose}
				>
					<Popup.PopupContent className="w-[500px] max-w-[500px]">
						<Popup.PopupHeader>
							<Popup.PopupTitle className="font-bold">라이센스 선택</Popup.PopupTitle>
						</Popup.PopupHeader>

						<div className="flex flex-col items-center justify-start w-full gap-25px">
							<div className="flex items-start justify-start gap-4">
								{licenses.map((option) => (
									<div
										key={option.id}
										className={cn(
											"p-12px rounded-lg outline-2 outline-offset-[-2px] outline-black flex flex-col justify-start items-center gap-[5px] cursor-pointer h-fit",
											selectedLicenseId === option.id ? "bg-black" : "bg-white",
										)}
										onClick={() => setSelectedLicenseId(option.id)}
									>
										<div
											className={cn(
												"text-18px font-medium leading-160% tracking-018px",
												selectedLicenseId === option.id ? "text-white font-suisse" : "text-black font-bold font-suit",
											)}
										>
											{option.name}
										</div>
										<div
											className={cn(
												"text-18px font-medium font-suisse leading-160% tracking-018px",
												selectedLicenseId === option.id ? "text-white" : "text-black",
											)}
										>
											{option.price.toLocaleString()} KRW
										</div>
										<div
											className={cn(
												"text-12px font-medium font-suisse leading-150% tracking-012px",
												selectedLicenseId === option.id ? "text-white" : "text-black",
											)}
										>
											{option.description}
										</div>
									</div>
								))}
							</div>

							<div className="flex flex-col items-center justify-center gap-25px">
								<div className="self-stretch p-12px rounded-[5px] flex flex-col justify-start items-start gap-[5px] overflow-hidden">
									<div className="font-bold leading-160% text-black text-16px font-suit -tracking-032px">
										{selectedLicense?.name} 라이센스 사용범위
									</div>
									<div className="flex flex-col items-start justify-center gap-10px">
										{selectedLicense?.benefits?.map((benefit, index) => (
											<div
												key={index}
												className={cn(
													"text-[12px] font-bold font-suit leading-150% tracking-012px",
													benefit.includes("저작권 표기")
														? benefit.includes("필수")
															? "text-hbc-red"
															: "text-hbc-blue"
														: "text-hbc-gray-400",
												)}
											>
												{benefit}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<Popup.PopupFooter>
							<Popup.PopupButton onClick={handleCart}>장바구니 담기</Popup.PopupButton>
							<Popup.PopupButton onClick={() => setPaymentModalOpen(true)}>구매하기</Popup.PopupButton>
						</Popup.PopupFooter>
					</Popup.PopupContent>
				</Popup.Popup>

				<PaymentSelectModal
					total={price!}
					orderName={`${item.name} 라이센스 구매`}
					open={paymentModalOpen}
					onOpenChange={setPaymentModalOpen}
					onPaymentComplete={handlePaymentComplete}
					onPaymentError={handlePaymentError}
					// trigger={<Popup.PopupButton>구매하기</Popup.PopupButton>} // Trigger is not needed if open is controlled
				/>

				<PaymentSuccessModal
					isOpen={successModalOpen}
					onClose={() => setSuccessModalOpen(false)}
					paymentResult={
						paymentResult || {
							amount: price!,
							orderId: "SAMPLE-ORDER-ID",
							method: "CARD",
							approvedAt: new Date().toISOString(),
						}
					}
				/>

				<PaymentFailureModal
					isOpen={failureModalOpen}
					onClose={() => setFailureModalOpen(false)}
					error={
						paymentError || {
							message: "결제 처리 중 오류가 발생했습니다.",
							code: "PAYMENT_ERROR",
						}
					}
				/>
			</>
		);
	},
);

ProductDetailLicenseModal.displayName = "ProductDetailLicenseModal";
