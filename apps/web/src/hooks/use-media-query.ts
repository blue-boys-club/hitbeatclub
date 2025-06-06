"use client";

import { useState, useEffect } from "react";

/**
 * 미디어 쿼리를 사용하여 화면 크기를 감지하는 커스텀 훅
 * @param query 미디어 쿼리 문자열 (예: '(max-width: 768px)')
 * @returns 미디어 쿼리 일치 여부
 */
export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia(query);

		setMatches(mediaQuery.matches);

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
};
