"use client";

import { useState } from "react";
import { Checkbox, Correct, EmptyCheckbox, HBCLoginMain, Incorrect } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { AuthSignupCompletionModal } from "./Modal/AuthSignupCompletionModal";

const genderOptions: DropdownOption[] = [
	{ label: "남성", value: "male" },
	{ label: "여성", value: "female" },
];

const yearOptions: DropdownOption[] = Array.from({ length: 100 }, (_, i) => {
	const year = new Date().getFullYear() - i;
	return { label: `${year}`, value: year.toString() };
});

const monthOptions: DropdownOption[] = Array.from({ length: 12 }, (_, i) => {
	const month = i + 1;
	return { label: `${month}`, value: month.toString().padStart(2, "0") };
});

const dayOptions: DropdownOption[] = Array.from({ length: 31 }, (_, i) => {
	const day = i + 1;
	return { label: `${day}`, value: day.toString().padStart(2, "0") };
});

// 실제 데이터로 교체 필요
const countryOptions: DropdownOption[] = [
	{ label: "대한민국", value: "KR" },
	{ label: "미국", value: "US" },
	{ label: "일본", value: "JP" },
];

const regionOptions: DropdownOption[] = [
	{ label: "서울", value: "seoul" },
	{ label: "경기", value: "gyeonggi" },
	{ label: "인천", value: "incheon" },
];

