import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import { cva, VariantProps } from "class-variance-authority";
import { memo } from "react";
import { forwardRef } from "react";

const baseHeadingVariants = cva("justify-start text-hbc-black", {
  variants: {
    as: {
      h1: "text-[56px] leading-[72px] tracking-[0.56px]",
      h2: "text-[40px] leading-[56px] tracking-[0.40px]",
      h3: "text-[32px] leading-[46px] tracking-[0.32px]",
      h4: "text-[26px] leading-[32px] tracking-[0.26px]",
      h5: "text-[22px] leading-[32px] tracking-[0.22px]",
      h6: "text-[20px] leading-[28px] tracking-[0.20px]",
    },
    isPureEnglish: {
      true: "font-suisse",
      false: "font-suit",
    },
  },
  compoundVariants: [
    // English styles
    {
      as: "h1",
      isPureEnglish: true,
      className: "font-semibold",
    },
    {
      as: "h2",
      isPureEnglish: true,
      className: "font-semibold uppercase",
    },
    {
      as: "h3",
      isPureEnglish: true,
      className: "font-semibold uppercase",
    },
    {
      as: "h4",
      isPureEnglish: true,
      className: "font-semibold",
    },
    {
      as: "h5",
      isPureEnglish: true,
      className: "font-semibold",
    },
    {
      as: "h6",
      isPureEnglish: true,
      className: "font-semibold",
    },

    // Korean & Mixed styles
    {
      as: "h1",
      isPureEnglish: false,
      className: "font-extrabold",
    },
    {
      as: "h2",
      isPureEnglish: false,
      className: "font-black uppercase",
    },
    {
      as: "h3",
      isPureEnglish: false,
      className: "font-black uppercase",
    },
    {
      as: "h4",
      isPureEnglish: false,
      className: "font-extrabold",
    },
    {
      as: "h5",
      isPureEnglish: false,
      className: "font-extrabold",
    },
    {
      as: "h6",
      isPureEnglish: false,
      className: "font-extrabold",
    },
  ],

  defaultVariants: {
    as: "h1",
    isPureEnglish: false,
  },
});

type AllowedElements = NonNullable<
  VariantProps<typeof baseHeadingVariants>["as"]
>;

/**
 * @property {"h1", "h2", "h3", "h4", "h5", "h6"} [as] - 렌더링 할 HTML Heading 태그
 */
export interface BaseHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: AllowedElements;
}
/**
 * 모든 헤딩 컴포넌트의 기본 컴포넌트
 */
export const BaseHeading = memo(
  forwardRef<HTMLHeadingElement, BaseHeadingProps>(
    ({ as = "h1", className, ...props }, ref) => {
      const Component = as;

      // 순수 영문 텍스트 여부
      const isPureEnglish = checkIsPureEnglish(props.children);

      return (
        <Component
          ref={ref}
          className={cn(
            baseHeadingVariants({
              as,
              isPureEnglish,
            }),
            className
          )}
          {...props}
        />
      );
    }
  )
);

BaseHeading.displayName = "BaseHeading";
