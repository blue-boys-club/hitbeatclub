import { withThemeByClassName } from "@storybook/addon-themes";
import { initialize as mswInitialize, mswLoader } from "msw-storybook-addon";
import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import { storyFontDecorator, storyQueryDecorator } from "./decorators";

mswInitialize();

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},

	decorators: [
		withThemeByClassName({
			themes: {
				light: "",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
		storyFontDecorator,
		storyQueryDecorator,
	],
	loaders: [mswLoader],
};

export default preview;
