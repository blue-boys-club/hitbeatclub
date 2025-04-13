import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";

const baseBodyVariants = cva("justify-start", {
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

    const isPureEnglish = checkIsPureEnglish(children);

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
