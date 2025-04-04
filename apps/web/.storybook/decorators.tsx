import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactElement } from "react";
import { cn } from "../src/common/utils/tailwind";
import { fontSuit, fontSuisse } from "../src/styles/font";

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

/**
 * 스토리북에서 폰트를 사용하기 위한 데코레이터
 * @param StoryFn 스토리북 스토리 함수
 * @param context 스토리북 스토리 컨텍스트
 * @returns 폰트 데코레이터
 */
export const storyFontDecorator = (StoryFn: () => ReactElement) => {
  return (
    <div className={cn(fontSuit.variable, fontSuisse.variable, "antialiased")}>
      {StoryFn()}
    </div>
  );
};
