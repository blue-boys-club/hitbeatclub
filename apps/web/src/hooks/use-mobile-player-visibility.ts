import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";

/**
 * MobilePlayer(Footer PlayBar)의 표시 여부를 확인하는 훅
 * MobilePlayer 컴포넌트의 렌더링 조건과 동일한 로직을 사용
 */
export const useMobilePlayerVisibility = () => {
	// 로그인 상태 확인
	const { data: user } = useQuery({ ...getUserMeQueryOption(), retry: false });
	const isLoggedIn = Boolean(user?.id);
	
	// 현재 재생 중인 트랙 확인
	const { currentProductId } = useAudioStore(
		useShallow((state) => ({
			currentProductId: state.productId,
		})),
	);
	
	// MobilePlayer의 렌더링 조건과 동일: currentProductId와 isLoggedIn이 모두 true여야 함
	const isMobilePlayerVisible = !!(currentProductId && isLoggedIn);
	
	return { isMobilePlayerVisible };
};