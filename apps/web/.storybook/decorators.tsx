import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactElement } from "react";
/**
 * 스토리북에서 tanstack/react-query를 사용하기 위한 데코레이터
 * @param StoryFn 스토리북 스토리 함수
 * @param context 스토리북 스토리 컨텍스트
 * @returns 쿼리 데코레이터
 */
export const storyQueryDecorator = (StoryFn: () => ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{StoryFn()}</QueryClientProvider>
  );
};
