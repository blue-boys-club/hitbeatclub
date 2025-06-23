"use client";

import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useCreateQuestionMutation, useUpdateQuestionMutation } from "@/apis/question/mutations";
import { useToast } from "@/hooks/use-toast";

interface SupportFAQModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
	initialData?: {
		id: number;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
	};
	isEditMode?: boolean;
}

interface FAQFormData {
	title: string;
	content: string;
}

/**
 * FAQ 문의 모달 컴포넌트
 * - 제목 입력
 * - 내용 작성
 * - 필수 항목 유효성 검사
 * - 수정 모드 지원
 */
export const SupportFAQModal = memo(
	({ isOpen, onCloseModal, initialData, isEditMode = false }: SupportFAQModalProps) => {
		const { toast } = useToast();
		const { mutate: createQuestion } = useCreateQuestionMutation();
		const { mutate: updateQuestion } = useUpdateQuestionMutation();

		const {
			register,
			handleSubmit,
			formState: { errors },
			reset,
			setValue,
		} = useForm<FAQFormData>({
			mode: "onChange",
		});

		// 수정 모드일 때 초기 데이터 설정
		useEffect(() => {
			if (isEditMode && initialData) {
				setValue("title", initialData.title);
				setValue("content", initialData.content);
			} else {
				reset();
			}
		}, [isEditMode, initialData, setValue, reset]);

		const onSubmit = (data: FAQFormData) => {
			if (isEditMode) {
				if (!initialData?.id) return;

				updateQuestion({
					id: initialData.id,
					payload: {
						title: data.title,
						content: data.content,
					},
				});
			} else {
				createQuestion({
					title: data.title,
					content: data.content,
				});
			}
			reset();
			onCloseModal();
			toast({
				description: `질문이 ${isEditMode ? "수정" : "등록"}되었습니다.`,
			});
		};

		const onCloseHandler = () => {
			reset();
			onCloseModal();
		};

		return (
			<Popup
				open={isOpen}
				onOpenChange={onCloseHandler}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-[26px] font-bold">{isEditMode ? "FAQ 수정" : "FAQ 등록"}</PopupTitle>
					</PopupHeader>

					<PopupDescription>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-2 mb-6">
								<div className="flex items-center justify-between gap-2">
									<label htmlFor="title">제목</label>
									<div className="flex flex-col">
										<Input
											type="text"
											id="title"
											placeholder="제목을 입력해주세요."
											className="w-[300px]"
											{...register("title", {
												required: "제목을 입력해주세요.",
											})}
										/>
										{errors.title && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-2 mb-6">
								<label htmlFor="content">문의 내용</label>
								<div className="flex flex-col">
									<textarea
										id="content"
										placeholder="내용을 입력해주세요."
										className="w-full h-[100px] p-[5px] border-x-[1px] border-y-[2px] rounded-[5px] resize-none focus:outline-none"
										{...register("content", {
											required: "내용을 입력해주세요.",
										})}
									/>
									{errors.content && <span className="text-red-500 text-sm mt-1">{errors.content.message}</span>}
								</div>
							</div>
						</form>
					</PopupDescription>

					<PopupFooter>
						<PopupButton onClick={handleSubmit(onSubmit)}>{isEditMode ? "수정하기" : "등록하기"}</PopupButton>
					</PopupFooter>
				</PopupContent>
			</Popup>
		);
	},
);

SupportFAQModal.displayName = "SupportFAQModal";
