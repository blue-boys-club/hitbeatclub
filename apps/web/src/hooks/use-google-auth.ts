import { useTemporaryStore } from "@/stores/temp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useScript } from "usehooks-ts";
import { useShallow } from "zustand/react/shallow";

const GOOGLE_SCOPES = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
];

export const useGoogleAuth = () => {
	const router = useRouter();
	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setGoogleAuth } = useTemporaryStore(
		useShallow((state) => ({
			setGoogleAuth: state.setGoogleAuth,
		})),
	);

	const scriptStatus = useScript("https://accounts.google.com/gsi/client", {
		removeOnUnmount: false,
	});

	useEffect(() => {
		if (scriptStatus === "ready" && window.google) {
			setIsReady(true);
		}
	}, [scriptStatus]);

	const handleGoogleLogin = useCallback(() => {
		setIsLoading(true);
		setError(null);
		if (scriptStatus === "ready" && window.google) {
			const client = window.google?.accounts.oauth2.initCodeClient({
				client_id: process.env.NEXT_PUBLIC_AUTH_SOCIAL_GOOGLE_CLIENT_ID || "",
				scope: GOOGLE_SCOPES.join(" "),
				redirect_uri: `${window.location.origin}/auth/google/callback`,
				callback: (response) => {
					try {
						if (response && response.code) {
							setGoogleAuth(response.code);
							router.push(`/auth/google/callback`);
						}
					} catch (error) {
						console.error(error);
						setError("Google 로그인 실패");
						setIsLoading(false);
					}
				},
			});

			client.requestCode();
		} else {
			setError("Google 로그인 준비가 아직 안됐어요.");
			setIsLoading(false);
		}
	}, [scriptStatus, router, setGoogleAuth]);

	return { isReady, isLoading, error, handleGoogleLogin };
};
