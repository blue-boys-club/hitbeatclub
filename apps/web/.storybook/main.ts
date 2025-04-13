import type { StorybookConfig } from "@storybook/nextjs";
import { join, dirname } from "path";
import { createRequire } from "module"; // ESM 환경에서 require 사용을 위한 import

const require = createRequire(import.meta.url);

/**
 * 이 함수는 Yarn PnP 또는 monorepo 환경에서 패키지의 절대 경로를 확인하기 위해 사용됩니다.
 */
function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@storybook/addon-onboarding"),
		getAbsolutePath("@storybook/addon-interactions"),
		getAbsolutePath("@storybook/addon-styling-webpack"),
		getAbsolutePath("@storybook/addon-themes"),
	],
	framework: {
		name: getAbsolutePath("@storybook/nextjs"),
		options: {},
	},
	staticDirs: [
		{
			from: "../public",
			to: "/public",
		},
	],
};

export default config;
