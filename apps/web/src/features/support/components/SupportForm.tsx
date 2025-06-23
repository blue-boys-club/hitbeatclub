"use client";
import { useCreateInquiryMutation } from "@/apis/inquiry/mutations";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { InquiryCreateRequest, InquiryCreateSchema } from "@hitbeatclub/shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const SupportForm = () => {
	const [isChecked, setIsChecked] = useState(false);
	const { toast } = useToast();

	const { mutate: createInquiry } = useCreateInquiryMutation();

	const onSubmit = (data: InquiryCreateRequest) => {
		createInquiry(data);
		reset();
		toast({
			description: "문의가 접수 되었습니다.",
		});
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		setValue,
	} = useForm<InquiryCreateRequest>({
		resolver: zodResolver(InquiryCreateSchema),
		mode: "onChange",
	});

	return (
		<section className="pt-[30px] pl-[46px] pr-[63px] flex flex-col gap-7 pb-[100px]">
			<div className="border-b-6 border-black pb-[15px] text-hbc-black font-suit text-[26px] font-extrabold leading-[100%] tracking-[0.26px]">
				그 외의 질문이 있으신가요?
			</div>

			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-[10px]">
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							이름
						</label>
						<div className="flex flex-col">
							<Input
								placeholder="이름을 입력해주세요."
								type="text"
								{...register("name", {
									required: "이름을 입력해주세요.",
								})}
							/>
							{errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
						</div>
					</div>
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							이메일 주소
						</label>
						<div className="flex flex-col">
							<Input
								placeholder="이메일 주소를 입력해주세요."
								type="email"
								{...register("email", {
									required: "이메일 주소를 입력해주세요.",
								})}
							/>
							{errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
						</div>
					</div>
					<div className="grid grid-cols-[2fr_4fr] gap-3 items-center">
						<label className="border-b-2 border-black text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
							휴대폰 번호
						</label>
						<div className="flex flex-col">
							<Input
								placeholder="휴대폰 번호를 입력해주세요. (01012345678)"
								type="tel"
								maxLength={11}
								onInput={(e) => {
									const target = e.target as HTMLInputElement;
									const value = target.value.replace(/[^0-9]/g, "");
									target.value = value;
									setValue("phoneNumber", value);
								}}
								{...register("phoneNumber", {
									pattern: {
										value: /^01[0-9]{8,9}$/,
										message: "올바른 휴대폰 번호 형식을 입력해주세요. (예: 01012345678)",
									},
								})}
							/>
							{errors.phoneNumber && <span className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</span>}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-[10px]">
					<label className="text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px]">
						문의 내용
					</label>
					<div className="flex flex-col">
						<textarea
							placeholder="문의 내용을 입력해주세요."
							className="border-2 border-black rounded-lg p-2 h-[162px] resize-none text-hbc-black font-suit text-[18px] font-semibold leading-[160%] tracking-[0.18px] focus:outline-none"
							{...register("content", {
								required: "문의 내용을 입력해주세요.",
								minLength: {
									value: 10,
									message: "문의 내용은 10자 이상 입력해주세요.",
								},
							})}
						/>
						{errors.content && <span className="text-red-500 text-sm mt-1">{errors.content.message}</span>}
					</div>
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
						type="submit"
						disabled={!isChecked || !isValid}
					>
						전송하기
					</Button>
				</div>
			</form>
		</section>
	);
};

export default SupportForm;
