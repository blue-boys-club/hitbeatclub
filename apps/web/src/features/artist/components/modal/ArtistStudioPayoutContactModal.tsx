"use client";

import { Checkbox, EmptyCheckbox } from "@/assets/svgs";
import UI, { Input, Popup, PopupButton } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ArtistStudioPayoutContactModalProps {
	children: React.ReactNode;
	type: "settlements" | "referrals" | "transactions";
	artistId: string;
}

// interface ArtistStudioPayoutContactForm {
// 	name: string;
// 	id: string;
// 	phone: string;
// 	email: string;
// 	message: string;
// }
const artistStudioPayoutContactForm = z.object({
	name: z.string().min(1, "이름을 입력해주세요."),
	id: z.string().min(1, "아이디를 입력해주세요."),
	phone: z
		.string()
		.min(1, "전화번호를 입력해주세요.")
		.regex(/^[0-9-]+$/, "전화번호는 숫자만 입력해주세요.")
		.transform((value) => value.replace("-", "")),
	email: z.string().email("이메일 형식이 올바르지 않습니다."),
	message: z.string().min(1, "문의 사항을 입력해주세요."),
	agreeToTerms: z.boolean().refine((data) => data, {
		message: "개인정보 수집 및 이용에 동의해주세요.",
	}),
});

export const ArtistStudioPayoutContactModal = ({ children, type, artistId }: ArtistStudioPayoutContactModalProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof artistStudioPayoutContactForm>>({
		resolver: zodResolver(artistStudioPayoutContactForm),
	});

	const handleSubmit = (data: z.infer<typeof artistStudioPayoutContactForm>) => {
		const sendData = {
			type,
			artistId,
			...data,
		};

		console.log(sendData);

		setIsOpen(false);
		form.reset();
	};

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Popup.PopupTrigger asChild>{children}</Popup.PopupTrigger>
			<Popup.PopupContent>
				<Popup.PopupHeader>
					<Popup.PopupTitle>정산 문의</Popup.PopupTitle>
					<Popup.PopupDescription className="sr-only">정산 문의 사항을 보낼 수 있습니다.</Popup.PopupDescription>
				</Popup.PopupHeader>

				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-col gap-25px"
				>
					<div className="flex flex-col self-stretch mb-4 gap-10px">
						{" "}
						{/* Added margin-bottom for spacing */}
						{/* Name Field */}
						<div className="flex flex-col self-stretch gap-4px">
							<div className="flex items-center self-stretch justify-start gap-4">
								<label
									htmlFor="name"
									className="text-left w-28 shrink-0"
								>
									{" "}
									{/* Added shrink-0 to prevent label shrinking */}
									이름
								</label>
								<Input
									id="name"
									{...form.register("name")}
								/>
							</div>
							{form.formState.errors.name && (
								<p
									role="alert"
									className="self-center ml-2 text-xs text-hbc-red"
								>
									{" "}
									{/* Basic styling, aligned center vertically */}
									{form.formState.errors.name.message}
								</p>
							)}
						</div>
						{/* ID Field */}
						<div className="flex flex-col self-stretch gap-4px">
							<div className="flex items-center self-stretch justify-start gap-4">
								<label
									htmlFor="id"
									className="text-left w-28 shrink-0"
								>
									아이디
								</label>
								<Input
									id="id"
									{...form.register("id")}
								/>
							</div>
							{form.formState.errors.id && (
								<p
									role="alert"
									className="self-center ml-2 text-xs text-hbc-red"
								>
									{form.formState.errors.id.message}
								</p>
							)}
						</div>
						{/* Phone Field */}
						<div className="flex flex-col self-stretch gap-4px">
							<div className="flex items-center self-stretch justify-start gap-4">
								<label
									htmlFor="phone"
									className="text-left w-28 shrink-0"
								>
									휴대폰 번호
								</label>
								<Input
									id="phone"
									{...form.register("phone")}
								/>
							</div>
							{form.formState.errors.phone && (
								<p
									role="alert"
									className="self-center ml-2 text-xs text-hbc-red"
								>
									{form.formState.errors.phone.message}
								</p>
							)}
						</div>
						{/* Email Field */}
						<div className="flex flex-col self-stretch gap-4px">
							<div className="flex items-center self-stretch justify-start gap-4">
								<label
									htmlFor="email"
									className="text-left w-28 shrink-0"
								>
									이메일 주소
								</label>
								<Input
									id="email"
									{...form.register("email")}
								/>
							</div>
							{form.formState.errors.email && (
								<p
									role="alert"
									className="self-center ml-2 text-xs text-hbc-red"
								>
									{form.formState.errors.email.message}
								</p>
							)}
						</div>
					</div>
					<div className="self-stretch rounded-[5px] flex flex-col justify-start items-start gap-4px">
						<div className="self-stretch justify-start text-base font-normal leading-relaxed text-black font-suit">
							문의 내용
						</div>
						{/* <div className="w-96 h-24 rounded-[5px] border-l border-r border-t-2 border-b-2 border-black" /> */}
						<textarea
							id="message"
							className="w-full min-h-24 px-1 rounded-[5px] border-l border-r border-t-2 border-b-2 border-black focus:outline-none focus:ring-0"
							{...form.register("message")}
						/>
						{form.formState.errors.message && (
							<p
								role="alert"
								className="self-center ml-2 text-xs text-hbc-red"
							>
								{form.formState.errors.message.message}
							</p>
						)}
					</div>
					<div className="flex flex-col self-stretch gap-4px">
						<div className="flex items-end self-stretch justify-between">
							<div className="flex justify-start items-center gap-[5px]">
								<label className="flex items-center gap-[5px] cursor-pointer">
									{/* Visually hidden but functional checkbox registered with react-hook-form */}
									<input
										type="checkbox"
										className="sr-only" // Tailwind class for visual hiding, ensures accessibility
										{...form.register("agreeToTerms")} // Register the field - NOTE: "agreeToTerms" must be added to the form schema to resolve lint error
									/>
									{/* Conditional rendering of custom SVG checkbox components based on form state */}
									{form.watch("agreeToTerms") ? <Checkbox /> : <EmptyCheckbox />}
									<UI.BodySmall as="span">개인정보 수집 및 이용에 동의합니다.(필수)</UI.BodySmall>
									<Link
										href="/privacy-policy"
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs font-semibold leading-none tracking-tight text-black font-suit"
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
									</Link>
								</label>
							</div>
						</div>
						{form.formState.errors.agreeToTerms && (
							<p
								role="alert"
								className="self-start ml-4 text-xs text-hbc-red"
							>
								{" "}
								{/* Align start to match checkbox alignment */}
								{form.formState.errors.agreeToTerms.message}
							</p>
						)}
					</div>
				</form>

				<Popup.PopupFooter>
					<PopupButton
						className=""
						onClick={form.handleSubmit(handleSubmit)}
					>
						전송하기
					</PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
