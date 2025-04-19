import { config as baseConfig } from "@hitbeatclub/eslint-config/next-js";
import storybook from "eslint-plugin-storybook";

/** @type {import("eslint").Linter.Config[]} */
const config = [...baseConfig, ...storybook.configs["flat/recommended"]];

export default config;
