import localFont from "next/font/local";

export const suisse = localFont({
  src: [
    {
      path: "./SuisseIntl-Regular-WebXL.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./SuisseIntl-Book-WebXL.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "./SuisseIntl-Medium-WebXL.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./SuisseIntl-SemiBold-WebXL.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./SuisseIntl-Bold-WebXL.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-suisse",
  display: "swap",
});
