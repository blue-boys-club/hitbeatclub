import type { ImageLoader, ImageLoaderProps } from "next/image";
// NextJS Image Loader

const ALLOWED_IMAGE_HOSTS = [
	"https://prod-assets.hitbeatclub.com",
	"https://dev-assets.hitbeatclub.com",
	"https://staging-assets.hitbeatclub.com",
];

export const assetImageLoader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
	for (const host of ALLOWED_IMAGE_HOSTS) {
		if (src.startsWith(host)) {
			return `${src}?w=${width}&q=${quality || 75}`;
		}
	}

	return src;
};
