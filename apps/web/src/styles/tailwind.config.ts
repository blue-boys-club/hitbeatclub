// ONLY FOR PROGRAMMATICALLY GENERATED TAILWIND CSS

const pxToRem = (px: number, base: number = 16) => `${px / base}rem`;

const generatePxToRemRange = (max: number, min: number = 0, step: number = 1) =>
	Object.fromEntries(
		Array.from({ length: max - min + 1 }, (_, i) => [`${min + i * step}px`, pxToRem(min + i * step)])
			// escape dots with empty string
			.map(([key, value]) => [key?.replace(".", ""), value]),
	);

const px0_10 = generatePxToRemRange(10);
const px0_100 = generatePxToRemRange(100);
const px0_200 = generatePxToRemRange(200);
const px0_500 = generatePxToRemRange(500);
const px500_1000_10 = generatePxToRemRange(1000, 500, 10);

const px0d00_100d00 = generatePxToRemRange(100, 0, 0.01);

const percentage0_200 = Object.fromEntries(Array.from({ length: 200 }, (_, i) => [`${i}%`, `${i}%`]));

/**
 * @type {import('tailwindcss').Config}
 */
const config = {
	theme: {
		extend: {
			borderWidth: px0_10,
			fontSize: px0_100,
			lineHeight: px0_100,
			spacing: px0_500,
			leading: {
				...px0d00_100d00,
				...percentage0_200,
			},
			tracking: {
				...px0d00_100d00,
				...percentage0_200,
			},
			radius: px0_200,

			// it is `containers` as respecting old tailwind config
			containers: {
				...px0_500,
				...px500_1000_10,
			},

			// Mobile Player Animations
			animation: {
				slideUp: "slideUp 150ms ease-out forwards",
				slideDown: "slideDown 150ms ease-out forwards",
				marquee: "marquee var(--marquee-duration, 8s) linear infinite",
			},
			keyframes: {
				slideUp: {
					from: { transform: "translateY(100%)" },
					to: { transform: "translateY(0)" },
				},
				slideDown: {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(100%)" },
				},
				marquee: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(var(--scroll-distance, -50%))" },
				},
			},
		},
	},
};

export default config;
