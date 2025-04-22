"use client";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

const SupportForm = () => {
	const [isChecked, setIsChecked] = useState(false);
	const { toast } = useToast();
	const onClickSubmit = () => {
		toast({
			description: "문의가 접수 되었습니다.",
		});
	};
	return (
		<section className="pt-[30px] pl-[46px] pr-[63px] flex flex-col gap-7 pb-[100px]">
			<div className="border-b-6 border-black pb-[15px] text-hbc-black font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
				그 외의 질문이 있으신가요?
			</div>
			<form className="flex flex-col gap-4">
				<div className="flex flex-col gap-[10px]">
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							이름
						</label>
						<Input
							placeholder="이름을 입력해주세요."
							type="text"
						/>
					</div>
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							이메일 주소
						</label>
						<Input
							placeholder="이메일 주소를 입력해주세요."
							type="email"
						/>
					</div>
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							휴대폰 번호
						</label>
						<Input
							placeholder="휴대폰 번호를 입력해주세요."
							type="tel"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-[10px]">
					<label className="text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
						문의 내용
					</label>
					<textarea className="border-2 border-black rounded-lg p-2 h-[162px] resize-none text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px] focus:outline-none" />
				</div>
				<div className="flex justify-between items-end">
					<div className="flex gap-1 items-center">
						<label className="flex items-center gap-1 select-none cursor-pointer">
							<input
								type="checkbox"
								checked={isChecked}
								onChange={() => setIsChecked(!isChecked)}
							/>
							개인정보 수집 및 이용에 동의합니다.(필수)
						</label>
						<button
							className="cursor-pointer"
							onClick={(e) => e.preventDefault()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="5"
								height="8"
								viewBox="0 0 5 8"
								fill="none"
							>
								<path
									d="M1 1L4 4L1 7"
									stroke="#4D4D4F"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
					<Button
						disabled={!isChecked}
						onClick={onClickSubmit}
					>
						전송하기
					</Button>
				</div>
			</form>
		</section>
	);
};

export default SupportForm;
