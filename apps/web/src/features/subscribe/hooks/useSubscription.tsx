import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { SubscribeFormValues } from "../schema";

export type ModalType = "promotion" | "payment" | "success" | "error" | "information";

export type UseSubscriptionReturn = {
	isSubscribed: boolean;
	isSubmitting: boolean;
	modals: Record<ModalType, boolean>;
	openModal: (modalType: ModalType) => void;
	closeModal: (modalType: ModalType) => void;
	submitSubscription: (data: SubscribeFormValues) => Promise<void>;
	validatePromotionCode: (code: string) => Promise<boolean>;
};

// Context 생성
const SubscriptionContext = createContext<UseSubscriptionReturn | undefined>(undefined);

// Provider 컴포넌트
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
	const [isSubscribed, setIsSubscribed] = useState(false); // 서버에서 구독 상태 확인 필요
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const [modals, setModals] = useState<Record<ModalType, boolean>>({
		promotion: false,
		payment: false,
		success: false,
		error: false,
		information: false,
	});

	// 모달 관리 함수
	const openModal = useCallback((modalType: ModalType) => {
		console.log("Opening modal:", modalType);
		setModals((prev) => ({
			...prev,
			[modalType]: true,
		}));
	}, []);

	const closeModal = useCallback((modalType: ModalType) => {
		console.log("Closing modal:", modalType);
		setModals((prev) => ({
			...prev,
			[modalType]: false,
		}));
	}, []);

	// 프로모션 코드 검증 함수 (Mock)
	const validatePromotionCode = useCallback(async (code: string): Promise<boolean> => {
		// 서버 API 호출로 대체 필요
		await new Promise((resolve) => setTimeout(resolve, 100));
		return code.length > 0 && code === "VALID";
	}, []);

	// 구독 제출 함수
	const submitSubscription = useCallback(
		async (data: SubscribeFormValues): Promise<void> => {
			setIsSubmitting(true);
			try {
				console.log("Submitting subscription data:", data);
				// 실제 API 호출 코드로 대체 필요
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// 성공 모달 표시
				openModal("success");

				// 성공 시 구독 상태 변경
				setIsSubscribed(true);
			} catch (error) {
				console.error("Subscription failed:", error);
				openModal("error");
			} finally {
				setIsSubmitting(false);
			}
		},
		[openModal],
	);

	// 모달 상태 디버깅을 위한 로그
	useEffect(() => {
		console.log("Modal states:", modals);
	}, [modals]);

	const value = {
		isSubscribed,
		isSubmitting,
		modals,
		openModal,
		closeModal,
		submitSubscription,
		validatePromotionCode,
	};

	return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Hook
export const useSubscription = (): UseSubscriptionReturn => {
	const context = useContext(SubscriptionContext);

	if (!context) {
		throw new Error("useSubscription must be used within a SubscriptionProvider");
	}

	return context;
};
