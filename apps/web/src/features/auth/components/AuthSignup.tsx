"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { Checkbox, Correct, EmptyCheckbox, HBCLoginMain, Incorrect } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { AuthSignupCompletionModal } from "./Modal/AuthSignupCompletionModal";
import { UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { z } from "zod";
import moment from "moment-timezone";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { useSocialJoinUserMutation as useCompleteSocialProfileMutation } from "@/apis/user/mutations/useSocialJoinUserMutation";
// Assuming useJoinUserMutation.ts exports a mutation for email sign up, aliasing for clarity
import { useSocialJoinUserMutation as useEmailSignupMutation } from "@/apis/auth/mutations/useJoinUserMutation";
import { signInOnSuccess } from "@/apis/auth/auth.utils"; // For email signup success handling
import { cn } from "@/common/utils";
import {
	COUNTRY_OPTIONS,
	GENDER_OPTIONS,
	generateYearOptions,
	MONTH_OPTIONS,
	DAY_OPTIONS,
	getRegionOptionsByCountry,
} from "../auth.constants";

// 폼 데이터 타입 정의
interface FormData {
	email: string;
	password?: string;
	passwordConfirm?: string;
	name: string;
	phoneNumber: string;
	gender?: "M" | "F";
	year: string;
	month: string;
	day: string;
	country?: string;
	region?: string;
	isAgreedTerms: boolean;
	isAgreedPrivacyPolicy: boolean;
	isAgreedEmail: boolean;
	musicType?: "BEAT" | "ACAPELLA";
}

// 폼 검증 스키마
const createFormSchema = (isSocialJoin: boolean) => {
	const baseSchema = z
		.object({
			name: z.string().min(1, "이름을 입력해주세요."),
			phoneNumber: z.string().min(10, "유효한 연락처를 입력해주세요. (예: 01012345678)").max(11),
			gender: z.enum(["M", "F"], { errorMap: () => ({ message: "성별을 선택해주세요." }) }).optional(),
			year: z.string().length(4, "태어난 년도 4자리를 정확히 입력해주세요."),
			month: z.string().min(1, "태어난 월을 선택해주세요.").max(2),
			day: z.string().min(1, "태어난 일을 선택해주세요.").max(2),
			country: z.string().optional(),
			region: z.string().optional(),
			isAgreedTerms: z.boolean().refine((val) => val === true, {
				message: "서비스 이용약관에 동의해주세요.",
			}),
			isAgreedPrivacyPolicy: z.boolean().refine((val) => val === true, {
				message: "개인정보처리방침에 동의해주세요.",
			}),
			isAgreedEmail: z.boolean().optional(),
			musicType: z.enum(["BEAT", "ACAPELLA"]).optional(),
		})
		.refine(
			(data) => {
				if (!isSocialJoin && "password" in data && "passwordConfirm" in data && data.password && data.passwordConfirm) {
					return data.password === data.passwordConfirm;
				}
				return true;
			},
			{
				message: "비밀번호가 일치하지 않습니다.",
				path: ["passwordConfirm"],
			},
		)
		.superRefine((data, ctx) => {
			if (data.year && data.month && data.day) {
				const dateStr = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;
				const parsedDate = moment.tz(dateStr, "YYYY-MM-DD", true, "Asia/Seoul");
				if (!parsedDate.isValid()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "유효하지 않은 생년월일입니다.",
						path: ["year"],
					});
				}
			}
		});

	if (!isSocialJoin) {
		const extendedSchema = z.object({
			email: z.string().email("유효한 이메일 주소를 입력해주세요."),
			password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다.").max(255),
			passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해주세요.").max(255),
		});
		return baseSchema.pipe(extendedSchema);
	}

	return baseSchema;
};

