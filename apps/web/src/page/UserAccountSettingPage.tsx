import React from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/Toast/toast";
import UserAccoutHeader from "@/features/user/components/UserAccoutHeader";
import UserAccountSubscribe from "@/features/user/components/UserAccountSubscribe";
import UserAccountForm from "@/features/user/components/UserAccountForm";

const UserAccountSettingPage = () => {
	return (
		<ToastProvider>
			<UserAccoutHeader />
			<ToastViewport />
			<UserAccountSubscribe />
			<UserAccountForm />
		</ToastProvider>
	);
};

export default UserAccountSettingPage;
