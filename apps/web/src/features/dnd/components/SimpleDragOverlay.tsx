import dynamic from "next/dynamic";

// Next.js 동적 임포트를 사용하여 SSR을 비활성화
// 드래그 앤 드롭 컴포넌트는 브라우저 전용 API를 사용하므로 클라이언트에서만 렌더링
export const SimpleDragOverlay = dynamic(
	() => import("./SimpleDragOverlayClient").then((mod) => ({ default: mod.SimpleDragOverlay })),
	{
		ssr: false, // 서버 사이드 렌더링 비활성화
		loading: () => null, // 로딩 컴포넌트 (선택사항)
	},
);
