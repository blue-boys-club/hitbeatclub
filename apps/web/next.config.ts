import type { NextConfig } from "next";

const IS_DEV = process.env.NODE_ENV === "development";
const nextConfig: NextConfig = {
	compiler: !IS_DEV
		? {
				reactRemoveProperties: { properties: ["^data-testid$"] },
			}
		: {},
	images: {
		// placeholder images
		remotePatterns: [
			new URL("https://placehold.co/**"),
			new URL("https://prod-assets.hitbeatclub.com/**"),
			new URL("https://staging-assets.hitbeatclub.com/**"),
			new URL("https://dev-assets.hitbeatclub.com/**"),
			new URL("https://prod-hitbeatclub-assets.s3.ap-northeast-2.amazonaws.com/**"),
		],
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
