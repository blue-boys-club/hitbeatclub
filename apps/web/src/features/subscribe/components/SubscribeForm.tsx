"use client";

import { memo } from "react";
import { SubscriptionProvider } from "../hooks/useSubscription";
import { SubscribeFormContent } from "./SubscribeFormContent";

/**
 * 구독 폼 메인 컴포넌트
 * SubscriptionProvider로 Context를 제공하고 실제 내용은 SubscribeFormContent에서 구현
 */
export const SubscribeForm = memo(() => {
	return (
		<SubscriptionProvider>
			<SubscribeFormContent />
		</SubscriptionProvider>
	);
});

SubscribeForm.displayName = "SubscribeForm";
