import { cn } from "@/common/utils/tailwind";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";

const baseBodyVariants = cva("justify-start text-hbc-black", {
  variants: {
    as: {
      div: "",
      span: "",
      p: "",
      article: "",
      section: "",
      main: "",
      aside: "",
      nav: "",
      header: "",
      footer: "",
    },
    size: {
      large: "text-[18px] tracking-[0.18px]",
      medium: "text-[16px] tracking-[-0.32px]",
      small: "text-[12px] tracking-[0.12px]",
    },
    isPureEnglish: {
      true: "font-suisse font-[450] leading-[160%]",
      false: "font-suit font-[450] leading-[160%]",
    },
  },
  compoundVariants: [
    // Small size needs different line height
    {
      size: "small",
      isPureEnglish: true,
      className: "leading-[150%]",
    },
    {
      size: "small",
      isPureEnglish: false,
      className: "leading-[150%]",
    },
  ],

  defaultVariants: {
    as: "div",
    isPureEnglish: false,
  },
});

/**
 * 허용된 HTML Body 태그
 */
export type AllowedBodyElements = NonNullable<
  VariantProps<typeof baseBodyVariants>["as"]
>;

export type BaseBodyProps<T extends React.ElementType = AllowedBodyElements> = {
  /**
   * 렌더링 할 HTML Body 태그
   */
  as?: T;
  /**
   * 렌더링 할 HTML Body 태그의 크기
   */
  size?: VariantProps<typeof baseBodyVariants>["size"];
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "size">;

/**
 * 모든 바디 컴포넌트의 기본 컴포넌트
 */
export const BaseBody = memo(
  forwardRef<
    React.ComponentRef<React.ElementType>,
    BaseBodyProps<AllowedBodyElements>
  >(({ as = "div", size, className, children, ...props }, ref) => {
    const Component = as as React.ElementType;

    // 순수 영문 텍스트 여부
    // 단 특수문자나 숫자만 있는 경우는 순수 영문으로 처리하지 않음
    // 영문, 숫자, 기본 특수문자만 포함된 경우 영문으로 판단
    const isEnglish = !!children
      ?.toString()
      ?.match(/^[a-zA-Z0-9\s.,!?()_\-']+$/);
    // 특수문자로만 이루어진 경우 체크
    const isOnlySpecialCharacters = !!children?.toString()?.match(/^[^\w\s]+$/);
    // 영문이면서 특수문자로만 이루어지지 않은 경우를 순수 영문으로 판단
    const isPureEnglish = isEnglish && !isOnlySpecialCharacters;

    return (
      <Component
        ref={ref}
        className={cn(
          baseBodyVariants({
            as,
            size,
            isPureEnglish,
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  })
);

BaseBody.displayName = "BaseBody";
