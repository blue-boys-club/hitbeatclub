import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"user/index": "src/user/index.ts",
		"artist/index": "src/artist/index.ts",
		"product/index": "src/product/index.ts",
		"order/index": "src/order/index.ts",
		"auth/index": "src/auth/index.ts",
		"common/index": "src/common/index.ts",
		"subscribe/index": "src/subscribe/index.ts",
		"file/index": "src/file/index.ts",
		"settlement/index": "src/settlement/index.ts",
	},
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	treeshake: true,
	minify: false,
	external: ["zod"],
});
