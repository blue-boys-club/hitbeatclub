import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const postfix = "px";
const px0_100 = Array.from({ length: 100 }, (_, i) => `${i}${postfix}`);
const px0_200 = Array.from({ length: 200 }, (_, i) => `${i}${postfix}`);
const px0_500 = Array.from({ length: 500 }, (_, i) => `${i}${postfix}`);
const px0_00_100_00 = Array.from({ length: 100 * 100 }, (_, i) => `${i / 100}${postfix}`.replace(".", ""));

const percentage0_100 = Array.from({ length: 100 }, (_, i) => `${i}%`);

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
				"hbc-gray",
			],
			spacing: [...px0_500],
			text: [...px0_100.map((size) => `text-${size}`)],
			tracking: [...px0_00_100_00, ...percentage0_100],
			leading: [...px0_00_100_00, ...percentage0_100],
			radius: [...px0_200],

			container: [...px0_500, "sidebar-expanded"],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
