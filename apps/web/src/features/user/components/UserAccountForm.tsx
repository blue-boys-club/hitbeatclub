"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Dropdown, Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { UserProfileUpdatePayload } from "@hitbeatclub/shared-types/user";
import { useUpdateUserProfileMutation } from "@/apis/user/mutations/useUpdateUserProfileMutation";
import UserChangePasswordModal from "./modal/UserChangePasswordModal";
import UserDeleteAccountModal from "./modal/UserDeleteAccountModal";
import UserDeleteCompleteModal from "./modal/UserDeleteCompleteModal";
import UserCancelMembershipModal from "./modal/UserCancelMembershipModal";
import { COUNTRY_OPTIONS, CountryCode, getRegionOptionsByCountry } from "@hitbeatclub/country-options";
import { GENDER_OPTIONS } from "@/features/auth/auth.constants";

// 폼 스키마 정의 (이메일 제외)
const userAccountFormSchema = z.object({
	name: z.string().min(1, "이름을 입력해주세요"),
	phoneNumber: z
		.string()
		.min(1, "휴대전화 번호를 입력해주세요")
		.regex(/^010\d{8}$/, "올바른 휴대전화 번호를 입력해주세요"),
	birthDate: z.string().min(1, "생년월일을 입력해주세요"),
	gender: z.enum(["M", "F"]),
	country: z.string().min(1, "국가를 선택해주세요"),
	region: z.string().min(1, "지역을 선택해주세요"),
	stageName: z.string().optional(),
});

type UserAccountFormData = z.infer<typeof userAccountFormSchema>;

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
	label: `${(i + 1).toString().padStart(2, "0")}월`,
	value: `${(i + 1).toString().padStart(2, "0")}`,
}));

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
	label: `${(i + 1).toString().padStart(2, "0")}일`,
	value: `${(i + 1).toString().padStart(2, "0")}`,
}));

const generateYearOptions = () => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = currentYear; i >= currentYear - 100; i--) {
		years.push({ label: `${i.toString()}년`, value: i.toString() });
	}
	return years;
};

