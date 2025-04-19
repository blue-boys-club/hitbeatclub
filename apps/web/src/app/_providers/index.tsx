import QueryProvider from "./query";

export default function Providers({ children }: { children: React.ReactNode }) {
	return <QueryProvider>{children}</QueryProvider>;
}
