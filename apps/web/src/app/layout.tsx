import type { Metadata } from "next";
import { fontSuit, fontSuisse } from "@/styles/font";
import "@/styles/globals.css";
import { cn } from "@/common/utils/tailwind";
import Providers from "./_providers";

export const metadata: Metadata = {
	title: "HitBeatClub",
	description: "HitBeatClub",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={cn(fontSuit.variable, fontSuisse.variable, "antialiased")}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