export const AuthSignup = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		passwordConfirm: "",
		name: "",
		phone: "",
		gender: "",
		birthYear: "",
		birthMonth: "",
		birthDay: "",
		country: "",
		region: "",
	});

	const [agreements, setAgreements] = useState({
		terms: false,
		privacy: false,
		marketing: false,
	});

	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onDropdownChange = (name: string) => (value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onCheckboxChange = (name: keyof typeof agreements) => () => {
		setAgreements((prev) => ({ ...prev, [name]: !prev[name] }));
	};

	const onAllAgreements = () => {
		const allChecked = Object.values(agreements).every((v) => v);
		setAgreements({
			terms: !allChecked,
			privacy: !allChecked,
			marketing: !allChecked,
		});
	};

	const onSubmit = () => {
		setIsPopupOpen(true);
	};

	return (
		<>
			<div className="w-[466px] h-full m-auto py-20">
				<div className="flex flex-col items-center justify-center">
					<div className="mb-9">
						<HBCLoginMain className="w-[240px] h-[89px]" />
					</div>
					<div className="text-2xl font-extrabold mb-9">이메일 회원가입</div>
				</div>

				<form className="space-y-4">
					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="email"
								className="relative mb-1 font-semibold"
							>
								이메일 주소 <span className="absolute text-red-500 -top-2 -right-2">*</span>
							</label>
							<div className="flex items-center gap-1 text-sm text-[#3884FF] font-semibold">
								<Correct />
								사용할 수 있는 이메일입니다.
							</div>
						</div>
						<div className="relative">
							<input
								id="email"
								name="email"
								type="email"
								required
								className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
								value={formData.email}
								onChange={onInputChange}
							/>
							<button
								type="button"
								className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer right-2 top-1/2 text-hbc-blue"
							>
								중복 확인
							</button>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="relative mb-1 font-semibold"
						>
							비밀번호 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
							value={formData.password}
							onChange={onInputChange}
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<label
								htmlFor="passwordConfirm"
								className="relative mb-1 font-semibold"
							>
								비밀번호 확인 <span className="absolute text-red-500 -top-2 -right-2">*</span>
							</label>
							{isPasswordValid ? (
								<div className="flex items-center gap-1 text-sm text-[#3884FF] font-semibold">
									<Correct />
									비밀번호가 같습니다.
								</div>
							) : (
								<div className="flex items-center gap-1 text-sm font-semibold text-hbc-red">
									<Incorrect />
									비밀번호가 같지 않습니다.
								</div>
							)}
						</div>
						<input
							id="passwordConfirm"
							name="passwordConfirm"
							type="password"
							required
							className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
							value={formData.passwordConfirm}
							onChange={onInputChange}
						/>
					</div>

					<div>
						<label
							htmlFor="name"
							className="relative mb-1 font-semibold"
						>
							이름 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
							value={formData.name}
							onChange={onInputChange}
						/>
					</div>

					<div className="flex gap-4">
						<div className="w-1/2">
							<label
								htmlFor="phone"
								className="relative mb-1 font-semibold"
							>
								연락처 <span className="absolute text-red-500 -top-2 -right-2">*</span>
							</label>
							<div className="relative">
								<input
									id="phone"
									name="phone"
									type="tel"
									required
									className="w-full px-3 py-[5px] pr-20 border border-hbc-black rounded-md focus:outline-none"
									value={formData.phone}
									onChange={onInputChange}
								/>
								<button
									type="button"
									className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer right-2 top-1/2 text-hbc-blue"
								>
									인증
								</button>
							</div>
						</div>

						<div className="w-1/2">
							<label className="mb-1 font-semibold ">성별</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={genderOptions}
								value={formData.gender}
								onChange={onDropdownChange("gender")}
								placeholder="성별을 선택하세요"
							/>
						</div>
					</div>

					<div>
						<label className="relative mb-1 font-semibold">
							생년월일 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<div className="flex justify-between w-full">
							<div className="flex items-center justify-center gap-1">
								<Dropdown
									className="w-140px"
									optionsClassName="max-h-240px"
									options={yearOptions}
									value={formData.birthYear}
									onChange={onDropdownChange("birthYear")}
									placeholder="년"
								/>
								<span>년</span>
							</div>

							<div className="flex items-center justify-center gap-1">
								<Dropdown
									className="w-100px"
									optionsClassName="max-h-240px"
									options={monthOptions}
									value={formData.birthMonth}
									onChange={onDropdownChange("birthMonth")}
									placeholder="월"
								/>
								<span>월</span>
							</div>

							<div className="flex items-center justify-center gap-1">
								<Dropdown
									className="w-100px"
									optionsClassName="max-h-240px"
									options={dayOptions}
									value={formData.birthDay}
									onChange={onDropdownChange("birthDay")}
									placeholder="일"
								/>
								<span>일</span>
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="block mb-1 font-semibold">국가</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={countryOptions}
								value={formData.country}
								onChange={onDropdownChange("country")}
								placeholder="국가를 선택하세요"
							/>
						</div>

						<div className="w-1/2">
							<label className="block mb-1 font-semibold">지역</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={regionOptions}
								value={formData.region}
								onChange={onDropdownChange("region")}
								placeholder="지역을 선택하세요"
							/>
						</div>
					</div>

					{/* Divider */}
					<div className="w-full h-[1px] bg-hbc-black my-8"></div>

					<div className="text-center">어떤 서비스를 선호하시나요?</div>

					<div className="flex gap-4">
						<Button
							className="w-full font-['suisse'] text-lg py-2 outline-[3px] outline-offset-[-1px]"
							variant="outline"
							rounded="full"
						>
							ACAPPELLA
						</Button>
						<Button
							className="w-full font-['suisse'] text-lg py-2"
							variant="fill"
							rounded="full"
						>
							BEAT
						</Button>
					</div>

					<div className="w-full h-[1px] bg-hbc-black my-8"></div>

					{/* Agreements */}
					<div className="space-y-4">
						<div
							className="inline-flex items-center gap-2 cursor-pointer"
							onClick={onAllAgreements}
						>
							{Object.values(agreements).every((v) => v) ? <Checkbox /> : <EmptyCheckbox />}
							<span className="font-bold">약관에 모두 동의합니다.</span>
						</div>

						<div className="pl-4 space-y-2">
							<div
								className="inline-flex items-center gap-2 cursor-pointer"
								onClick={onCheckboxChange("terms")}
							>
								{agreements.terms ? <Checkbox /> : <EmptyCheckbox />}
								<span>
									[필수] 히트비트클럽 <span className="underline">서비스 이용약관</span>에 동의합니다.
								</span>
							</div>

							<div
								className="inline-flex items-center gap-2 cursor-pointer"
								onClick={onCheckboxChange("privacy")}
							>
								{agreements.privacy ? <Checkbox /> : <EmptyCheckbox />}
								<span>
									[필수] 히트비트클럽 <span className="underline">개인정보처리방침</span>에 동의합니다.
								</span>
							</div>

							<div
								className="inline-flex items-center gap-2 cursor-pointer"
								onClick={onCheckboxChange("marketing")}
							>
								{agreements.marketing ? <Checkbox /> : <EmptyCheckbox />}
								<span>이메일 수신에 동의합니다. (선택)</span>
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex justify-center gap-4 pt-8">
						<Button
							size="lg"
							variant="outline"
							className="w-full py-2.5 font-extrabold"
							type="button"
						>
							취소
						</Button>
						<Button
							size="lg"
							className="w-full py-2.5 font-extrabold"
							onClick={onSubmit}
						>
							완료
						</Button>
					</div>
				</form>
			</div>

			<AuthSignupCompletionModal
				isPopupOpen={isPopupOpen}
				onClosePopup={() => setIsPopupOpen(false)}
			/>
		</>
	);
};
