import { ToastProvider } from "@/components/ui/Toast/toast";
import React from "react";
import SupportQuestionList from "../features/support/components/SupportQuestionList";
import SupportForm from "../features/support/components/SupportForm";

const SupportPage = () => {
	return (
		<ToastProvider>
			<SupportQuestionList />
			<SupportForm />
		</ToastProvider>
	);
};

export default SupportPage;
