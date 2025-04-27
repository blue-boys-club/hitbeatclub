import React from "react";
import SupportAccordian from "./SupportAccordian";
import { questions } from "../support.constants";
import { SupportLoge } from "@/assets/svgs/SupportLoge";

const SupportQuestionList = () => {
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
				<div className="border-b-6 border-black pb-[15px] text-hbc-black font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
					자주 하는 질문
				</div>
				{questions.map((question) => {
					return (
						<SupportAccordian
							key={question.id}
							title={question.question}
							content={question.content}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default SupportQuestionList;
