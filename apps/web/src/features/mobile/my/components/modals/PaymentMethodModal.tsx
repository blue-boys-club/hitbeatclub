"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Paypal, Search } from "@/assets/svgs";
import { Card } from "@/assets/svgs";
import { memo, useState, useEffect } from "react";

interface PaymentMethodModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const PaymentMethodModal = memo(({ isOpen, onClose }: PaymentMethodModalProps) => {
	const [selectedMethod, setSelectedMethod] = useState<"paypal" | "card" | null>(null);

	// 모달이 닫힐 때 selectedMethod를 초기화
	useEffect(() => {
		if (!isOpen) {
			setSelectedMethod(null);
		}
	}, [isOpen]);

	const handlePaymentMethodSelect = (method: "paypal" | "card") => {
		setSelectedMethod(method);
	};

	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
			variant="mobile"
		>
			<PopupContent className="w-[238px] flex flex-col bg-[#DADADA]">
				<PopupHeader>
					<PopupTitle className="text-[12px] leading-100% font-bold">어떻게 결제하시겠어요?</PopupTitle>
				</PopupHeader>
				<div className="flex flex-col gap-1">
					{(!selectedMethod || selectedMethod === "paypal") && (
						<button
							onClick={() => handlePaymentMethodSelect("paypal")}
							className="flex items-center justify-center w-full h-33px gap-1 rounded-3px bg-black"
						>
							<Paypal />
							<span className="font-semibold text-12px leading-100% text-white">PayPal</span>
						</button>
					)}
					{(!selectedMethod || selectedMethod === "card") && (
						<button
							onClick={() => handlePaymentMethodSelect("card")}
							className="flex items-center justify-center w-full h-33px gap-1 rounded-3px bg-black"
						>
							<Card />
							<span className="font-semibold text-12px leading-100% text-white">Card</span>
						</button>
					)}

					{selectedMethod && (
						<div className="mt-3 flex flex-col gap-6px">
							{selectedMethod === "card" ? (
								<>
									<span className="font-bold text-12px leading-100% text-center">결제 정보</span>
									<input
										type="text"
										placeholder="이름을 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<input
										type="text"
										placeholder="이메일을 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<input
										type="text"
										placeholder="연락처를 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<div className="flex gap-6px">
										<input
											type="text"
											placeholder="주소를 입력해주세요"
											className="flex-1 h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
										/>
										<button className="rounded-12px bg-black h-full px-11px flex items-center justify-center">
											<Search
												fill="white"
												width={11}
												height={11}
											/>
										</button>
									</div>
								</>
							) : selectedMethod === "paypal" ? (
								<>
									<span className="font-bold text-12px leading-100% text-center">결제 정보</span>
									<input
										type="text"
										placeholder="이름을 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<input
										type="text"
										placeholder="연락처를 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<input
										type="text"
										placeholder="이메일을 입력해주세요"
										className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
									/>
									<div className="flex gap-6px">
										<input
											type="text"
											placeholder="주소를 입력해주세요"
											className="flex-1 h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% text-center font-semibold focus:outline-none bg-white"
										/>
										<button className="rounded-12px bg-black h-full px-11px flex items-center justify-center">
											<Search
												fill="white"
												width={11}
												height={11}
											/>
										</button>
									</div>
								</>
							) : (
								<></>
							)}
						</div>
					)}
				</div>
			</PopupContent>
		</Popup>
	);
});

PaymentMethodModal.displayName = "PaymentMethodModal";
