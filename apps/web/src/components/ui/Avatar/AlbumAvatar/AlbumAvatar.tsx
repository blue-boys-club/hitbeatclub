"use client";

import { cn } from "@/common/utils";
import { HTMLAttributes, memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetImageLoader } from "@/common/utils/image-loader";
import { StaticImageData } from "next/image";

export interface AlbumAvatarProps extends HTMLAttributes<HTMLImageElement> {
	src: string | StaticImageData;
	alt?: string;
	wrapperClassName?: string;
	isPlaying?: boolean;
}

export const AlbumAvatar = memo(function AlbumAvatar({
	src,
	alt = "Album avatar",
	className,
	wrapperClassName,
	isPlaying = false,
	...props
}: AlbumAvatarProps) {
	const rotateRef = useRef<HTMLDivElement>(null);
	const [currentRotation, setCurrentRotation] = useState(0);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const rotateElement = rotateRef.current;
		if (!rotateElement) return;

		if (isPlaying) {
			// 재생 시작 - 연속적인 회전 애니메이션
			rotateElement.style.transition = "none";
			const startTime = performance.now();
			const initialRotation = currentRotation;

			const animate = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const rotationSpeed = 360 / 3000; // 3초에 360도
				const newRotation = (initialRotation + elapsed * rotationSpeed) % 360;

				setCurrentRotation(newRotation);
				rotateElement.style.transform = `rotate(${newRotation}deg)`;

				animationRef.current = requestAnimationFrame(animate);
			};

			animationRef.current = requestAnimationFrame(animate);
		} else {
			// 일시정지 - 현재 위치에서 서서히 멈춤
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}

			// 현재 회전 위치 유지하면서 transition 적용
			rotateElement.style.transition = "transform 0.8s ease-out";
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isPlaying]);
	return (
		<div
			className={cn(
				// image 192x192 + border 10px*2
				"relative w-[212px] h-[212px]",
				wrapperClassName,
			)}
			{...props}
			data-testid="album-avatar-wrapper"
		>
			<div
				className="absolute rounded-full w-[212px] h-[212px] border-[10px] border-black"
				data-testid="album-avatar-border"
			/>
			{/* 중앙 정렬용 컨테이너 */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]">
				{/* 회전용 컨테이너 */}
				<div
					ref={rotateRef}
					className="w-full h-full origin-center"
				>
					<Image
						src={src}
						alt={alt}
						className={cn(
							"rounded-full w-[200px] h-[200px] object-cover aspect-square border-[4px] border-dashed border-white",
							className,
						)}
						// image width * 4
						width={768}
						height={768}
						loading="lazy"
						data-testid="album-avatar-image"
						loader={assetImageLoader}
					/>
				</div>
			</div>
		</div>
	);
});

AlbumAvatar.displayName = "AlbumAvatar";
