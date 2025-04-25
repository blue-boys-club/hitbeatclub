"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArtistStudioAccountSettingSettleModal } from "./modal/ArtistStudioAccountSettingSettleModal";

/**
 * 결제 수단 타입 정의
 * @description 아티스트 정산 정보 설정에서 사용되는 결제 수단 타입
 */
enum PaymentMethod {
	ACCOUNT = "account",
	PAYPAL = "paypal",
}

/**
 * 정산 정보 폼 데이터 타입
 * @property paymentMethod - 결제 수단 (계좌/페이팔)
 * @property bank - 은행 (계좌 선택 시)
 * @property accountNumber - 계좌번호 (계좌 선택 시)
 * @property paypalAccount - 페이팔 계정 (페이팔 선택 시)
 * @property name - 예금주명 또는 페이팔 계정 소유자 이름
 */
interface SettlementFormData {
	paymentMethod: PaymentMethod;
	bank?: string;
	accountNumber?: string;
	paypalAccount?: string;
	name: string;
}

/**
 * 아티스트 스튜디오 계정 설정 - 정산 정보 컴포넌트 Props
 * @property initialData - 초기 정산 정보 데이터
 */
interface ArtistStudioAccountSettingSettlementProps {
	initialData?: SettlementFormData;
}

/**
 * 아티스트 스튜디오 계정 설정 - 정산 정보 컴포넌트
 *
 * @description
 * 아티스트의 정산 정보를 설정하고 관리하는 컴포넌트입니다.
 * - 계좌 또는 페이팔 선택 가능
 * - 계좌: 은행, 계좌번호, 예금주명 입력 및 계좌 인증
 * - 페이팔: 계정정보, 이름 입력
 * - 신규 설정 및 기존 정보 수정 기능 제공
 */
export const ArtistStudioAccountSettingSettlement = memo(
	({ initialData }: ArtistStudioAccountSettingSettlementProps) => {
		const [hasSettlementInfo, setHasSettlementInfo] = useState(!!initialData);
		const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
		const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false);

		const [formData, setFormData] = useState<SettlementFormData>(
			initialData || {
				paymentMethod: PaymentMethod.ACCOUNT,
				name: "",
			},
		);

		const onChangeFormData = (field: keyof SettlementFormData, value: string) => {
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));
		};

		const onSaveSettlement = () => {
			setIsSettingPopupOpen(false);
			setIsCompletePopupOpen(true);
			setHasSettlementInfo(true);
		};

		const onCloseSettingPopup = () => {
			setIsSettingPopupOpen(false);
		};

		const onCloseCompletePopup = () => {
			setIsCompletePopupOpen(false);
		};

		return (
			<>
				<div className="w-full flex flex-col items-center gap-15">
					<div className="w-full border-y-[1px] p-4 flex flex-col justify-center gap-4">
						<div className="text-[16px] font-extrabold leading-[19.2px] tracking-0.16px">정산 전용 계좌</div>
						{!hasSettlementInfo ? (
							<div className="text-[16px] text-hbc-red font-bold leading-[24px] tracking-0.16px">
								판매 대금 정산을 위한 정산 전용 계좌 입력은 필수입니다. <br />
								수익금 지급을 위해 정산 정보 설정을 완료해 주세요.
							</div>
						) : (
							<div className="text-[16px] font-bold leading-[24px] tracking-0.16px">
								{formData.paymentMethod === PaymentMethod.ACCOUNT ? (
									<>
										<div>
											계좌: {formData.bank} {formData.accountNumber}
										</div>
										<div>이름: {formData.name}</div>
									</>
								) : (
									<>
										<div>페이팔: {formData.paypalAccount}</div>
										<div>이름: {formData.name}</div>
									</>
								)}
							</div>
						)}
					</div>

					<Button
						rounded="full"
						onClick={() => setIsSettingPopupOpen(true)}
					>
						{hasSettlementInfo ? "정산 정보 변경" : "정산 정보 설정"}
					</Button>

					<div className="text-hbc-gray-300 text-[12px] font-bold leading-[14.4px] tracking-0.12px">
						❗정산은 등록하신 계좌정보를 기준으로 진행되며, 정확한 정보 입력을 부탁드립니다. <br />
						입력 오류로 인한 책임은 당사에서 부담하지 않습니다.
					</div>
				</div>

				<ArtistStudioAccountSettingSettleModal
					isEdit={hasSettlementInfo}
					formData={formData}
					onChangeFormData={onChangeFormData}
					isSettingPopupOpen={isSettingPopupOpen}
					isCompletePopupOpen={isCompletePopupOpen}
					onSaveSettlement={onSaveSettlement}
					onCloseSettingPopup={onCloseSettingPopup}
					onCloseCompletePopup={onCloseCompletePopup}
				/>
			</>
		);
	},
);

ArtistStudioAccountSettingSettlement.displayName = "ArtistStudioAccountSettingSettlement";
