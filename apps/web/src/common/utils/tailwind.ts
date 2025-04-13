import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// TODO: Customize tailwind merge
export const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			color: [
				"hbc-blue",
				"hbc-red",
				"hbc-black",
				"hbc-white",
				"hbc-gray-400",
				"hbc-gray-300",
				"hbc-gray-200",
				"hbc-gray-100",
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
