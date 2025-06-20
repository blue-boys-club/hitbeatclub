"use client";

import { usePathname } from "next/navigation";
import { useQueryState, useQueryStates, type Options } from "nuqs";
import { searchQueryParsers } from "../types/searchParsers";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { debounce, isEqual } from "lodash";

export const useSearchParametersStates = (options?: Options) => {
	const pathname = usePathname();
	const isSearch = pathname === "/search";

	return useQueryStates(searchQueryParsers, {
		shallow: !isSearch,
		clearOnDefault: true,
		throttleMs: isSearch ? 200 : Infinity,
		...options,
	});
};

export const useSearchParametersStateByKey = (key: keyof typeof searchQueryParsers, options?: Options) => {
	const pathname = usePathname();
	const isSearch = pathname === "/search";

	return useQueryState(
		key,
		searchQueryParsers[key].withOptions({
			shallow: !isSearch,
			clearOnDefault: true,
			throttleMs: isSearch ? 200 : Infinity,
			...options,
		}),
	);
};

export const useSearchParametersStatesWithKeywordDebounced = (options?: Options, debounceMs = 500) => {
	const [state, setState] = useSearchParametersStates(options);
	const [debouncedState, setDebouncedState] = useState(state);

	// 이전 상태를 추적하기 위한 ref
	const prevStateRef = useRef(state);

	// 디바운스된 키워드 업데이트 함수
	const debouncedKeywordUpdate = useCallback(
		debounce((newState: typeof state) => {
			setDebouncedState(newState);
		}, debounceMs),
		[debounceMs],
	);

	useEffect(() => {
		const prevState = prevStateRef.current;

		// 상태가 변경되지 않았으면 아무것도 하지 않음
		if (isEqual(prevState, state)) {
			return;
		}

		// keyword 필드만 변경되었는지 확인
		const isOnlyKeywordChanged = (() => {
			const stateKeys = Object.keys(state) as (keyof typeof state)[];
			const changedKeys = stateKeys.filter((key) => {
				// lodash isEqual로 깊은 비교 (배열, 객체 모두 처리)
				return !isEqual(prevState[key], state[key]);
			});
			return changedKeys.length === 1 && changedKeys[0] === "keyword";
		})();

		if (isOnlyKeywordChanged) {
			// keyword만 변경된 경우 디바운스 적용
			debouncedKeywordUpdate(state);
		} else {
			// 다른 필드가 변경된 경우 즉시 업데이트
			// 진행 중인 디바운스 취소
			debouncedKeywordUpdate.cancel();
			setDebouncedState(state);
		}

		// 이전 상태 업데이트
		prevStateRef.current = state;
	}, [state, debouncedKeywordUpdate]);

	// 컴포넌트 언마운트 시 디바운스 정리
	useEffect(() => {
		return () => {
			debouncedKeywordUpdate.cancel();
		};
	}, [debouncedKeywordUpdate]);

	return [debouncedState, setState] as const;
};
