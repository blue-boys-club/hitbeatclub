"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SupportAccordian from "./SupportAccordian";
import { SupportLoge } from "@/assets/svgs/SupportLoge";
import { getQuestionDetailQueryOption, getQuestionListQueryOption } from "@/apis/question/query/question.query-options";
import { useDeleteQuestionMutation } from "@/apis/question/mutations";
import { SupportFAQModal } from "./modal/SupportFAQModal";
import { SupportFAQDeleteConfirmModal } from "./modal/SupportFAQDeleteConfirmModal";

const SupportQuestionList = () => {
	const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
	const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

	const { data: questionList } = useQuery(getQuestionListQueryOption());
	const { data: questionDetailData } = useQuery({
		...getQuestionDetailQueryOption(selectedQuestionId!),
		enabled: !!selectedQuestionId,
	});

	const { mutate: deleteQuestion } = useDeleteQuestionMutation();

	const handleOpenModal = () => {
		setSelectedQuestionId(null);
		setIsFAQModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsFAQModalOpen(false);
		setSelectedQuestionId(null);
	};

	const handleClickItem = (id: number) => {
		setSelectedQuestionId(id);
		setIsFAQModalOpen(true);
	};

	const handleDeleteClick = (id: number) => {
		setDeleteQuestionId(id);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deleteQuestionId) {
			deleteQuestion({ id: deleteQuestionId });
			setDeleteQuestionId(null);
		}
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setDeleteQuestionId(null);
	};

	return (
		<section className="pt-[30px] pl-[46px] pr-[63px]">
			<header className="pb-10 flex flex-col gap-[5px]">
				<div className="flex items-center gap-3">
					<SupportLoge />
					<div className="text-[#3884FF] font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
						Support Center
					</div>
				</div>
				<div className="text-[#3884FF] font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
					무엇을 도와드릴까요?
				</div>
			</header>
			<div className="flex flex-col pb-20">
				<div className="flex justify-between items-center border-b-6 border-black pb-[15px]">
					<div className="text-hbc-black font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
						자주 하는 질문
					</div>

					<div
						className="text-hbc-black font-suit text-[16px] font-semibold leading-[100%] tracking-[0.16px] cursor-pointer"
						onClick={handleOpenModal}
					>
						+ 새 질문 추가
					</div>
				</div>

				{questionList?.map((question) => {
					return (
						<SupportAccordian
							key={question.id}
							id={question.id}
							title={question.title}
							content={question.content}
							onClickItem={handleClickItem}
							onDeleteClick={handleDeleteClick}
						/>
					);
				})}
			</div>

			<SupportFAQModal
				isOpen={isFAQModalOpen}
				onCloseModal={handleCloseModal}
				initialData={questionDetailData}
				isEditMode={!!selectedQuestionId}
			/>

			<SupportFAQDeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onCloseModal={handleCloseDeleteModal}
				onConfirmDelete={handleConfirmDelete}
			/>
		</section>
	);
};

export default SupportQuestionList;
