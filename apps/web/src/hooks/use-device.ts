"use client";

import { RESPONSIVE_BREAKPOINTS } from "@/lib/ui.constant";
import { useMediaQuery } from "./use-media-query";

/**
 * 기기 타입을 감지하는 커스텀 훅
 * @returns 기기 타입 정보 (isPC, isMobile, isTablet)
 */
export const useDevice = () => {
	const isMobile = useMediaQuery(`(max-width: ${RESPONSIVE_BREAKPOINTS.PC_MIN_WIDTH - 1}px)`);
	const isPC = useMediaQuery(`(min-width: ${RESPONSIVE_BREAKPOINTS.PC_MIN_WIDTH}px)`);

	return {
		isPC,
		isMobile,
	};
};
