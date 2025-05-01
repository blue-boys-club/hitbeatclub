import AuthLayoutPage from "@/page/AuthLayoutPage";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AuthLayoutPage>{children}</AuthLayoutPage>;
}
