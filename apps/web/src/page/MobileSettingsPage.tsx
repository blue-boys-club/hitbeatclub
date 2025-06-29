"use client";

import { useUpdateUserProfileMutation } from "@/apis/user/mutations/useUpdateUserProfileMutation";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { ArrowLeftShort, Outlink } from "@/assets/svgs";
import { Checkbox, Toggle } from "@/components/ui";
import { MobileSettingsPageTitle, MobileSettingsSelect } from "@/features/mobile/settings/components";
import { MobileSettingsFormData, MobileSettingsFormSchema } from "@/features/mobile/settings/mobile-settings.types";
import { MobileUserChangePasswordModal } from "@/features/mobile/user/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const genderOptions = [
	{ value: "M", label: "남성" },
	{ value: "F", label: "여성" },
];

const countryOptions = [
	{ value: "KOR", label: "대한민국" },
	{ value: "US", label: "미국" },
	{ value: "JP", label: "일본" },
	{ value: "CN", label: "중국" },
];

const regionOptions = [
	{ value: "Seoul", label: "서울" },
	{ value: "Busan", label: "부산" },
	{ value: "Daegu", label: "대구" },
	{ value: "Incheon", label: "인천" },
	{ value: "Gwangju", label: "광주" },
	{ value: "Daejeon", label: "대전" },
	{ value: "Ulsan", label: "울산" },
	{ value: "Sejong", label: "세종" },
	{ value: "Gyeonggi", label: "경기" },
	{ value: "Gangwon", label: "강원" },
];

