import { ToastProvider } from "@/components/ui/Toast/toast";
import React from "react";
import SupportQuestionList from "./SupportQuestionList";
import SupportForm from "./SupportForm";

const SupportPage = () => {
	return (
		<ToastProvider>
			<SupportQuestionList />
			<SupportForm />
		</ToastProvider>
	);
};

export default SupportPage;
