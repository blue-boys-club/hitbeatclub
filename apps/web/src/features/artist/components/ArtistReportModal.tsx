"use client";

import { memo, useState } from "react";
import { Checkbox, ChevronRight, EmptyCheckbox } from "@/assets/svgs";
import { Input } from "@/components/ui";
import {
	Popup,
	PopupButton,
	PopupContent,
	PopupDescription,
	PopupFooter,
	PopupHeader,
	PopupTitle,
} from "@/components/ui/Popup";

interface ArtistReportModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
}

interface ReportFormData {
	name: string;
	phone: string;
	email: string;
	reason: string;
}

/**
 * 아티스트 신고 모달 컴포넌트
 * - 신고자 정보 입력 (이름, 휴대폰 번호, 이메일)
 * - 신고 내용 작성
 * - 개인정보 수집 동의 체크박스
 * - 전송 시 모달 닫힘과 함께 완료 토스트 메시지 표시
 */
export const ArtistReportModal = memo(({ isOpen, onCloseModal }: ArtistReportModalProps) => {
	const [agreement, setAgreement] = useState(false);

	const onCheckboxChange = () => {
		setAgreement(!agreement);
	};

	const onSendReport = () => {
		onCloseModal();
	};

	return (
		<Popup
			open={isOpen}
			onOpenChange={onCloseModal}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">신고하기</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<form>
						<div className="flex flex-col gap-2 mb-6">
							<div className="flex items-center justify-between gap-2">
								<label htmlFor="name">이름</label>
								<Input
									type="text"
									id="name"
									className="w-[300px]"
									required
								/>
							</div>

							<div className="flex items-center justify-between gap-2">
								<label htmlFor="phone">휴대폰 번호</label>
								<Input
									type="tel"
									id="phone"
									className="w-[300px]"
									required
								/>
							</div>

							<div className="flex items-center justify-between gap-2">
								<label htmlFor="email">이메일 주소</label>
								<Input
									type="email"
									id="email"
									className="w-[300px]"
									required
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mb-6">
							<label htmlFor="report-reason">신고 내용</label>
							<textarea
								id="report-reason"
								className="w-full h-[100px] p-[5px] border-x-[1px] border-y-[2px] rounded-[5px]"
								required
							/>
						</div>

						<div
							className="inline-flex items-center gap-2 mb-6 cursor-pointer"
							onClick={onCheckboxChange}
						>
							{agreement ? <Checkbox /> : <EmptyCheckbox />}
							<span className="inline-flex items-center gap-2">
								[필수] 개인정보 수집 및 이용에 동의합니다.
								<ChevronRight />
							</span>
						</div>
					</form>
				</PopupDescription>

				<PopupFooter>
					<PopupButton onClick={onSendReport}>전송하기</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

ArtistReportModal.displayName = "ArtistReportModal";
