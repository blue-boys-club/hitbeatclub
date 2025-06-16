"use client";

import { useState, useCallback, useEffect, createContext, useContext, ReactNode, useMemo } from "react";
import PortOne, { Entity } from "@portone/browser-sdk/v2";
import { PORTONE_STORE_ID, PORTONE_CHANNEL_KEY } from "../../../lib/payment.constant";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useQuery } from "@tanstack/react-query";
import { SubscribeFormValue } from "../schema";

/**
 * 사용 가능한 모달 유형
 */
export type ModalType = "promotion" | "payment" | "success" | "error" | "information" | "paypal";

/**
 * 기본 빌링키 발급 요청 인자
 */
export interface BaseBillingKeyIssueArgs {
	/** 주문명 */
	orderName: string;
	/** 리디렉션 URL */
	redirectUrl: string;
	/** 결제 금액 (PortOne displayAmount용) */
	amount: number;
	/** 고객 정보 (선택 사항) */
	customer?: {
		/** 고객 ID */
		customerId: string;
	};
}

/**
 * 구독 폼 값에 결제 수단 유형 및 추가 고객 정보가 포함된 확장된 타입
 */
export type AugmentedSubscribeFormValues = SubscribeFormValue & {
	/** 선택된 결제 수단 유형 (내부 식별용) */
	paymentMethodType: PaymentGatewayType | "PAYPAL"; // PAYPAL은 PortOne 외부 처리
	/** 고객 이름 */
	customerName: string;
	/** 이메일 */
	email: string;
	/** 전화번호 */
	phone: string;
};

/**
 * 지원하는 PortOne 결제 게이트웨이 유형
 */
export type PaymentGatewayType = "CARD" | "TOSS_EASY_PAY"; // 향후 다른 PG 추가 가능

/**
 * PortOne 빌링키 발급 방식
 */
type BillingKeyMethod = "CARD" | "EASY_PAY"; // PortOne SDK에서 지원하는 메소드 (BANK_TRANSFER 제거)

/**
 * 결제 게이트웨이 설정 인터페이스
 */
interface PaymentGatewayConfig {
	/** PortOne 빌링키 발급 방식 */
	billingKeyMethod: BillingKeyMethod;
	/** PortOne 채널 키 */
	channelKey: string;
	/** 사용자에게 표시될 이름 (선택 사항) */
	displayName?: string;
}

/**
 * 각 결제 게이트웨이별 설정 객체
 */
const paymentGatewayConfigs: Record<PaymentGatewayType, PaymentGatewayConfig> = {
	CARD: {
		billingKeyMethod: "CARD",
		channelKey: PORTONE_CHANNEL_KEY.CARD_RECURRING,
		displayName: "카드 결제",
	},
	TOSS_EASY_PAY: {
		billingKeyMethod: "EASY_PAY",
		channelKey: PORTONE_CHANNEL_KEY.EASY_PAY_TOSS_PAY,
		displayName: "토스페이",
	},
	// TODO: 향후 네이버페이, 카카오페이 등 여기에 추가
};

/**
 * useSubscription 훅이 반환하는 값들의 타입 정의
 */
export type UseSubscriptionReturn = {
	/** 현재 멤버십 상태 */
	isMembership: boolean;
	/** 구독 제출 진행 중 상태 */
	isSubmitting: boolean;
	/** 결제 처리 진행 중 상태 (빌링키 발급 등) */
	isProcessingPayment: boolean;
	/** 결제 관련 오류 메시지 */
	paymentError: string | null;
	/** 각 모달의 열림/닫힘 상태 */
	modals: Record<ModalType, boolean>;
	/** 특정 모달을 여는 함수 */
	openModal: (modalType: ModalType) => void;
	/** 특정 모달을 닫는 함수 */
	closeModal: (modalType: ModalType) => void;
	/** 구독 정보를 제출하는 함수 */
	submitSubscription: (data: AugmentedSubscribeFormValues) => Promise<void>;
	/** 프로모션 코드 유효성을 검사하는 함수 */
	validatePromotionCode: (code: string) => Promise<boolean>;
	/** PortOne을 통해 빌링키 발급을 시작하는 일반 함수 */
	initiateBillingKeyIssue: (
		paymentGateway: PaymentGatewayType,
		args: BaseBillingKeyIssueArgs,
	) => Promise<string | null>;
};

const SubscriptionContext = createContext<UseSubscriptionReturn | undefined>(undefined);

