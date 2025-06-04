"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArtistStudioAccountSettingSettleModal } from "@/features/artist/components/modal/ArtistStudioAccountSettingSettleModal";
import { useQuery } from "@tanstack/react-query";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { BANK_LABEL_MAP } from "../../artist-studio.constants";

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

export const ArtistStudioAccountSettingSettlement = memo(() => {
	const { data: artistMe } = useQuery({ ...getArtistMeQueryOption(), retry: false });
	const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
	const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false);

	const settlementData = artistMe?.settlement;
	const hasSettlementInfo = !!settlementData;

	const onSaveComplete = () => {
		setIsCompletePopupOpen(true);
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
							{settlementData.type === "BANK_ACCOUNT" ? (
								<>
									<div>
										계좌: {BANK_LABEL_MAP[settlementData.accountBank]} {settlementData.accountNumber}
									</div>
									<div>예금주: {settlementData.accountHolder}</div>
								</>
							) : (
								<>
									<div>페이팔: {settlementData.paypalAccount}</div>
									<div>이름: {settlementData.accountHolder}</div>
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
				isSettingPopupOpen={isSettingPopupOpen}
				isCompletePopupOpen={isCompletePopupOpen}
				onSaveComplete={onSaveComplete}
				onCloseSettingPopup={onCloseSettingPopup}
				onCloseCompletePopup={onCloseCompletePopup}
			/>
		</>
	);
});

ArtistStudioAccountSettingSettlement.displayName = "ArtistStudioAccountSettingSettlement";
