import React from "react";
import UserAccoutHeader from "./UserAccoutHeader";
import UserAccountSubscribe from "./UserAccountSubscribe";
import UserAccountForm from "./UserAccountForm";
import { ToastProvider, ToastViewport } from "@/components/ui/Toast/toast";

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
