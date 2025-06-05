"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Correct, EmptyCheckbox, HBCLoginMain, Incorrect } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { AuthSignupCompletionModal } from "./Modal/AuthSignupCompletionModal";
import { UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { set, z } from "zod";
import moment from "moment-timezone";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { useSocialJoinUserMutation as useCompleteSocialProfileMutation } from "@/apis/user/mutations/useSocialJoinUserMutation";
// Assuming useJoinUserMutation.ts exports a mutation for email sign up, aliasing for clarity
import { useSocialJoinUserMutation as useEmailSignupMutation } from "@/apis/auth/mutations/useJoinUserMutation";
import { useCheckEmailMutation } from "@/apis/auth/mutations/useCheckEmailMutation";
import { signInOnSuccess } from "@/apis/auth/auth.utils"; // For email signup success handling
import { cn } from "@/common/utils";
import { GENDER_OPTIONS, generateYearOptions, MONTH_OPTIONS, DAY_OPTIONS } from "../auth.constants";
import { COUNTRY_OPTIONS, getRegionOptionsByCountry, CountryCode } from "@/features/common/common.constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

// 폼 데이터 타입 정의
interface FormData {
	email?: string;
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
	isAgreedEmail?: boolean;
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
		const extendedSchema = z
			.object({
				email: z.string().email("유효한 이메일 주소를 입력해주세요."),
				password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다.").max(255),
				passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해주세요.").max(255),
			})
			.refine(
				(data) => {
					if (
						!isSocialJoin &&
						"password" in data &&
						"passwordConfirm" in data &&
						data.password &&
						data.passwordConfirm
					) {
						return data.password === data.passwordConfirm;
					}
					return true;
				},
				{
					message: "비밀번호가 일치하지 않습니다.",
					path: ["passwordConfirm"],
				},
			);
		return extendedSchema.and(baseSchema);
	}

	return baseSchema;
};

