import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		types: "src/types.ts",
		"country-options": "src/country-options.ts",
		"region-options": "src/region-options.ts",
		"country-names-ko": "src/country-names-ko.ts",
		"country-names-en": "src/country-names-en.ts",
		"region-utils": "src/region-utils.ts",
		"country-utils": "src/country-utils.ts",
		"alpha3-to-alpha2": "src/alpha3-to-alpha2.ts",
	},
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	treeshake: true,
	minify: true,
	external: [],
});