export const MobileSettingsPage = () => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [gender, setGender] = useState("");
	const [country, setCountry] = useState("");
	const [region, setRegion] = useState("");
	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
	const { data: userMe } = useQuery(getUserMeQueryOption());
	const { mutate: updateUserProfile } = useUpdateUserProfileMutation();

	const {
		register,
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<MobileSettingsFormData>({
		resolver: zodResolver(MobileSettingsFormSchema),
	});

	useEffect(() => {
		if (userMe) {
			reset({
				email: userMe.email,
				name: userMe.name,
				phoneNumber: userMe.phoneNumber,
				gender: userMe.gender,
				country: userMe.country,
				region: userMe.region,
				birthYear: new Date(userMe.birthDate).getFullYear().toString(),
				birthMonth: (new Date(userMe.birthDate).getMonth() + 1).toString(),
				birthDay: new Date(userMe.birthDate).getDate().toString().slice(0, 2),
				isAgreedEmail: !!userMe.agreedEmailAt,
				stageName: userMe.stageName,
			});
		}
	}, [userMe]);
	const onSubmit = (data: MobileSettingsFormData) => {
		try {
			const { gender, country, region, isAgreedEmail, stageName } = data;

			// 선택적 필드들이 제공되었을 때만 업데이트에 포함
			const updateData: any = {
				name: data.name,
				phoneNumber: data.phoneNumber,
				isAgreedEmail: !!isAgreedEmail,
			};

			if (stageName) updateData.stageName = stageName;
			if (gender) updateData.gender = gender;
			if (country) updateData.country = country;
			if (region) updateData.region = region;

			// 생년월일이 모두 제공되었을 때만 포함
			if (data.birthYear && data.birthMonth && data.birthDay) {
				updateData.birthDate = new Date(`${data.birthYear}-${data.birthMonth}-${data.birthDay}`).toISOString();
			}

			updateUserProfile(updateData);
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const changePasswordModalClose = () => {
		setIsChangePasswordModalOpen(false);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col px-4 pb-6"
		>
			<MobileSettingsPageTitle title="Settings" />
			{!!userMe?.subscribedAt ? (
				<div className="mt-13px flex flex-col gap-2">
					<div className="flex flex-col font-bold text-12px leading-160%">
						<span>
							{userMe?.name} 님은, {userMe?.subscribe?.productType} 이용자입니다.
						</span>
						<span>
							다음 결제일은{" "}
							{userMe?.subscribe?.nextPaymentDate
								? new Date(userMe.subscribe.nextPaymentDate).toLocaleDateString()
								: "정보 없음"}
							입니다.
						</span>
					</div>
					<div className="flex gap-1">
						<button className="flex-1 h-22px rounded-30px bg-hbc-gray-100 font-extrabold text-10px leading-100%">
							요금제 변경하기
						</button>
						<button className="flex-1 h-22px rounded-30px bg-hbc-gray-100 font-extrabold text-10px leading-100%">
							결제수단 변경하기
						</button>
						<button className="flex-1 h-22px rounded-30px bg-hbc-red text-white font-extrabold text-10px leading-100% flex items-center justify-center gap-1">
							<span>ARTIST STUDIO</span>
							<div className="w-13px h-13px rounded-full bg-white flex items-center justify-center">
								<ArrowLeftShort
									width="9px"
									height="9px"
									fill="red"
								/>
							</div>
						</button>
					</div>
				</div>
			) : (
				<div className="mt-13px flex justify-between items-center">
					<span className="font-bold text-12px leading-160% tracking-[-0.02em]">
						{userMe?.name}님은, 구독중인 이용권이 없습니다.
					</span>
					<button className="h-20px px-10px font-black text-10px leading-100% bg-hbc-red rounded-20px text-white">
						요금제 구독하기
					</button>
				</div>
			)}
			<div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px">
					<span className="text-12px font-extrabold leading-160%">기본정보</span>
					<span className="text-12px font-extrabold leading-160%">General Information</span>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<span className="text-12px font-semibold leading-160%">이메일</span>
						<input
							className="border-b-1px border-black focus:outline-none font-[450] text-12px leading-100% pb-1 placeholder:text-hbc-gray-300"
							placeholder="HITBEATCLUB@GMAIL.COM"
							{...register("email")}
						/>
						{errors.email && <span className="text-hbc-red text-8px font-semibold">{errors.email.message}</span>}
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-12px font-semibold leading-160%">휴대전화</span>
						<input
							className="border-b-1px border-black focus:outline-none font-[450] text-12px leading-100% pb-1 placeholder:text-hbc-gray-300"
							placeholder="01012345678"
							type="tel"
							maxLength={11}
							{...register("phoneNumber", {
								onChange: (e) => {
									// 숫자만 허용
									const value = e.target.value.replace(/[^0-9]/g, "");
									e.target.value = value;
								},
							})}
						/>
						{errors.phoneNumber && (
							<span className="text-hbc-red text-8px font-semibold">{errors.phoneNumber.message}</span>
						)}
					</div>
					<div className="flex flex-col gap-10px">
						<div className="flex gap-3px">
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-semibold text-12px leading-160%">이름</span>
								<input
									className="w-full px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0"
									{...register("name")}
								/>
								{errors.name && <span className="text-hbc-red text-8px font-semibold">{errors.name.message}</span>}
							</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-semibold text-12px leading-160%">활동명</span>
								<input
									className="w-full px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0"
									{...register("stageName")}
								/>
								{errors.stageName && (
									<span className="text-hbc-red text-8px font-semibold">{errors.stageName.message}</span>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-12px leading-160%">생년월일</span>
							<div className="flex gap-5px">
								<input
									className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0"
									placeholder="YYYY"
									type="number"
									min="1900"
									max="2024"
									{...register("birthYear")}
								/>
								<input
									className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0"
									placeholder="MM"
									type="number"
									min="1"
									max="12"
									{...register("birthMonth")}
								/>
								<input
									className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0"
									placeholder="DD"
									type="number"
									min="1"
									max="31"
									{...register("birthDay")}
								/>
							</div>
							{(errors.birthYear || errors.birthMonth || errors.birthDay) && (
								<span className="text-hbc-red text-8px font-semibold">
									{errors.birthYear?.message || errors.birthMonth?.message || errors.birthDay?.message}
								</span>
							)}
						</div>

						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<MobileSettingsSelect
									label="성별"
									options={genderOptions}
									value={genderOptions.find((option) => option.value === field.value)?.label}
									onChange={field.onChange}
									className="w-178px"
								/>
							)}
						/>

						<div className="flex gap-1">
							<Controller
								name="country"
								control={control}
								render={({ field }) => (
									<MobileSettingsSelect
										label="국가"
										options={countryOptions}
										value={countryOptions.find((option) => option.value === field.value)?.label}
										onChange={field.onChange}
										className="flex-1"
									/>
								)}
							/>
							<Controller
								name="region"
								control={control}
								render={({ field }) => (
									<MobileSettingsSelect
										label="지역"
										options={regionOptions}
										value={regionOptions.find((option) => option.value === field.value)?.label}
										onChange={field.onChange}
										className="flex-1"
									/>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-14px flex justify-end">
				<button
					type="button"
					className="px-1 h-19px font-semibold text-12px leading-160% rounded-2px bg-[#dfdfdf]"
					onClick={() => setIsChangePasswordModalOpen(true)}
				>
					비밀번호 변경
				</button>
			</div>
			<Controller
				name="isAgreedEmail"
				control={control}
				render={({ field }) => (
					<div className="mt-3 flex gap-1 font-semibold text-12px leading-150%">
						<Checkbox
							id="marketing-consent"
							checked={!!field.value}
							onChange={field.onChange}
						/>
						<label
							htmlFor="marketing-consent"
							className="transform -translate-y-2px"
						>
							마케팅 목적을 위해 HITBEATCLUB의 콘텐츠 제공자에게 내 등록 데이터를 공유하겠습니다.
						</label>
					</div>
				)}
			/>
			{/* <div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px font-extrabold text-12px leading-160%">
					<span>디스플레이</span>
					<span>Display</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-12px leading-100%">다크모드</span>
					<Toggle mobile />
				</div>
			</div> */}
			<div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px font-extrabold text-12px leading-160%">
					<span>도움말</span>
					<span>Help</span>
				</div>
				<div className="flex flex-col gap-2 font-semibold text-12px leading-160%">
					<div className="flex gap-1 items-center">
						<span>고객 센터</span>
						<Outlink className="transform -translate-y-1px" />
					</div>
					<div className="flex gap-1 items-center">
						<span>회사 소개</span>
						<Outlink className="transform -translate-y-1px" />
					</div>
				</div>
				<div className="mt-4 flex justify-center">
					<button
						type="submit"
						className="bg-black h-27px px-15px flex items-center font-extrabold text-12px leading-100% rounded-30px text-white"
					>
						변경사항 저장
					</button>
				</div>
			</div>
			<MobileUserChangePasswordModal
				isOpen={isChangePasswordModalOpen}
				onClose={changePasswordModalClose}
			/>
		</form>
	);
};
