import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Input, Dropdown } from "@/components/ui";
import { cn } from "@/common/utils";
import { Button } from "@/components/ui/Button";

/**
 * 결제 수단 타입 정의
 */
enum PaymentMethod {
	ACCOUNT = "account",
	PAYPAL = "paypal",
}

/**
 * 정산 정보 폼 데이터 타입
 */
interface SettlementFormData {
	paymentMethod: PaymentMethod;
	bank?: string;
	accountNumber?: string;
	paypalAccount?: string;
	name: string;
}

/**
 * 은행 목록 데이터
 */
const bankOptions = [
	{ value: "shinhan", label: "신한은행" },
	{ value: "kb", label: "국민은행" },
	{ value: "woori", label: "우리은행" },
	{ value: "hana", label: "하나은행" },
	{ value: "nh", label: "농협은행" },
];

interface ArtistStudioAccountSettingSettleModalProps {
	isEdit: boolean;
	formData: SettlementFormData;
	onChangeFormData: (field: keyof SettlementFormData, value: string) => void;
	isSettingPopupOpen: boolean;
	isCompletePopupOpen: boolean;
	onSaveSettlement: () => void;
	onCloseSettingPopup: () => void;
	onCloseCompletePopup: () => void;
}

export const ArtistStudioAccountSettingSettleModal = ({
	isEdit,
	formData,
	onChangeFormData,
	isSettingPopupOpen,
	isCompletePopupOpen,
	onSaveSettlement,
	onCloseSettingPopup,
	onCloseCompletePopup,
}: ArtistStudioAccountSettingSettleModalProps) => {
	return (
		<>
			<Popup
				open={isSettingPopupOpen}
				onOpenChange={onCloseSettingPopup}
			>
				<PopupContent>
					<PopupHeader className="mb-6">
						<PopupTitle className="font-bold">{isEdit ? "정산 정보 변경" : "정산 정보 설정"}</PopupTitle>
					</PopupHeader>

					<PopupDescription>
						<div className="flex flex-col gap-6">
							<div>
								<label className="text-[14px] font-bold">계좌 / 페이팔</label>
								<div className="flex gap-2">
									<div className="flex-1">
										<Button
											variant="outline"
											className={cn(
												"w-full",
												formData.paymentMethod === PaymentMethod.ACCOUNT && "bg-hbc-black text-hbc-white",
											)}
											onClick={() => onChangeFormData("paymentMethod", PaymentMethod.ACCOUNT)}
										>
											계좌
										</Button>
									</div>
									<div className="flex-1">
										<Button
											variant="outline"
											className={cn(
												"w-full",
												formData.paymentMethod === PaymentMethod.PAYPAL && "bg-hbc-black text-hbc-white",
											)}
											onClick={() => onChangeFormData("paymentMethod", PaymentMethod.PAYPAL)}
										>
											페이팔
										</Button>
									</div>
								</div>
							</div>

							{formData.paymentMethod === PaymentMethod.ACCOUNT ? (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-2">
										<label className="text-[14px] font-bold">은행</label>
										<Dropdown
											options={bankOptions}
											defaultValue={formData.bank || "shinhan"}
											className="w-full"
											onChange={(value) => onChangeFormData("bank", value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[14px] font-bold">계좌번호</label>
										<Input
											placeholder="계좌번호를 입력해주세요"
											value={formData.accountNumber}
											onChange={(e) => onChangeFormData("accountNumber", e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[14px] font-bold">이름</label>
										<Input
											placeholder="이름을 입력해주세요"
											value={formData.name}
											onChange={(e) => onChangeFormData("name", e.target.value)}
										/>
									</div>
									<div className="flex justify-end">
										<Button
											variant="fill"
											className="text-hbc-blue text-[14px] bg-transparent hover:bg-transparent p-0"
										>
											계좌 인증
										</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-2">
										<label className="text-[14px] font-bold">계정정보</label>
										<Input
											placeholder="페이팔 계정을 입력해주세요"
											value={formData.paypalAccount}
											onChange={(e) => onChangeFormData("paypalAccount", e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[14px] font-bold">이름</label>
										<Input
											placeholder="이름을 입력해주세요"
											value={formData.name}
											onChange={(e) => onChangeFormData("name", e.target.value)}
										/>
									</div>
								</div>
							)}
						</div>
					</PopupDescription>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={onSaveSettlement}
						>
							{isEdit ? "변경하기" : "저장하기"}
						</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>

			<Popup
				open={isCompletePopupOpen}
				onOpenChange={onCloseCompletePopup}
			>
				<PopupContent>
					<PopupHeader className="mb-6">
						<PopupTitle className="font-bold">
							{isEdit ? "정산 정보 변경이 완료되었습니다!" : "정산 정보 설정이 완료되었습니다!"}
						</PopupTitle>
					</PopupHeader>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={onCloseCompletePopup}
						>
							확인
						</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>
		</>
	);
};

ArtistStudioAccountSettingSettleModal.displayName = "ArtistStudioAccountSettingSettleModal";
