import type { ImageLoader, ImageLoaderProps } from "next/image";
// NextJS Image Loader

const ALLOWED_IMAGE_HOSTS = [
	"https://prod-assets.hitbeatclub.com",
	"https://dev-assets.hitbeatclub.com",
	"https://staging-assets.hitbeatclub.com",
];

// CloudFront 또는 S3 URL에 대한 최적화 파라미터를 추가하는 함수
const addOptimizationParams = (url: string, width: number, quality?: number): string => {
	const separator = url.includes("?") ? "&" : "?";
	return `${url}${separator}w=${width}&q=${quality || 75}`;
};

// URL이 S3나 CloudFront URL인지 확인하는 함수
const isOptimizableUrl = (src: string): boolean => {
	return (
		ALLOWED_IMAGE_HOSTS.some((host) => src.startsWith(host)) || src.includes(".s3.") || src.includes("cloudfront.net")
	);
};

export const assetImageLoader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
	// 허용된 호스트나 AWS 리소스인 경우 최적화 파라미터 추가
	if (isOptimizableUrl(src)) {
		return addOptimizationParams(src, width, quality);
	}

	// 그 외의 경우 원본 URL 반환
	return src;
};
