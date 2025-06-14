import { useAuthStore } from "@/stores/auth";
import JSONBig from "json-bigint";
import axios, {
	type InternalAxiosRequestConfig,
	// type AxiosResponse,
	type AxiosError,
	// type AxiosRequestHeaders,
} from "axios";
import { getQueryClient } from "./query-client";
import { QUERY_KEYS } from "./query-keys";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean; // Make it optional
}

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	paramsSerializer: { indexes: null },

	transformResponse: <T>(data: string): T => {
		try {
			return JSONBig.parse(data) as T;
		} catch (error) {
			console.error("Error parsing JSON response:", error);
			return data as T;
		}
	},

	// TODO: Implement withCredentials with httpOnly cookie
	// withCredentials: true,
});

// Handling 401 Error for Refresh Token
// TODO: Implement refreshAccessToken function
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// const token = await refreshAccessToken();
			// axios.defaults.headers.common["Authorization"] = "Bearer " + token;

			return axiosInstance(originalRequest);
		}

		// users/me 요청에서 에러가 발생하면 분기 처리

		// 404: 유저 정보 없음
		if (originalRequest.url === "/users/me") {
			const logout = () => {
				const authStore = useAuthStore.getState();
				authStore.makeLogout();

				const queryClient = getQueryClient();
				void queryClient.invalidateQueries({ queryKey: QUERY_KEYS._root });

				// going to root

				console.log("going to root");
				window.location.href = "/";
				window.location.reload();
			};

			if (error.response?.status === 404) {
				const errorResponse = error.response.data as { code: number };

				// 404 1301: 유저 정보 없음 - 회원 탈퇴
				if (errorResponse.code === 1301) {
					logout();
				}
			}

			// 401: 토큰 만료
			if (error.response?.status === 401) {
				logout();
			}
		}

		return Promise.reject(error);
	},
);

// Implementing Request Interceptor
axiosInstance.interceptors.request.use(
	(config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
		// 디버그 환경에서 토큰과 워크스페이스 id가 있는 경우 설정
		const debugAccessToken = process.env.NEXT_PUBLIC_DEBUG_ACCESS_TOKEN;

		if (debugAccessToken) {
			if (!config.headers.Authorization) {
				config.headers.Authorization = `Bearer ${debugAccessToken}`;
			}

			return config;
		}

		// 인증 환경에서 토큰과 워크스페이스 id가 있는 경우 설정
		const authStore = useAuthStore.getState();
		const user = authStore.user;

		// 요청 헤더에 토큰이 없으면 기본 토큰 추가
		if (!config.headers.Authorization && user?.accessToken) {
			config.headers.Authorization = `Bearer ${user.accessToken}`;
		}

		return config;
	},
	(error: AxiosError): Promise<AxiosError> => {
		// 요청 오류가 발생한 경우 처리
		return Promise.reject(error);
	},
);

export default axiosInstance;
