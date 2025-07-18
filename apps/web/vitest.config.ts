import { coverageConfigDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		css: true,

		setupFiles: ["./vitest.setup.tsx"],

		coverage: {
			enabled: true,
			exclude: [
				...coverageConfigDefaults.exclude,
				"*.config.mjs",
				"*.config.js",
				"*.config.ts",

				// style/font definition
				"src/styles/**/*.css",
				"src/styles/**/*.ts",

				"**/.storybook/**",
				// 👇 This pattern must align with the `stories` property of your `.storybook/main.ts` config
				"**/*.stories.*",
				// 👇 This pattern must align with the output directory of `storybook build`
				"**/storybook-static/**",
			],
		},
	},
});
