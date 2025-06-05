import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Input, Dropdown } from "@/components/ui";
import { cn } from "@/common/utils";
import { Button } from "@/components/ui/Button";
import { useCreateArtistSettlementMutation } from "@/apis/artist/mutation";
import { useUpdateArtistSettlementMutation } from "@/apis/artist/mutation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { TempSpinner } from "@/assets/svgs/TempSpinner";
import { SettlementResponse, SettlementBank } from "@hitbeatclub/shared-types/settlement";
import { BANK_OPTIONS } from "@/features/artist-studio/artist-studio.constants";

interface ArtistStudioAccountSettingSettleModalProps {
	isSettingPopupOpen: boolean;
	isCompletePopupOpen: boolean;
	onSaveComplete: () => void;
	onCloseSettingPopup: () => void;
	onCloseCompletePopup: () => void;
}

export const ArtistStudioAccountSettingSettleModal = ({
	isSettingPopupOpen,
	isCompletePopupOpen,
	onSaveComplete,
	onCloseSettingPopup,
	onCloseCompletePopup,
}: ArtistStudioAccountSettingSettleModalProps) => {
	const { data: artistMe } = useQuery({ ...getArtistMeQueryOption(), retry: false });
	const { mutateAsync: createArtistSettlement, isPending: isCreatingArtistSettlement } =
		useCreateArtistSettlementMutation();
	const { mutateAsync: updateArtistSettlement, isPending: isUpdatingArtistSettlement } =
		useUpdateArtistSettlementMutation();

	// artistMe.settlement 기반으로 편집 모드 결정
	// const isEdit = !!artistMe?.settlement;
	// const existingSettlement = artistMe?.settlement;
	const isEdit = useMemo(() => {
		return !!artistMe?.settlement;
	}, [artistMe]);
	const existingSettlement = useMemo(() => {
		return artistMe?.settlement;
	}, [artistMe]);

	// 폼 데이터 상태 관리
	const [formData, setFormData] = useState<SettlementResponse>(
		existingSettlement || {
			type: "BANK_ACCOUNT",
			accountHolder: "",
			accountNumber: "",
			accountBank: "BANK_OF_KOREA",
		},
	);

	// artistMe.settlement이 변경될 때 formData 업데이트
	useEffect(() => {
		if (existingSettlement) {
			setFormData(existingSettlement);
		}
	}, [existingSettlement]);

	const isPending = useMemo(() => {
		return isCreatingArtistSettlement || isUpdatingArtistSettlement;
	}, [isCreatingArtistSettlement, isUpdatingArtistSettlement]);

	const onChangeFormData = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handlePaymentMethodChange = (type: "BANK_ACCOUNT" | "PAYPAL") => {
		if (type === "BANK_ACCOUNT") {
			setFormData({
				type: "BANK_ACCOUNT",
				accountHolder: formData.accountHolder,
				accountNumber: formData.type === "BANK_ACCOUNT" ? formData.accountNumber : "",
				accountBank: formData.type === "BANK_ACCOUNT" ? formData.accountBank : "BANK_OF_KOREA",
			});
		} else {
			setFormData({
				type: "PAYPAL",
				accountHolder: formData.accountHolder,
				paypalAccount: formData.type === "PAYPAL" ? formData.paypalAccount : "",
			});
		}
	};

	const handleSaveSettlement = useCallback(async () => {
		try {
			const artistId = artistMe?.id;
			if (!artistId) {
				throw new Error("아티스트 아이디가 없습니다.");
			}

			if (isEdit) {
				await updateArtistSettlement({ artistId, payload: formData });
			} else {
				await createArtistSettlement({ artistId, payload: formData });
			}

			// 성공적으로 저장되면 완료 콜백 호출
			onSaveComplete();
			onCloseSettingPopup();
		} catch (error) {
			console.error("정산 정보 저장 실패:", error);
		}
	}, [artistMe, formData, isEdit, updateArtistSettlement, createArtistSettlement, onSaveComplete, onCloseSettingPopup]);

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

					<div className="flex flex-1 flex-col gap-6">
						<div>
							<label className="text-[14px] font-bold">계좌 / 페이팔</label>
							<div className="flex gap-2">
								<div className="flex-1">
									<Button
										variant="outline"
										className={cn("w-full", formData.type === "BANK_ACCOUNT" && "bg-hbc-black text-hbc-white")}
										onClick={() => handlePaymentMethodChange("BANK_ACCOUNT")}
									>
										계좌
									</Button>
								</div>
								<div className="flex-1">
									<Button
										variant="outline"
										className={cn("w-full", formData.type === "PAYPAL" && "bg-hbc-black text-hbc-white")}
										onClick={() => handlePaymentMethodChange("PAYPAL")}
									>
										페이팔
									</Button>
								</div>
							</div>
						</div>

						{formData.type === "BANK_ACCOUNT" ? (
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<label className="text-[14px] font-bold">은행</label>
									<Dropdown
										options={BANK_OPTIONS}
										defaultValue={formData.accountBank}
										className="w-full"
										onChange={(value) => onChangeFormData("accountBank", value as SettlementBank)}
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
									<label className="text-[14px] font-bold">예금주명</label>
									<Input
										placeholder="예금주명을 입력해주세요"
										value={formData.accountHolder}
										onChange={(e) => onChangeFormData("accountHolder", e.target.value)}
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
										value={formData.accountHolder}
										onChange={(e) => onChangeFormData("accountHolder", e.target.value)}
									/>
								</div>
							</div>
						)}
					</div>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={handleSaveSettlement}
							disabled={isPending}
						>
							{isPending ? <TempSpinner className="w-4 h-4" /> : null}
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
