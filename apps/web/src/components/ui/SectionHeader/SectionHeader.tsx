import { checkIsPureEnglish, cn } from "@/common/utils";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const sectionHeaderVariants = cva("relative w-full border-b-[6px] border-hbc-black", {
	variants: {
		size: {
			large: "h-50px pb-[6px]",
			medium: "h-40px pb-[6px]",
			small: "h-34px pb-[6px]",
		},
	},
	defaultVariants: {
		size: "large",
	},
});

const sectionHeaderTitleVariants = cva("justify-start text-40px leading-40px tracking-032px text-hbc-black", {
	variants: {
		size: {
			large: "text-32px leading-32px tracking-032px",
			medium: "text-32px leading-32px tracking-032px",
			small: "text-24px leading-24px tracking-024px",
		},
		isPureEnglish: {
			true: "font-suisse font-bold",
			false: "font-suit font-extrabold",
		},
	},
	defaultVariants: {
		size: "large",
		isPureEnglish: false,
	},
});

const sectionHeaderSubtitleVariants = cva(
	"justify-start text-hbc-gray-300 text-12px font-semibold leading-200% tracking-012px",
	{
		variants: {
			isPureEnglish: {
				true: "font-suisse",
				false: "font-suit",
			},
		},
	},
);

interface GoToLink {
	label: string;
	href: string;
}

export interface SectionHeaderProps extends Omit<VariantProps<typeof sectionHeaderTitleVariants>, "isPureEnglish"> {
	title: string;
	subtitle?: string;
	goTo?: GoToLink;
}

export const SectionHeader = ({ title, subtitle, goTo, size }: SectionHeaderProps) => {
	const isTitlePureEnglish = checkIsPureEnglish(title);
	const isSubtitlePureEnglish = !!subtitle && checkIsPureEnglish(subtitle);
	const isGoToLabelPureEnglish = !!goTo && checkIsPureEnglish(goTo.label);
	const isGoToLink = !!goTo && "href" in goTo;

	return (
		<div className={cn(sectionHeaderVariants({ size }))}>
			<div className="inline-flex items-end justify-between w-full">
				<div className="flex items-end justify-start gap-10px pl-2px">
					<div
						className={cn(
							sectionHeaderTitleVariants({
								size,
								isPureEnglish: isTitlePureEnglish,
							}),
						)}
					>
						{title}
					</div>
					{subtitle && (
						<div
							className={cn(
								sectionHeaderSubtitleVariants({
									isPureEnglish: isSubtitlePureEnglish,
								}),
							)}
						>
							{subtitle}
						</div>
					)}
				</div>
				{goTo && (
					<div className="flex items-center justify-center py-2px">
						<Link
							className={cn(
								"justify-start text-12px font-semibold leading-150% tracking-012px text-right text-black",
								isGoToLabelPureEnglish ? "font-suisse" : "font-suit",
							)}
							href={goTo.href}
						>
							{goTo.label}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
