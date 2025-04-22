import React from "react";
import UserAccoutHeader from "./UserAccoutHeader";
import UserAccountSubscribe from "./UserAccountSubscribe";
import UserAccountForm from "./UserAccountForm";
import { Toast, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/Toast/toast";

const UserAccountSetting = () => {
	return (
		<ToastProvider>
			<UserAccoutHeader />
			<ToastViewport />
			<UserAccountSubscribe />
			<UserAccountForm />
		</ToastProvider>
	);
};

export default UserAccountSetting;
