"use client";

import { memo, MouseEvent, useState } from "react";
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
import { useReportArtistMutation } from "@/apis/artist/mutation/useReportArtistMutation";

interface ArtistReportModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
	artistId: number;
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
export const ArtistReportModal = memo(({ isOpen, onCloseModal, artistId }: ArtistReportModalProps) => {
	const [reporterName, setReporterName] = useState("");
	const [reporterPhone, setReporterPhone] = useState("");
	const [reporterEmail, setReporterEmail] = useState("");
	const [content, setContent] = useState("");
	const [agreedPrivacyPolicy, setAgreedPrivacyPolicy] = useState(false);
	const [validate, setValidate] = useState({ error: false, message: "" });
	const { mutate: reportArtist, isError, isPending } = useReportArtistMutation();

	const onCheckboxChange = () => {
		setAgreedPrivacyPolicy(!agreedPrivacyPolicy);
	};

	const onSendReport = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!reporterName) {
			setValidate({ error: true, message: "이름을 입력해주세요." });
			return;
		}
		if (!reporterPhone) {
			setValidate({ error: true, message: "번호를 입력해주세요." });
			return;
		}
		if (!reporterEmail) {
			setValidate({ error: true, message: "이메일을 입력해주세요." });
			return;
		}
		if (!emailRegex.test(reporterEmail)) {
			setValidate({ error: true, message: "이메일 형식을 정확히 입력해주세요." });
			return;
		}
		if (!content) {
			setValidate({ error: true, message: "신고 내용을 입력해주세요." });
			return;
		}
		if (content.length < 10) {
			setValidate({ error: true, message: "신고 내용은 10자 이상 입력해 주세요." });
			return;
		}
		if (!agreedPrivacyPolicy) {
			setValidate({ error: true, message: "수집 및 동의를 체크해주세요" });
			return;
		}

		reportArtist(
			{
				id: artistId,
				payload: { reporterName, reporterPhone, reporterEmail, content, agreedPrivacyPolicy },
			},
			{
				onSuccess: () => {
					setReporterName("");
					setReporterPhone("");
					setReporterEmail("");
					setContent("");
					setAgreedPrivacyPolicy(false);
					onCloseModal();
				},
			},
		);
	};

	return (
		<Popup
			open={isOpen}
			onOpenChange={onCloseModal}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-[36px] font-normal text-black text-center font-['Actor'] leading-[32px] tracking-[0.36px]">
						신고하기
					</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<form>
						<div className="flex flex-col gap-2 mb-6">
							<div className="flex items-center justify-between gap-2">
								<label
									htmlFor="name"
									className="text-[#000] font-['SUIT'] text-[18px] font-semibold leading-[160%] tracking-[0.18px]"
								>
									이름
								</label>
								<Input
									type="text"
									id="name"
									className={"w-[300px]"}
									required
									value={reporterName}
									onChange={(e) => setReporterName(e.target.value)}
								/>
							</div>

							<div className="flex items-center justify-between gap-2">
								<label
									htmlFor="phone"
									className="text-[#000] font-['SUIT'] text-[18px] font-semibold leading-[160%] tracking-[0.18px]"
								>
									휴대폰 번호
								</label>
								<Input
									type="tel"
									id="phone"
									className="w-[300px]"
									required
									value={reporterPhone}
									onChange={(e) => setReporterPhone(e.target.value)}
								/>
							</div>

							<div className="flex items-center justify-between gap-2">
								<label
									htmlFor="email"
									className="text-[#000] font-['SUIT'] text-[18px] font-semibold leading-[160%] tracking-[0.18px]"
								>
									이메일 주소
								</label>
								<Input
									type="email"
									id="email"
									className="w-[300px]"
									required
									value={reporterEmail}
									onChange={(e) => setReporterEmail(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mb-6">
							<label
								htmlFor="report-reason"
								className="text-[#000] font-['SUIT'] text-[18px] font-semibold leading-[160%] tracking-[0.18px]"
							>
								신고 내용
							</label>
							<textarea
								id="report-reason"
								className="w-full h-[100px] p-[5px] border-x-[1px] border-y-[2px] rounded-[5px]"
								required
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
						</div>

						<div
							className="inline-flex items-center gap-2 mb-6 cursor-pointer"
							onClick={onCheckboxChange}
						>
							{agreedPrivacyPolicy ? <Checkbox /> : <EmptyCheckbox />}
							<span className="inline-flex items-center gap-2 text-[#000] font-['SUIT'] text-[12px] font-semibold leading-[150%] tracking-[0.12px]">
								[필수] 개인정보 수집 및 이용에 동의합니다.
								<ChevronRight />
							</span>
						</div>
						{validate.error && (
							<div className="items-center gap-2 font-['SUIT'] text-[12px] font-semibold leading-[150%] tracking-[0.12px] text-hbc-red">
								{validate.message}
							</div>
						)}
						{isError && (
							<div className="inline-flex items-center gap-2 font-['SUIT'] text-[12px] font-semibold leading-[150%] tracking-[0.12px] text-hbc-red">
								신고 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
							</div>
						)}
					</form>
				</PopupDescription>

				<PopupFooter>
					<PopupButton onClick={onSendReport}>{isPending ? "전송중..." : "전송하기"}</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

ArtistReportModal.displayName = "ArtistReportModal";
