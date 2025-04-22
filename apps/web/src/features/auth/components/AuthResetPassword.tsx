"use client";

import { useState } from "react";
import { HBCLoginMain } from "@/assets/svgs";
import { AuthResetPasswordCompletionModal } from "./Modal/AuthResetPasswordCompletionModal";
import { AuthResetPasswordModal } from "./Modal/AuthResetPasswordModal";

export const AuthResetPassword = () => {
	const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(true);
	const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

	const onResetPassword = () => {
		//api 호출
		setIsResetPasswordModalOpen(false);
		setIsCompletionModalOpen(true);
	};

	const onCompletionClose = () => {
		//route
		setIsCompletionModalOpen(false);
	};

	return (
		<>
			<div className="w-[400px] h-full m-auto py-20">
				<div className="flex flex-col items-center justify-center">
					<div className="mb-9">
						<HBCLoginMain className="w-[240px] h-[89px]" />
					</div>
				</div>
			</div>

			<AuthResetPasswordModal
				isOpen={isResetPasswordModalOpen}
				onReset={onResetPassword}
			/>
			<AuthResetPasswordCompletionModal
				isOpen={isCompletionModalOpen}
				onClose={onCompletionClose}
			/>
		</>
	);
};
