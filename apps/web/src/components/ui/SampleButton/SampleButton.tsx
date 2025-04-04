import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/utils";

/**
 * 버튼 컴포넌트의 스타일 변형을 정의합니다.
 */
const sampleButtonVariants = cva(
  cn(
    "cursor-pointer inline-flex items-center justify-center rounded-md",
    "text-sm font-medium text-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none"
  ),
  {
    /**
     * 버튼 컴포넌트의 스타일 변형을 정의합니다.
     *
     * - default: 기본 스타일 (주 색상 배경)
     * - destructive: 위험한 작업을 위한 빨간색 스타일
     * - outline: 테두리가 있는 스타일
     * - secondary: 보조 색상 스타일
     * - ghost: 배경이 투명한 스타일
     * - link: 링크처럼 보이는 스타일
     */
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 hover:bg-gray-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100",
        link: "underline-offset-4 hover:underline text-blue-500",
      },
      /**
       * 버튼의 크기 변형을 정의합니다.
       *
       * - default: 기본 크기 (h-10)
       * - sm: 작은 크기 (h-9)
       * - lg: 큰 크기 (h-11)
       * - icon: 아이콘용 정사각형 크기 (h-10 w-10)
       */
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * 버튼 컴포넌트의 Props 타입을 정의합니다.
 *
 * HTML button 요소의 모든 속성과 함께 다음 속성들을 추가로 지원합니다:
 * - variant: 버튼의 스타일 변형
 * - size: 버튼의 크기 변형
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sampleButtonVariants> {}

/**
 * 재사용 가능한 버튼 컴포넌트입니다.
 *
 * 다양한 스타일과 크기를 지원하며, 접근성과 키보드 네비게이션을 고려한 설계입니다.
 */
const SampleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        data-testid="button"
        className={cn(sampleButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

SampleButton.displayName = "SampleButton";

export { SampleButton, sampleButtonVariants as buttonVariants };
