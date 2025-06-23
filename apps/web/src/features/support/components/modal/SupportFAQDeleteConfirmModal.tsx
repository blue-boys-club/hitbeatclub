"use client";

import { memo } from "react";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface SupportDeleteConfirmModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
	onConfirmDelete: () => void;
}

/**
 * 질문 삭제 확인 모달 컴포넌트
 * - 삭제 확인 메시지 표시
 * - 취소/삭제 버튼 제공
 */
export const SupportFAQDeleteConfirmModal = memo(
	({ isOpen, onCloseModal, onConfirmDelete }: SupportDeleteConfirmModalProps) => {
		const handleConfirm = () => {
			onConfirmDelete();
			onCloseModal();
		};

		return (
			<Popup
				open={isOpen}
				onOpenChange={onCloseModal}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-[26px] font-bold">정말 삭제하시겠습니까?</PopupTitle>
					</PopupHeader>

					<PopupFooter className="gap-4">
						<PopupButton
							intent="cancel"
							onClick={onCloseModal}
						>
							취소
						</PopupButton>
						<PopupButton
							intent="confirm"
							className="bg-red-500 hover:bg-red-600"
							onClick={handleConfirm}
						>
							삭제하기
						</PopupButton>
					</PopupFooter>
				</PopupContent>
			</Popup>
		);
	},
);

SupportFAQDeleteConfirmModal.displayName = "SupportFAQDeleteConfirmModal";
