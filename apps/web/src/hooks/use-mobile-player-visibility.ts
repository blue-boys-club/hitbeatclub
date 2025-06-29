import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";

/**
 * MobilePlayer(Footer PlayBar)의 표시 여부를 확인하는 훅
 * MobilePlayer 컴포넌트의 렌더링 조건과 동일한 로직을 사용
 */
export const useMobilePlayerVisibility = () => {
	// 현재 재생 중인 트랙 확인
	const { currentProductId } = useAudioStore(
		useShallow((state) => ({
			currentProductId: state.productId,
		})),
	);

	// MobilePlayer: 표시 여부는 재생 중인 트랙 존재 여부만 확인 (로그인 여부와 무관)
	const isMobilePlayerVisible = !!currentProductId;

	return { isMobilePlayerVisible };
};
