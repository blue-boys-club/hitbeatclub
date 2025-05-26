"use client";
import { Dropdown, Input, Toggle } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import React, { memo, useMemo, useState } from "react";
import UserChangePasswordModal from "./modal/UserChangePasswordModal";
import UserDeleteAccountModal from "./modal/UserDeleteAccountModal";
import UserDeleteCompleteModal from "./modal/UserDeleteCompleteModal";
import { useToast } from "@/hooks/use-toast";
import UserCancelMembershipModal from "./modal/UserCancelMembershipModal";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useQuery } from "@tanstack/react-query";

const UserAccountForm = memo(() => {
	const { data: user } = useQuery(getUserMeQueryOption());
	const isMembership = useMemo(() => {
		return !!user?.subscribedAt;
	}, [user?.subscribedAt]);
	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
	const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
	const [isDeleteCompleteModalOpen, setIsDeleteCompleteModalOpen] = useState(false);
	const [isCancelMembershipModalOpen, setIsCancelMembershipModalOpen] = useState(false);
	const { toast } = useToast();

	const toggleDarkMode = () => {};

	const openChangePasswordModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setIsChangePasswordModalOpen(true);
	};

	const changePasswordMoadlClose = () => {
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
	};
	const saveChanges = () => {
		toast({ description: "변경사항이 저장되었습니다." });
	};

	const openCancelMembershipModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setIsCancelMembershipModalOpen(true);
	};

	const cancelMembershipModalClose = () => {
		setIsCancelMembershipModalOpen(false);
	};

	return (
		<>
			<section className="pt-10 px-[106px] pb-5">
				<div className="flex flex-col gap-3">
					<div className="text-black font-extrabold text-base leading-[160%] tracking-[-0.32px]">
						기본정보 General Information
					</div>
					<form className="flex flex-col gap-4">
						<div className="flex flex-col">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">이메일</label>
							<Input
								className="placeholder:text-xs py-0 px-0 text-xs"
								placeholder="hitbeatclub@gmail.com"
								variant="square"
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">휴대전화</label>
							<Input
								className="placeholder:text-xs py-0 px-0 text-xs"
								placeholder="010-1234-5678"
								variant="square"
							/>
						</div>
						<div className="grid grid-cols-2 gap-x-5">
							<div className="flex flex-col">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">이름</label>
								<Input
									className="placeholder:text-xs py-0 px-0 text-xs"
									placeholder="김일상"
									variant="square"
								/>
							</div>
							<div className="flex flex-col">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">활동명</label>
								<Input
									className="placeholder:text-xs py-0 px-0 text-xs"
									placeholder="HITBEATCLUB"
									variant="square"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">생년월일</label>
							<div className="grid grid-cols-3 gap-x-5">
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[]}
									placeholder="1994"
									size="sm"
								/>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[]}
									placeholder="05월"
									size="sm"
								/>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[]}
									placeholder="30일"
									size="sm"
								/>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-x-5">
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">성별</label>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[
										{ label: "남자", value: "male" },
										{ label: "여자", value: "female" },
									]}
									placeholder="남자"
									size="sm"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">국가</label>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[]}
									placeholder="Korea, Republic of"
									size="sm"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">지역</label>
								<Dropdown
									className="w-full"
									optionsClassName="justify-start overflow-y-auto max-h-[200px]"
									options={[]}
									placeholder="서울시"
									size="sm"
								/>
							</div>
						</div>

						<div className="flex justify-between pb-4 border-b-1 border-black">
							<label className="text-black font-semibold text-xs leading-[150%] tracking-[0.12px]">비밀번호 변경</label>
							<button
								onClick={openChangePasswordModal}
								className="text-[#001EFF] font-[600] text-[12px] leading-[12px] tracking-[0.12px] font-['SUIT Variable'] cursor-pointer"
							>
								비밀번호 변경
							</button>
						</div>

						<div className="flex flex-col gap-3 pb-4 border-b-1 border-black">
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
						</div>
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
								onClick={isMembership ? openCancelMembershipModal : openDeleteAccountModal}
								className="text-[#87878A] font-semibold text-[12px] leading-[100%] tracking-[0.12px] font-['SUIT_Variable'] pb-[3px] border-b-1 border-[#87878A]] cursor-pointer"
							>
								회원 탈퇴하기
							</button>
						</div>
						<div className="pt-[30px] flex justify-center">
							<Button
								onClick={saveChanges}
								size={"sm"}
								rounded={"full"}
								className="text-white font-black text-[12px] leading-[100%] tracking-[0.12px] font-['SUIT_Variable']"
							>
								변경사항 저장
							</Button>
						</div>
					</form>
				</div>
			</section>
			<UserCancelMembershipModal
				isModalOpen={isCancelMembershipModalOpen}
				onClose={cancelMembershipModalClose}
			/>
			<UserChangePasswordModal
				isModalOpen={isChangePasswordModalOpen}
				onClose={changePasswordMoadlClose}
			/>
			<UserDeleteAccountModal
				isModalOpen={isDeleteAccountModalOpen}
				onClose={deleteAccountModalClose}
				onOpen={openDeleteCompleteModal}
			/>
			<UserDeleteCompleteModal
				isModalOpen={isDeleteCompleteModalOpen}
				onClose={deleteCompleteModalClose}
			/>
		</>
	);
});

UserAccountForm.displayName = "UserAccountForm";
export default UserAccountForm;
