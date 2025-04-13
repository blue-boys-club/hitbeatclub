import localFont from "next/font/local";

export const suisse = localFont({
	src: [
		{
			path: "../../../public/fonts/suisse/SuisseIntl-Regular-WebXL.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../../public/fonts/suisse/SuisseIntl-Book-WebXL.woff2",
			weight: "450",
			style: "normal",
		},
		{
			path: "../../../public/fonts/suisse/SuisseIntl-Medium-WebXL.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../../public/fonts/suisse/SuisseIntl-SemiBold-WebXL.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../../public/fonts/suisse/SuisseIntl-Bold-WebXL.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-hbc-suisse",
	display: "swap",
});
