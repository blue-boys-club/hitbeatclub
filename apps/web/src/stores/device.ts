import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type PreferredLayout = "auto" | "mobile" | "pc";

interface DevicePreferenceState {
	/** 사용자가 선호하는 레이아웃 종류. auto 는 화면 크기에 따라 자동 전환 */
	preferredLayout: PreferredLayout;
}

interface DevicePreferenceActions {
	/** 선호 레이아웃을 설정한다 */
	setPreferredLayout: (layout: PreferredLayout) => void;
}

export type DevicePreferenceStore = DevicePreferenceState & DevicePreferenceActions;

const initialState: DevicePreferenceState = {
	preferredLayout: "auto",
};

/**
 * DevicePreferenceStore
 * - preferredLayout 값을 localStorage 에 저장하여 새로고침/재방문 시 유지
 */
export const useDevicePreferenceStore = create<DevicePreferenceStore>()(
	devtools(
		persist(
			(set) => ({
				...initialState,

				setPreferredLayout: (layout) => set({ preferredLayout: layout }),
			}),
			{
				name: "DevicePreferenceStore",
				// 현재는 preferredLayout 값만 저장하면 되므로 partialize 는 생략
			},
		),
	),
);
