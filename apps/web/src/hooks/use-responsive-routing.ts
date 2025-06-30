"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDevice } from "./use-device";
import { toMobilePath, toPcPath } from "@/lib/route-mapper";
import { useDevicePreferenceStore } from "@/stores/device";

/**
 * 현재 레이아웃(모바일/PC) 이 맞는지 검사하고, 필요 시 대응되는 경로로 리다이렉트한다.
 * @param currentLayout 현재 파일이 속한 레이아웃 유형 ("mobile" | "pc")
 */
export const useResponsiveRouting = (currentLayout: "mobile" | "pc") => {
	const router = useRouter();
	const pathname = usePathname();
	const { isMobile } = useDevice();
	const { preferredLayout } = useDevicePreferenceStore();

	const redirectedRef = useRef(false);

	useEffect(() => {
		if (redirectedRef.current) return; // 이미 리다이렉트했으면 더 이상 실행 X

		// "auto" 인 경우 화면 크기에 따라 레이아웃 결정
		const expectedLayout: "mobile" | "pc" = preferredLayout === "auto" ? (isMobile ? "mobile" : "pc") : preferredLayout;

		if (expectedLayout === currentLayout) return; // 현재 레이아웃이 기대와 일치 => 아무것도 하지 않음

		// 경로 변환 후 replace (history 를 더럽히지 않음)
		const targetPath = expectedLayout === "mobile" ? toMobilePath(pathname) : toPcPath(pathname);

		if (targetPath !== pathname) {
			redirectedRef.current = true;
			router.replace(targetPath);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preferredLayout, isMobile, pathname]);
};