const UserAccountForm = memo(() => {
	const router = useRouter();
	const { data: user, isLoading } = useQuery(getUserMeQueryOption());

	const isMembership = useMemo(() => {
		return !!user?.subscribedAt;
	}, [user?.subscribedAt]);

	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
	const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
	const [isDeleteCompleteModalOpen, setIsDeleteCompleteModalOpen] = useState(false);
	const [isCancelMembershipModalOpen, setIsCancelMembershipModalOpen] = useState(false);
	const { toast } = useToast();

	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedDay, setSelectedDay] = useState<string>("");

	const updateUserProfileMutation = useUpdateUserProfileMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty, isValid },
		reset,
		setValue,
		watch,
	} = useForm<UserAccountFormData>({
		resolver: zodResolver(userAccountFormSchema),
		defaultValues: {
			name: "",
			phoneNumber: "",
			birthDate: "",
			gender: "M",
			country: "KR",
			region: "",
			stageName: "",
		},
	});

	//폼 초기화
	useEffect(() => {
		if (user) {
			const birthDate = user.birthDate ? new Date(user.birthDate) : null;
			const birthYear = birthDate ? birthDate.getUTCFullYear().toString() : "";
			const birthMonth = birthDate ? (birthDate.getUTCMonth() + 1).toString().padStart(2, "0") : "";
			const birthDay = birthDate ? birthDate.getUTCDate().toString().padStart(2, "0") : "";

			setSelectedYear(birthYear);
			setSelectedMonth(birthMonth);
			setSelectedDay(birthDay);

			reset({
				name: user.name || "",
				phoneNumber: user.phoneNumber || "",
				birthDate: user.birthDate || "",
				gender: user.gender || "M",
				country: user.country || "KR",
				region: user.region || "",
				stageName: (user as any).stageName || "",
			});
		}
	}, [user, reset]);

	//생년월일 선택 시 폼 값 변경
	useEffect(() => {
		if (user && selectedYear && selectedMonth && selectedDay) {
			const year = parseInt(selectedYear, 10);
			const month = parseInt(selectedMonth, 10) - 1;
			const day = parseInt(selectedDay, 10);
			const newBirthDate = new Date(Date.UTC(year, month, day)).toISOString();

			// 초기 로드 시 불필요한 dirty 상태 변경을 막기 위해 기존 값과 비교
			if (newBirthDate !== user.birthDate) {
				setValue("birthDate", newBirthDate, { shouldDirty: true });
			} else {
				setValue("birthDate", newBirthDate, { shouldDirty: false });
			}
		}
	}, [selectedYear, selectedMonth, selectedDay, setValue, user]);

	// 생년월일 옵션 생성
	const yearOptions = useMemo(() => generateYearOptions(), []);
	const monthOptions = useMemo(() => MONTH_OPTIONS, []);
	const dayOptions = useMemo(() => DAY_OPTIONS, []);
	const genderOptions = useMemo(() => GENDER_OPTIONS, []);

	const country = watch("country");

	const regionOptions = useMemo(() => {
		return country ? getRegionOptionsByCountry(country as CountryCode) : [];
	}, [country]);

	const openChangePasswordModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setIsChangePasswordModalOpen(true);
	};

	const changePasswordModalClose = () => {
		setIsChangePasswordModalOpen(false);
	};

	const openDeleteAccountModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setIsDeleteAccountModalOpen(true);
	};

	const deleteAccountModalClose = () => {
		setIsDeleteAccountModalOpen(false);
	};

	const openDeleteCompleteModal = () => {
		setIsDeleteCompleteModalOpen(true);
	};

	const deleteCompleteModalClose = () => {
		setIsDeleteCompleteModalOpen(false);
		router.push("/auth/login");
	};

	const openCancelMembershipModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setIsCancelMembershipModalOpen(true);
	};

	const cancelMembershipModalClose = () => {
		setIsCancelMembershipModalOpen(false);
	};

	// 폼 제출 핸들러
	const onSubmit = async (data: UserAccountFormData) => {
		try {
			const profileData = {
				name: data.name,
				phoneNumber: data.phoneNumber,
				birthDate: data.birthDate,
				gender: data.gender,
				country: data.country,
				region: data.region,
				stageName: data.stageName || undefined,
			} as UserProfileUpdatePayload;

			await updateUserProfileMutation.mutateAsync(profileData);

			toast({
				description: "변경사항이 저장되었습니다.",
				duration: 3000,
			});
		} catch (error) {
			console.error("Profile update error:", error);
			toast({
				description: "변경사항 저장에 실패했습니다.",
				variant: "destructive",
				duration: 3000,
			});
		}
	};

	if (isLoading) {
		return <div>로딩 중...</div>;
	}

	return (
		<>
			<section className="pt-10 px-[106px] pb-5">
				<div className="flex flex-col gap-3">
					<div className="text-black font-extrabold text-base leading-[160%] tracking-[-0.32px]">
						기본정보 General Information
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">이메일</label>
							<Input
								className="placeholder:text-xs py-0 px-0 text-xs bg-gray-100"
								value={user?.email || ""}
								variant="square"
								disabled
								readOnly
							/>
							<span className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</span>
						</div>

						<div className="flex flex-col">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">휴대전화</label>
							<Input
								className="placeholder:text-xs py-0 px-0 text-xs"
								placeholder="휴대전화"
								variant="square"
								type="tel"
								maxLength={11}
								value={watch("phoneNumber")}
								onChange={(e) => {
									// 숫자만 허용
									const value = e.target.value.replace(/[^0-9]/g, "");
									setValue("phoneNumber", value, { shouldValidate: true });
								}}
							/>
							{errors.phoneNumber && <span className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</span>}
						</div>

						<div className="grid grid-cols-2 gap-x-5">
							<div className="flex flex-col">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">이름</label>
								<Input
									{...register("name")}
									className="placeholder:text-xs py-0 px-0 text-xs"
									placeholder="이름"
									variant="square"
								/>
								{errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
							</div>
							<div className="flex flex-col">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">활동명</label>
								<Input
									{...register("stageName")}
									className="placeholder:text-xs py-0 px-0 text-xs"
									placeholder="활동명"
									variant="square"
								/>
								{errors.stageName && <span className="text-xs text-red-500 mt-1">{errors.stageName.message}</span>}
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">생년월일</label>
							<div className="grid grid-cols-3 gap-x-5">
								<Dropdown
									size="sm"
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={yearOptions}
									placeholder="연도"
									value={selectedYear}
									onChange={(value: string) => setSelectedYear(value)}
								/>
								<Dropdown
									size="sm"
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={monthOptions}
									placeholder="월"
									value={selectedMonth}
									onChange={(value: string) => setSelectedMonth(value)}
								/>
								<Dropdown
									size="sm"
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={dayOptions}
									placeholder="일"
									value={selectedDay}
									onChange={(value: string) => setSelectedDay(value)}
								/>
							</div>
							{errors.birthDate && <span className="text-xs text-red-500 mt-1">{errors.birthDate.message}</span>}
						</div>

						<div className="grid grid-cols-3 gap-x-5">
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">성별</label>
								<Dropdown
									size="sm"
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={genderOptions}
									placeholder="성별"
									value={watch("gender")}
									onChange={(value: string) => setValue("gender", value as "M" | "F")}
								/>
								{errors.gender && <span className="text-xs text-red-500 mt-1">{errors.gender.message}</span>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">국가</label>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={COUNTRY_OPTIONS}
									placeholder="국가"
									size="sm"
									value={watch("country")}
									onChange={(value: string) => setValue("country", value)}
								/>
								{errors.country && <span className="text-xs text-red-500 mt-1">{errors.country.message}</span>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">지역</label>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={regionOptions}
									placeholder="지역"
									size="sm"
									value={watch("region")}
									onChange={(value: string) => setValue("region", value)}
								/>
								{errors.region && <span className="text-xs text-red-500 mt-1">{errors.region.message}</span>}
							</div>
						</div>

						<div className="flex justify-between pb-4 border-b-1 border-black">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">비밀번호 변경</label>
							<button
								type="button"
								onClick={openChangePasswordModal}
								className="text-[#001EFF] font-[600] text-[12px] leading-[12px] tracking-[0.12px] font-['SUIT Variable'] cursor-pointer"
							>
								비밀번호 변경
							</button>
						</div>

						{/* <div className="flex flex-col gap-3 pb-4 border-b-1 border-black">
							<div className="flex gap-1">
								<span className="text-black font-extrabold text-base leading-[160%] tracking-[-0.32px] font-[SUIT]">
									디스플레이
								</span>
								<span className="text-black font-semibold text-base leading-[160%] tracking-[-0.32px] font-['Suisse_Intl']">
									Display
								</span>
							</div>
							<div className="flex justify-between">
								<div className="text-black font-semibold text-xs leading-none tracking-[0.12px] font-['SUIT_Variable']">
									다크모드
								</div>
								<Toggle onChange={toggleDarkMode} />
							</div>
						</div> */}

						<div className="flex flex-col gap-3 pb-4 border-b-1 border-black">
							<div className="flex gap-1">
								<span className="text-black font-extrabold text-base leading-[160%] tracking-[-0.32px] font-[SUIT]">
									도움말
								</span>
								<span className="text-black font-semibold text-base leading-[160%] tracking-[-0.32px] font-['Suisse_Intl']">
									Help
								</span>
							</div>
							<div className="flex justify-between">
								<div className="flex gap-[10px]">
									<div className="text-black font-semibold text-xs leading-none tracking-[0.12px] font-['SUIT_Variable']">
										도움이 필요하신가요?
									</div>
									<Link
										href={"/support"}
										className="text-[#FF1900] font-semibold text-xs leading-none tracking-[0.12px] font-['SUIT_Variable'] cursor-pointer"
									>
										고객센터 바로가기
									</Link>
								</div>
							</div>
							<div className="flex justify-between">
								<div className="flex gap-[10px]">
									<div className="text-black font-semibold text-xs leading-none tracking-[0.12px] font-['SUIT_Variable']">
										히트비트클럽에 대해 궁금하신가요?
									</div>
									<Link
										href={"/"}
										className="text-[#FF1900] font-semibold text-xs leading-none tracking-[0.12px] font-['SUIT_Variable'] cursor-pointer"
									>
										회사 소개 바로가기
									</Link>
								</div>
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								onClick={isMembership ? openCancelMembershipModal : openDeleteAccountModal}
								className="text-[#87878A] font-semibold text-[12px] leading-[100%] tracking-[0.12px] font-['SUIT_Variable'] pb-[3px] border-b-1 border-[#87878A] cursor-pointer"
							>
								회원 탈퇴하기
							</button>
						</div>

						<div className="pt-[30px] flex justify-center">
							<Button
								type="submit"
								disabled={isSubmitting || !isDirty || !isValid || updateUserProfileMutation.isPending}
								size={"sm"}
								rounded={"full"}
								className="text-white font-black text-[12px] leading-[100%] tracking-[0.12px] font-['SUIT_Variable'] disabled:opacity-50"
							>
								{isSubmitting || updateUserProfileMutation.isPending ? "저장 중..." : "변경사항 저장"}
							</Button>
						</div>
					</form>
				</div>
			</section>

			{/* 멤버십 해지 모달 */}
			<UserCancelMembershipModal
				isModalOpen={isCancelMembershipModalOpen}
				onClose={cancelMembershipModalClose}
				userId={user?.id || 0}
			/>
			{/* 비밀번호 변경 모달 */}
			<UserChangePasswordModal
				isModalOpen={isChangePasswordModalOpen}
				onClose={changePasswordModalClose}
			/>
			{/* 회원 탈퇴 모달 */}
			<UserDeleteAccountModal
				isModalOpen={isDeleteAccountModalOpen}
				onClose={deleteAccountModalClose}
				onOpen={openDeleteCompleteModal}
			/>
			{/* 회원 탈퇴 완료 모달 */}
			<UserDeleteCompleteModal
				isModalOpen={isDeleteCompleteModalOpen}
				onClose={deleteCompleteModalClose}
			/>
		</>
	);
});

UserAccountForm.displayName = "UserAccountForm";
export default UserAccountForm;