export const AuthSignup = () => {
	const {
		user: authUser,
		setPhoneNumber,
		makeLogout,
	} = useAuthStore(
		useShallow((state) => ({ user: state.user, setPhoneNumber: state.setPhoneNumber, makeLogout: state.makeLogout })),
	);
	const router = useRouter();
	const queryClient = useQueryClient();

	// AuthLoginResponse에는 phoneNumber가 null일 때 소셜 가입 완료 단계로 판단
	const isSocialJoin = !!authUser?.userId && authUser?.phoneNumber === null;

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
	const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [lastVerifiedEmail, setLastVerifiedEmail] = useState<string>("");

	const completeSocialProfileMutation = useCompleteSocialProfileMutation();
	const emailSignupMutation = useEmailSignupMutation();
	const checkEmailMutation = useCheckEmailMutation();

	const form = useForm<FormData>({
		resolver: zodResolver(createFormSchema(isSocialJoin)),
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
		},
		mode: "onSubmit",
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = form;

	// Watch specific fields for real-time updates
	const password = watch("password");
	const passwordConfirm = watch("passwordConfirm");
	const country = watch("country");
	const email = watch("email");
	const isAgreedTerms = watch("isAgreedTerms");
	const isAgreedPrivacyPolicy = watch("isAgreedPrivacyPolicy");
	const isAgreedEmail = watch("isAgreedEmail");

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
						setPhoneNumber(authUser?.phoneNumber || "");
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
						signInOnSuccess(response.data, "email", false);
						setIsPopupOpen(true);
					},
					onError: (error: unknown) => {
						console.error("Email signup error:", error);
						// TODO: 에러 처리
					},
				});
			}
		},
		[authUser, completeSocialProfileMutation, emailSignupMutation, isSocialJoin, setPhoneNumber],
	);

	const onFormSubmit = handleSubmit((data) => {
		// 일반 가입의 경우 이메일 인증 확인
		if (!isSocialJoin) {
			const currentEmail = data.email;
			if (!isEmailVerified || lastVerifiedEmail !== currentEmail) {
				alert("이메일 중복 확인을 먼저 진행해주세요.");
				return;
			}
		}
		onSubmit(data as FormData);
	});

	// 이메일 중복 확인 함수
	const handleEmailVerification = useCallback(() => {
		if (!email || !email.includes("@")) {
			setEmailAvailable(false);
			return;
		}
		console.log("currentEmail", email);

		checkEmailMutation.mutateAsync(
			{ email },
			{
				onSuccess: (response) => {
					// success: true면 사용 가능, false면 이미 존재
					const isAvailable = response.data.success === true;
					setEmailAvailable(isAvailable);
					if (isAvailable) {
						setIsEmailVerified(true);
						setLastVerifiedEmail(email);
					} else {
						setIsEmailVerified(false);
						setLastVerifiedEmail("");
					}
				},
				onError: (error) => {
					console.error("Email verification error:", error);
					setEmailAvailable(false);
					setIsEmailVerified(false);
					setLastVerifiedEmail("");
				},
			},
		);
	}, [checkEmailMutation, email]);

	// 비밀번호 확인 체크
	useEffect(() => {
		if (!isSocialJoin && password && passwordConfirm) {
			setPasswordsMatch(password === passwordConfirm);
		} else if (!isSocialJoin && (password || passwordConfirm)) {
			setPasswordsMatch(false);
		} else {
			setPasswordsMatch(null);
		}
	}, [password, passwordConfirm, isSocialJoin]);

	// 국가 변경 시 지역 리셋
	useEffect(() => {
		if (country) {
			setValue("region", undefined);
		}
	}, [country, setValue]);

	// 이메일 변경 시 인증 상태 리셋
	useEffect(() => {
		if (!isSocialJoin && email !== lastVerifiedEmail) {
			setIsEmailVerified(false);
			setEmailAvailable(null);
		}
	}, [email, lastVerifiedEmail, isSocialJoin]);

	// 소셜 가입일 때 이메일 인증 자동 완료
	useEffect(() => {
		if (isSocialJoin && authUser?.email) {
			setIsEmailVerified(true);
			setEmailAvailable(true);
			setLastVerifiedEmail(authUser.email);
		}
	}, [isSocialJoin, authUser?.email]);

	const onAllAgreements = useCallback(() => {
		setValue("isAgreedTerms", !isAgreedTerms);
		setValue("isAgreedPrivacyPolicy", !isAgreedPrivacyPolicy);
		setValue("isAgreedEmail", !isAgreedEmail);
	}, [isAgreedTerms, isAgreedPrivacyPolicy, isAgreedEmail, setValue]);

	// 전체 동의 체크박스 상태
	// const allAgreementsChecked = isAgreedTerms && isAgreedPrivacyPolicy && isAgreedEmail;
	const allAgreementsChecked = useMemo(() => {
		return isAgreedTerms && isAgreedPrivacyPolicy && isAgreedEmail;
	}, [isAgreedTerms, isAgreedPrivacyPolicy, isAgreedEmail]);

	// 현재 선택된 국가에 따른 지역 옵션
	// const regionOptions = country ? getRegionOptionsByCountry(country) : [];
	const regionOptions = useMemo(() => {
		return country ? getRegionOptionsByCountry(country as CountryCode) : [];
	}, [country]);

	// 옵션들
	const yearOptions = useMemo(() => {
		return generateYearOptions();
	}, []);

	const cancelSignup = useCallback(() => {
		// if logged in, logout
		if (authUser?.userId) {
			makeLogout();
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		}
		router.push("/");
	}, [authUser?.userId, makeLogout, router, queryClient]);

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
					onSubmit={onFormSubmit}
					className="space-y-4"
				>
					{/* 이메일 필드 */}
					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="email"
								className="relative mb-1 font-semibold"
							>
								이메일 주소 <span className="absolute text-red-500 -top-2 -right-2">*</span>
							</label>
							{!isSocialJoin && (
								<>
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
								</>
							)}
						</div>
						<div className="relative">
							<input
								id="email"
								{...register("email")}
								type="email"
								required
								readOnly={isSocialJoin}
								value={isSocialJoin ? authUser?.email || "" : undefined}
								className={`w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none ${
									isSocialJoin ? "bg-gray-50 text-gray-600" : ""
								}`}
							/>
							{!isSocialJoin && (
								<button
									type="button"
									className="absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded-md cursor-pointer right-2 top-1/2 text-hbc-blue"
									onClick={handleEmailVerification}
									disabled={checkEmailMutation.isPending}
								>
									{checkEmailMutation.isPending ? "확인 중..." : "중복 확인"}
								</button>
							)}
						</div>
						{errors.email && <em className="mt-1 text-sm text-hbc-red">{errors.email.message}</em>}
					</div>

					{/* 비밀번호 필드 (소셜 가입이 아닐 때만) */}
					{!isSocialJoin && (
						<>
							<div>
								<label
									htmlFor="password"
									className="relative mb-1 font-semibold"
								>
									비밀번호 <span className="absolute text-red-500 -top-2 -right-2">*</span>
								</label>
								<input
									id="password"
									{...register("password")}
									type="password"
									required
									className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
								/>
								{errors.password && <em className="mt-1 text-sm text-hbc-red">{errors.password.message}</em>}
							</div>
							<div>
								<div className="flex justify-between">
									<label
										htmlFor="passwordConfirm"
										className="relative mb-1 font-semibold"
									>
										비밀번호 확인 <span className="absolute text-red-500 -top-2 -right-2">*</span>
									</label>
									{passwordsMatch === true && (
										<div className="flex items-center gap-1 text-sm text-[#3884FF] font-semibold">
											<Correct /> 비밀번호가 같습니다.
										</div>
									)}
									{passwordsMatch === false && passwordConfirm && (
										<div className="flex items-center gap-1 text-sm font-semibold text-hbc-red">
											<Incorrect /> 비밀번호가 같지 않습니다.
										</div>
									)}
								</div>
								<input
									id="passwordConfirm"
									{...register("passwordConfirm")}
									type="password"
									required
									className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
								/>
								{errors.passwordConfirm && (
									<em className="mt-1 text-sm text-hbc-red">{errors.passwordConfirm.message}</em>
								)}
							</div>
						</>
					)}

					{/* 이름 필드 */}
					<div>
						<label
							htmlFor="name"
							className="relative mb-1 font-semibold"
						>
							이름 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							id="name"
							{...register("name")}
							type="text"
							required
							className="w-full px-3 py-[5px] border border-hbc-black rounded-md focus:outline-none"
						/>
						{errors.name && <em className="mt-1 text-sm text-hbc-red">{errors.name.message}</em>}
					</div>

					<div className="flex gap-4">
						{/* 연락처 필드 */}
						<div className="w-1/2">
							<label
								htmlFor="phoneNumber"
								className="relative mb-1 font-semibold"
							>
								연락처 <span className="absolute text-red-500 -top-2 -right-2">*</span>
							</label>
							<div className="relative">
								<input
									id="phoneNumber"
									{...register("phoneNumber")}
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
							{errors.phoneNumber && <em className="mt-1 text-sm text-hbc-red">{errors.phoneNumber.message}</em>}
						</div>

						{/* 성별 필드 */}
						<div className="w-1/2">
							<label className="mb-1 font-semibold">성별</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={GENDER_OPTIONS}
								value={watch("gender")}
								onChange={(val) => setValue("gender", val as "M" | "F")}
								placeholder="성별을 선택하세요"
							/>
							{errors.gender && <em className="mt-1 text-sm text-hbc-red">{errors.gender.message}</em>}
						</div>
					</div>

					{/* 생년월일 필드 */}
					<div>
						<label className="relative mb-1 font-semibold">
							생년월일 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<div className="flex justify-between w-full">
							<div className="flex flex-col items-start">
								<div className="flex items-center justify-center gap-1">
									<Dropdown
										className="w-140px"
										optionsClassName="max-h-240px"
										options={yearOptions}
										value={watch("year")}
										onChange={(val) => setValue("year", val)}
										placeholder="년"
									/>
									<span>년</span>
								</div>
								{errors.year && <em className="mt-1 text-sm text-hbc-red">{errors.year.message}</em>}
							</div>
							<div className="flex flex-col items-start">
								<div className="flex items-center justify-center gap-1">
									<Dropdown
										className="w-100px"
										optionsClassName="max-h-240px"
										options={MONTH_OPTIONS}
										value={watch("month")}
										onChange={(val) => setValue("month", val)}
										placeholder="월"
									/>
									<span>월</span>
								</div>
								{errors.month && <em className="mt-1 text-sm text-hbc-red">{errors.month.message}</em>}
							</div>
							<div className="flex flex-col items-start">
								<div className="flex items-center justify-center gap-1">
									<Dropdown
										className="w-100px"
										optionsClassName="max-h-240px"
										options={DAY_OPTIONS}
										value={watch("day")}
										onChange={(val) => setValue("day", val)}
										placeholder="일"
									/>
									<span>일</span>
								</div>
								{errors.day && <em className="mt-1 text-sm text-hbc-red">{errors.day.message}</em>}
							</div>
						</div>
					</div>

					{/* 국가 및 지역 필드 */}
					<div className="flex gap-4">
						<div className="w-1/2">
							<label className="block mb-1 font-semibold">국가</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={COUNTRY_OPTIONS}
								value={watch("country")}
								onChange={(val) => setValue("country", val)}
								placeholder="국가를 선택하세요"
							/>
							{errors.country && <em className="mt-1 text-sm text-hbc-red">{errors.country.message}</em>}
						</div>
						<div className="w-1/2">
							<label className="block mb-1 font-semibold">지역</label>
							<Dropdown
								className="w-full"
								optionsClassName="max-h-240px"
								options={regionOptions}
								value={watch("region")}
								onChange={(val) => setValue("region", val)}
								placeholder="지역을 선택하세요"
							/>
							{errors.region && <em className="mt-1 text-sm text-hbc-red">{errors.region.message}</em>}
						</div>
					</div>

					<div className="w-full h-[1px] bg-hbc-black my-8"></div>
					<div className="text-center">어떤 서비스를 선호하시나요?</div>
					<div className="flex gap-4">
						<Button
							type="button"
							className={cn("w-full text-lg py-2 font-suisse")}
							variant={watch("musicType") === "ACAPELLA" ? "fill" : "outline"}
							rounded="full"
							onClick={() => setValue("musicType", "ACAPELLA")}
						>
							ACAPPELLA
						</Button>
						<Button
							type="button"
							className={cn("w-full text-lg py-2 font-suisse")}
							variant={watch("musicType") === "BEAT" ? "fill" : "outline"}
							rounded="full"
							onClick={() => setValue("musicType", "BEAT")}
						>
							BEAT
						</Button>
					</div>

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
							<div>
								<div
									className="inline-flex items-center gap-2 cursor-pointer"
									onClick={() => setValue("isAgreedTerms", !isAgreedTerms)}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => e.key === "Enter" && setValue("isAgreedTerms", !isAgreedTerms)}
								>
									{isAgreedTerms ? <Checkbox /> : <EmptyCheckbox />}
									<span>
										[필수] 히트비트클럽{" "}
										<Link
											href="/terms-of-service"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-hbc-blue"
										>
											서비스 이용약관
										</Link>
										에 동의합니다.
									</span>
								</div>
								{errors.isAgreedTerms && <em className="mt-1 text-sm text-hbc-red">{errors.isAgreedTerms.message}</em>}
							</div>
							<div>
								<div
									className="inline-flex items-center gap-2 cursor-pointer"
									onClick={() => setValue("isAgreedPrivacyPolicy", !isAgreedPrivacyPolicy)}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => e.key === "Enter" && setValue("isAgreedPrivacyPolicy", !isAgreedPrivacyPolicy)}
								>
									{isAgreedPrivacyPolicy ? <Checkbox /> : <EmptyCheckbox />}
									<span>
										[필수] 히트비트클럽{" "}
										<Link
											href="/privacy-policy"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-hbc-blue"
										>
											개인정보처리방침
										</Link>
										에 동의합니다.
									</span>
								</div>
								{errors.isAgreedPrivacyPolicy && (
									<em className="mt-1 text-sm text-hbc-red">{errors.isAgreedPrivacyPolicy.message}</em>
								)}
							</div>
							<div>
								<div
									className="inline-flex items-center gap-2 cursor-pointer"
									onClick={() => setValue("isAgreedEmail", !isAgreedEmail)}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => e.key === "Enter" && setValue("isAgreedEmail", !isAgreedEmail)}
								>
									{isAgreedEmail ? <Checkbox /> : <EmptyCheckbox />}
									<span>이메일 수신에 동의합니다. (선택)</span>
								</div>
								{errors.isAgreedEmail && <em className="mt-1 text-sm text-hbc-red">{errors.isAgreedEmail.message}</em>}
							</div>
						</div>
					</div>

					<div className="flex justify-center gap-4 pt-8">
						<Button
							size="lg"
							variant="outline"
							className="w-full py-2.5 font-extrabold"
							type="button"
							onClick={cancelSignup}
						>
							취소
						</Button>
						<Button
							size="lg"
							className="w-full py-2.5 font-extrabold"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "처리 중..." : "완료"}
						</Button>
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