export const AuthSignup = () => {
	const { user: authUser } = useAuthStore(useShallow((state) => ({ user: state.user })));
	console.log("authUser", authUser);

	// AuthLoginResponse에는 phoneNumber가 null일 때 소셜 가입 완료 단계로 판단
	const isSocialJoin = !!authUser?.userId && authUser?.phoneNumber === null;

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
	const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

	const completeSocialProfileMutation = useCompleteSocialProfileMutation();
	const emailSignupMutation = useEmailSignupMutation();

	const onSubmit = useCallback(
		(value: FormData) => {
			const { year, month, day, ...restOfForm } = value;

			const birthDateISO = moment
				.tz(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`, "YYYY-MM-DD", "Asia/Seoul")
				.utc()
				.toISOString();

			const payload: Partial<UserUpdatePayload> = {
				...restOfForm,
				birthDate: birthDateISO,
				isAgreedTerms: value.isAgreedTerms ? 1 : undefined,
				isAgreedPrivacyPolicy: value.isAgreedPrivacyPolicy ? 1 : undefined,
				isAgreedEmail: value.isAgreedEmail ? 1 : 0,
			};

			if (isSocialJoin && authUser?.userId) {
				// 소셜 가입 완료 - 비밀번호 제거
				delete payload.password;
				const newPayload = {
					...payload,
					email: authUser?.email,
				};
				console.log("newPayload", newPayload);
				completeSocialProfileMutation.mutate(newPayload as UserUpdatePayload, {
					onSuccess: () => {
						setIsPopupOpen(true);
					},
					onError: (error: unknown) => {
						console.error("Social profile completion error:", error);
						// TODO: 에러 처리
					},
				});
			} else {
				// 이메일 회원가입
				emailSignupMutation.mutate(payload as UserUpdatePayload, {
					onSuccess: (response) => {
						signInOnSuccess(response.data, "email");
					},
					onError: (error: unknown) => {
						console.error("Email signup error:", error);
						// TODO: 에러 처리
					},
				});
			}
		},
		[authUser, completeSocialProfileMutation, emailSignupMutation, isSocialJoin],
	);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			passwordConfirm: "",
			name: "",
			phoneNumber: "",
			gender: undefined,
			year: "",
			month: "",
			day: "",
			country: "KR", // 기본값
			region: undefined,
			isAgreedTerms: false,
			isAgreedPrivacyPolicy: false,
			isAgreedEmail: false,
			musicType: undefined,
		} as FormData,
		validators: {
			// @ts-expect-error due to zod
			onSubmit: createFormSchema(isSocialJoin),
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	const { password, passwordConfirm, country } = useStore(form.store, (state) => {
		return {
			password: state.values.password,
			passwordConfirm: state.values.passwordConfirm,
			country: state.values.country,
		};
	});

	const { error } = useStore(form.store, (state) => {
		return {
			error: state.errors,
		};
	});
	useEffect(() => {
		console.log("error", error);
	}, [error]);

	// 비밀번호 확인 체크
	useEffect(() => {
		if (!isSocialJoin && password && passwordConfirm) {
			setPasswordsMatch(password === passwordConfirm);
		} else if (!isSocialJoin && (password || passwordConfirm)) {
			setPasswordsMatch(false);
		} else {
			setPasswordsMatch(null);
		}
	}, [form, password, passwordConfirm, isSocialJoin]);

	// 국가 변경 시 지역 리셋
	useEffect(() => {
		if (country) {
			form.setFieldValue("region", undefined);
		}
	}, [country, form]);

	const onAllAgreements = () => {
		const allCurrentlyChecked =
			form.getFieldValue("isAgreedTerms") &&
			form.getFieldValue("isAgreedPrivacyPolicy") &&
			form.getFieldValue("isAgreedEmail");

		const newAgreementValue = !allCurrentlyChecked;
		form.setFieldValue("isAgreedTerms", newAgreementValue);
		form.setFieldValue("isAgreedPrivacyPolicy", newAgreementValue);
		form.setFieldValue("isAgreedEmail", newAgreementValue);
	};

	// 전체 동의 체크박스 상태
	const allAgreementsChecked =
		form.getFieldValue("isAgreedTerms") &&
		form.getFieldValue("isAgreedPrivacyPolicy") &&
		form.getFieldValue("isAgreedEmail");

	// 현재 선택된 국가에 따른 지역 옵션
	const regionOptions = country ? getRegionOptionsByCountry(country) : [];

	// 옵션들
	const yearOptions = generateYearOptions();

	return (
		<>
			<div className="w-[466px] h-full m-auto py-20">
				<div className="flex flex-col items-center justify-center">
					<div className="mb-9">
						<HBCLoginMain className="w-[240px] h-[89px]" />
					</div>
					<div className="text-2xl font-extrabold mb-9">{isSocialJoin ? "추가 정보 입력" : "이메일 회원가입"}</div>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					{/* 이메일 필드 */}
					<form.Field name="email">
						{(field) => (
							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor={field.name}
										className="relative mb-1 font-semibold"
									>
										이메일 주소 <span className="absolute text-red-500 -top-2 -right-2">*</span>
									</label>
									{emailAvailable === true && (
										<div className="flex items-center gap-1 text-sm text-[#3884FF] font-semibold">
											<Correct /> 사용할 수 있는 이메일입니다.
										</div>
									)}
									{emailAvailable === false && (
										<div className="flex items-center gap-1 text-sm font-semibold text-hbc-red">
											<Incorrect /> 사용할 수 없는 이메일입니다.
										</div>
									)}
								</div>
								<div className="relative">
									{isSocialJoin && (
										<div className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer left-1 top-1/2">
											{authUser?.email}
										</div>
									)}
									<input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="email"
										required
										readOnly={isSocialJoin}
										className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
									/>
									{!isSocialJoin && (
										<button
											type="button"
											className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer right-2 top-1/2 text-hbc-blue"
										>
											중복 확인
										</button>
									)}
								</div>
								{field.state.meta.errors && (
									<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
								)}
							</div>
						)}
					</form.Field>

					{/* 비밀번호 필드 (소셜 가입이 아닐 때만) */}
					{!isSocialJoin && (
						<>
							<form.Field name="password">
								{(field) => (
									<div>
										<label
											htmlFor={field.name}
											className="relative mb-1 font-semibold"
										>
											비밀번호 <span className="absolute text-red-500 -top-2 -right-2">*</span>
										</label>
										<input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="password"
											required
											className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
										/>
										{field.state.meta.errors && (
											<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</div>
								)}
							</form.Field>
							<form.Field name="passwordConfirm">
								{(field) => (
									<div>
										<div className="flex justify-between">
											<label
												htmlFor={field.name}
												className="relative mb-1 font-semibold"
											>
												비밀번호 확인 <span className="absolute text-red-500 -top-2 -right-2">*</span>
											</label>
											{passwordsMatch === true && (
												<div className="flex items-center gap-1 text-sm text-[#3884FF] font-semibold">
													<Correct /> 비밀번호가 같습니다.
												</div>
											)}
											{passwordsMatch === false && form.getFieldValue("passwordConfirm") && (
												<div className="flex items-center gap-1 text-sm font-semibold text-hbc-red">
													<Incorrect /> 비밀번호가 같지 않습니다.
												</div>
											)}
										</div>
										<input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="password"
											required
											className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
										/>
										{field.state.meta.errors && (
											<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</div>
								)}
							</form.Field>
						</>
					)}

					{/* 이름 필드 */}
					<form.Field name="name">
						{(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="relative mb-1 font-semibold"
								>
									이름 <span className="absolute text-red-500 -top-2 -right-2">*</span>
								</label>
								<input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="text"
									required
									className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
								/>
								{field.state.meta.errors && (
									<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
								)}
							</div>
						)}
					</form.Field>

					<div className="flex gap-4">
						{/* 연락처 필드 */}
						<form.Field name="phoneNumber">
							{(field) => (
								<div className="w-1/2">
									<label
										htmlFor={field.name}
										className="relative mb-1 font-semibold"
									>
										연락처 <span className="absolute text-red-500 -top-2 -right-2">*</span>
									</label>
									<div className="relative">
										<input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="tel"
											required
											className="w-full px-3 py-[5px] pr-20 border border-hbc-black rounded-md focus:outline-none"
										/>
										<button
											type="button"
											className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer right-2 top-1/2 text-hbc-blue"
										>
											인증
										</button>
									</div>
									{field.state.meta.errors && (
										<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
									)}
								</div>
							)}
						</form.Field>

						{/* 성별 필드 */}
						<form.Field name="gender">
							{(field) => (
								<div className="w-1/2">
									<label className="mb-1 font-semibold">성별</label>
									<Dropdown
										className="w-full"
										optionsClassName="max-h-240px"
										options={GENDER_OPTIONS}
										value={field.state.value}
										onChange={(val) => field.handleChange(val as "M" | "F")}
										placeholder="성별을 선택하세요"
									/>
									{field.state.meta.errors && (
										<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
									)}
								</div>
							)}
						</form.Field>
					</div>

					{/* 생년월일 필드 */}
					<div>
						<label className="relative mb-1 font-semibold">
							생년월일 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<div className="flex justify-between w-full">
							<form.Field name="year">
								{(field) => (
									<div className="flex flex-col items-start">
										<div className="flex items-center justify-center gap-1">
											<Dropdown
												className="w-140px"
												optionsClassName="max-h-240px"
												options={yearOptions}
												value={field.state.value}
												onChange={(val) => field.handleChange(val)}
												placeholder="년"
											/>
											<span>년</span>
										</div>
										{field.state.meta.errors && (
											<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</div>
								)}
							</form.Field>
							<form.Field name="month">
								{(field) => (
									<div className="flex flex-col items-start">
										<div className="flex items-center justify-center gap-1">
											<Dropdown
												className="w-100px"
												optionsClassName="max-h-240px"
												options={MONTH_OPTIONS}
												value={field.state.value}
												onChange={(val) => field.handleChange(val)}
												placeholder="월"
											/>
											<span>월</span>
										</div>
										{field.state.meta.errors && (
											<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</div>
								)}
							</form.Field>
							<form.Field name="day">
								{(field) => (
									<div className="flex flex-col items-start">
										<div className="flex items-center justify-center gap-1">
											<Dropdown
												className="w-100px"
												optionsClassName="max-h-240px"
												options={DAY_OPTIONS}
												value={field.state.value}
												onChange={(val) => field.handleChange(val)}
												placeholder="일"
											/>
											<span>일</span>
										</div>
										{field.state.meta.errors && (
											<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</div>
								)}
							</form.Field>
						</div>
					</div>

					{/* 국가 및 지역 필드 */}
					<div className="flex gap-4">
						<form.Field name="country">
							{(field) => (
								<div className="w-1/2">
									<label className="block mb-1 font-semibold">국가</label>
									<Dropdown
										className="w-full"
										optionsClassName="max-h-240px"
										options={COUNTRY_OPTIONS}
										value={field.state.value}
										onChange={(val) => field.handleChange(val)}
										placeholder="국가를 선택하세요"
									/>
									{field.state.meta.errors && (
										<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
									)}
								</div>
							)}
						</form.Field>
						<form.Field name="region">
							{(field) => (
								<div className="w-1/2">
									<label className="block mb-1 font-semibold">지역</label>
									<Dropdown
										className="w-full"
										optionsClassName="max-h-240px"
										options={regionOptions}
										value={field.state.value}
										onChange={(val) => field.handleChange(val)}
										placeholder="지역을 선택하세요"
									/>
									{field.state.meta.errors && (
										<div className="mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
									)}
								</div>
							)}
						</form.Field>
					</div>

					<div className="w-full h-[1px] bg-hbc-black my-8"></div>
					<div className="text-center">어떤 서비스를 선호하시나요?</div>
					<form.Field name="musicType">
						{(field) => (
							<div className="flex gap-4">
								<Button
									type="button"
									className={cn("w-full text-lg py-2 font-suisse")}
									variant={field.state.value === "ACAPELLA" ? "fill" : "outline"}
									rounded="full"
									onClick={() => field.handleChange("ACAPELLA")}
								>
									ACAPPELLA
								</Button>
								<Button
									type="button"
									className={cn("w-full text-lg py-2 font-suisse")}
									variant={field.state.value === "BEAT" ? "fill" : "outline"}
									rounded="full"
									onClick={() => field.handleChange("BEAT")}
								>
									BEAT
								</Button>
							</div>
						)}
					</form.Field>

					<div className="w-full h-[1px] bg-hbc-black my-8"></div>

					{/* 약관 동의 */}
					<div className="space-y-4">
						<div
							className="inline-flex items-center gap-2 cursor-pointer"
							onClick={onAllAgreements}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => e.key === "Enter" && onAllAgreements()}
						>
							{allAgreementsChecked ? <Checkbox /> : <EmptyCheckbox />}
							<span className="font-bold">약관에 모두 동의합니다.</span>
						</div>

						<div className="pl-4 space-y-2">
							<form.Field name="isAgreedTerms">
								{(field) => (
									<>
										<div
											className="inline-flex items-center gap-2 cursor-pointer"
											onClick={() => field.handleChange(!field.state.value)}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => e.key === "Enter" && field.handleChange(!field.state.value)}
										>
											{field.state.value ? <Checkbox /> : <EmptyCheckbox />}
											<span>
												[필수] 히트비트클럽 <span className="underline">서비스 이용약관</span>에 동의합니다.
											</span>
										</div>
										{field.state.meta.errors && (
											<div className="block mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</>
								)}
							</form.Field>
							<form.Field name="isAgreedPrivacyPolicy">
								{(field) => (
									<>
										<div
											className="inline-flex items-center gap-2 cursor-pointer"
											onClick={() => field.handleChange(!field.state.value)}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => e.key === "Enter" && field.handleChange(!field.state.value)}
										>
											{field.state.value ? <Checkbox /> : <EmptyCheckbox />}
											<span>
												[필수] 히트비트클럽 <span className="underline">개인정보처리방침</span>에 동의합니다.
											</span>
										</div>
										{field.state.meta.errors && (
											<div className="block mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</>
								)}
							</form.Field>
							<form.Field name="isAgreedEmail">
								{(field) => (
									<>
										<div
											className="inline-flex items-center gap-2 cursor-pointer"
											onClick={() => field.handleChange(!field.state.value)}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => e.key === "Enter" && field.handleChange(!field.state.value)}
										>
											{field.state.value ? <Checkbox /> : <EmptyCheckbox />}
											<span>이메일 수신에 동의합니다. (선택)</span>
										</div>
										{field.state.meta.errors && (
											<div className="block mt-1 text-sm text-hbc-red">{field.state.meta.errors.join(", ")}</div>
										)}
									</>
								)}
							</form.Field>
						</div>
					</div>

					<div className="flex justify-center gap-4 pt-8">
						<Button
							size="lg"
							variant="outline"
							className="w-full py-2.5 font-extrabold"
							type="button"
							onClick={() => {
								// TODO: 취소 로직 구현
								console.log("Cancel clicked");
							}}
						>
							취소
						</Button>
						<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
							{([canSubmit, isSubmitting]) => (
								<Button
									size="lg"
									className="w-full py-2.5 font-extrabold"
									type="submit"
									disabled={!canSubmit || isSubmitting}
								>
									{isSubmitting ? "처리 중..." : "완료"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</div>

			<AuthSignupCompletionModal
				isPopupOpen={isPopupOpen}
				onClosePopup={() => {
					setIsPopupOpen(false);
					if (isSocialJoin) {
						window.location.href = "/";
					}
				}}
			/>
		</>
	);
};
