import { redirect } from "next/navigation";

export default function AuthLayoutPage() {
	redirect("/auth/login");
}