/**
 * 구독 관련 로직 및 상태를 제공하는 Provider 컴포넌트
 * @param children - Provider 내부에서 렌더링될 자식 요소들
 */
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
	const [modals, setModals] = useState<Record<ModalType, boolean>>({
		promotion: false,
		payment: false,
		success: false,
		error: false,
		information: false,
		paypal: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [paymentError, setPaymentError] = useState<string | null>(null);

	const { data: user } = useQuery(getUserMeQueryOption());
	const isMembership = useMemo(() => {
		return !!user?.subscribedAt;
	}, [user?.subscribedAt]);

	/**
	 * 지정된 타입의 모달을 엽니다.
	 * @param modalType - 열고자 하는 모달의 타입
	 */
	const openModal = useCallback((modalType: ModalType) => {
		console.log("Opening modal:", modalType);
		setModals((prev) => ({
			...prev,
			[modalType]: true,
		}));
	}, []);

	/**
	 * 지정된 타입의 모달을 닫습니다.
	 * @param modalType - 닫고자 하는 모달의 타입
	 */
	const closeModal = useCallback((modalType: ModalType) => {
		console.log("Closing modal:", modalType);
		setModals((prev) => ({
			...prev,
			[modalType]: false,
		}));
	}, []);

	/**
	 * 프로모션 코드의 유효성을 검사합니다. (현재는 "PROMO10"만 유효)
	 * @param code - 검사할 프로모션 코드
	 * @returns 코드가 유효하면 true, 아니면 false
	 */
	const validatePromotionCode = useCallback(async (code: string): Promise<boolean> => {
		console.log("Validating promotion code:", code);
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
		return code.toUpperCase() === "PROMO10";
	}, []);

	/**
	 * PortOne을 통해 지정된 결제 게이트웨이의 빌링키 발급을 요청합니다.
	 * @param paymentGateway - 사용할 결제 게이트웨이 타입 (예: 'CARD', 'TOSS_EASY_PAY')
	 * @param args - 빌링키 발급에 필요한 인자들 (주문명, 리디렉션 URL, 금액 등)
	 * @returns 발급 성공 시 빌링키 문자열, 실패 시 null
	 */
	const initiateBillingKeyIssue = useCallback(
		async (paymentGateway: PaymentGatewayType, args: BaseBillingKeyIssueArgs): Promise<string | null> => {
			setPaymentError(null);
			setIsProcessingPayment(true);

			const config = paymentGatewayConfigs[paymentGateway];
			if (!config) {
				console.error(`Unsupported payment gateway: ${paymentGateway}`);
				setPaymentError(`Unsupported payment gateway: ${paymentGateway}`);
				openModal("error");
				setIsProcessingPayment(false);
				return null;
			}

			const payload = {
				storeId: PORTONE_STORE_ID,
				channelKey: config.channelKey,
				billingKeyMethod: config.billingKeyMethod,
				orderName: args.orderName,
				issueName: args.orderName,
				currency: Entity.Currency.KRW,
				displayAmount: args.amount,
				redirectUrl: args.redirectUrl,
				customer: args.customer,
				issueId: `${crypto.randomUUID()}`,
			};
			console.log(`Requesting ${paymentGateway} billing key with payload:`, payload);
			const response = await PortOne.requestIssueBillingKey(payload);

			console.log(`${paymentGateway} Billing key issuance response:`, response);

			if (!response?.code && response?.billingKey) {
				console.log(`${paymentGateway} Billing key issued:`, response.billingKey);
				setIsProcessingPayment(false);
				return response.billingKey;
			} else {
				console.error(`${paymentGateway} billing key issuance failed:`, response);
				setPaymentError(response?.message || `${paymentGateway} billing key issuance failed.`);
				openModal("error");
				setIsProcessingPayment(false);
				return null;
			}
		},
		[openModal],
	);

	/**
	 * 최종 구독 데이터를 서버로 제출(시뮬레이션)하고 멤버십 상태를 업데이트합니다.
	 * @param data - 구독에 필요한 모든 정보 (폼 값, 결제 정보 등)
	 */
	const submitSubscription = useCallback(
		async (data: AugmentedSubscribeFormValues) => {
			setIsSubmitting(true);
			setPaymentError(null);
			console.log("Final subscription data received by hook:", data);

			if (!data.method?.billingKey) {
				// PAYPAL은 billingKey가 없을 수 있으므로, paymentMethodType으로 확인
				if (data.paymentMethodType !== "PAYPAL") {
					console.error("Billing key is missing for non-PayPal payment in submitSubscription data.");
					setPaymentError("Billing key is required to submit subscription.");
					openModal("error");
					setIsSubmitting(false);
					return;
				}
			}

			if (data.promotionCode) {
				const isValidPromo = await validatePromotionCode(data.promotionCode);
				if (!isValidPromo) {
					setPaymentError("Invalid promotion code.");
					openModal("error");
					setIsSubmitting(false);
					return;
				}
				console.log("Promotion code applied:", data.promotionCode);
			}

			// Simulate backend API call
			try {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				console.log("Subscription process complete for type:", data.paymentMethodType);
				// setMembership(true); // Update membership status TODO: 멤버십 상태 업데이트 로직 추가
				openModal("success"); // Show success modal
			} catch (error: any) {
				console.error("Subscription submission error:", error);
				setPaymentError(error.message || "An unexpected error occurred during final submission.");
				openModal("error"); // Show error modal
			} finally {
				setIsSubmitting(false);
			}
		},
		[validatePromotionCode, openModal],
	);

	// Log modal state changes for debugging
	useEffect(() => {
		console.log("Modal states:", modals);
	}, [modals]);

	const value = {
		isMembership,
		isSubmitting,
		modals,
		openModal,
		closeModal,
		submitSubscription,
		validatePromotionCode,
		isProcessingPayment,
		paymentError,
		initiateBillingKeyIssue, // Expose the new generic function
	};

	return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

/**
 * 구독 관련 상태 및 함수들을 사용하기 위한 커스텀 훅.
 * SubscriptionProvider 내부에서 사용되어야 합니다.
 * @returns UseSubscriptionReturn 타입의 객체
 * @throws SubscriptionProvider 외부에서 사용 시 에러 발생
 */
export const useSubscription = (): UseSubscriptionReturn => {
	const context = useContext(SubscriptionContext);
	if (!context) {
		throw new Error("useSubscription must be used within a SubscriptionProvider");
	}
	return context;
};
