import type { NextConfig } from "next";

const IS_DEV = process.env.NODE_ENV === "development";
const nextConfig: NextConfig = {
	compiler: !IS_DEV
		? {
				reactRemoveProperties: { properties: ["^data-testid$"] },
			}
		: {},
		images: {
			domains: [
			  'placehold.co',    
		],
	},
};

export default nextConfig;
