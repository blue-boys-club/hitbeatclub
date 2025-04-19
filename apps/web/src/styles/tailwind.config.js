// ONLY FOR PROGRAMMATICALLY GENERATED TAILWIND CSS

const pxToRem = (px, base = 16) => `${px / base}rem`;

const generatePxToRemRange = (max, min = 0, step = 1) =>
	Object.fromEntries(
		Array.from({ length: max - min + 1 }, (_, i) => [`${min + i * step}px`, pxToRem(min + i * step)])
			// escape dots with _
			.map(([key, value]) => [key.replace(".", "_"), value]),
	);

const px0_10 = generatePxToRemRange(10);
const px0_100 = generatePxToRemRange(100);
const px0_200 = generatePxToRemRange(200);
const px0_500 = generatePxToRemRange(500);

const px0d00_100d00 = generatePxToRemRange(100, 0, 0.01);

const percentage0_100 = Array.from({ length: 100 }, (_, i) => `${i}%`);

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
				...percentage0_100,
			},
			tracking: {
				...px0d00_100d00,
				...percentage0_100,
			},
			radius: px0_200,

			// it is `containers` as respecting old tailwind config
			containers: {
				...px0_500,
			},
		},
	},
};

export default config;
