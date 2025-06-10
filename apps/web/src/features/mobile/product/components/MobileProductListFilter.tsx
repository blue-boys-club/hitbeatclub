import { Check } from "@/assets/svgs/Check";
import { X } from "@/assets/svgs/X";
import { MobileFilterButton } from "@/components/ui/MobileFilterButton";
import { Slider } from "@/components/ui/Slider";
import { useState, useEffect } from "react";

interface MobileProductListFilterProps {
	onClose: () => void;
}

export const MobileProductListFilter = ({ onClose }: MobileProductListFilterProps) => {
	const [bpmRange, setBpmRange] = useState<number[]>([0, 200]);

	// body 스크롤 비활성화 처리
	useEffect(() => {
		// 이전 스크롤 위치와 스타일 저장
		const originalStyle = window.getComputedStyle(document.body).overflow;
		const scrollY = window.scrollY;

		// body 스크롤 비활성화
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";

		return () => {
			// 컴포넌트 언마운트 시 원래 상태로 복원
			document.body.style.overflow = originalStyle;
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			window.scrollTo(0, scrollY);
		};
	}, []);

	return (
		<div className="px-4 py-4 fixed top-0 left-0 right-0 bottom-0 z-[100] flex flex-col justify-between overflow-y-auto bg-black/85 backdrop-filter backdrop-blur-sm">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<div className="w-full h-4px bg-white" />
					<span className="font-suisse text-22px leading-86% font-semibold text-white">FILTER</span>
					<div className="w-full h-4px bg-white" />
				</div>
				<div className="space-y-22px">
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">정렬 Sort</span>
						<div className="flex gap-6px flex-wrap">
							<MobileFilterButton>Recent</MobileFilterButton>
							<MobileFilterButton>A to Z</MobileFilterButton>
							<MobileFilterButton>Popular</MobileFilterButton>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex justify-between">
							<span className="font-suit text-xs text-white">BPM</span>
							<div className="flex items-center gap-7px">
								<SliderInput value={bpmRange[0] ?? 0} />
								<div className="w-8px h-1px bg-white" />
								<SliderInput value={bpmRange[1] ?? 200} />
							</div>
						</div>
						<Slider
							value={bpmRange}
							min={0}
							max={200}
							onValueChange={(value) => {
								setBpmRange(value);
							}}
						/>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">장르 Genre</span>
						<div className="flex gap-6px flex-wrap">
							{Array.from({ length: 18 }).map((_, index) => (
								<MobileFilterButton key={index}>Genre {index + 1}</MobileFilterButton>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">키 Key</span>
						<div className="flex flex-col gap-2">
							<div className="flex gap-72px">
								<div className="flex gap-6px">
									<MobileFilterButton>Sharp</MobileFilterButton>
									<MobileFilterButton>Flat</MobileFilterButton>
								</div>
								<div className="flex gap-6px">
									<MobileFilterButton>Major</MobileFilterButton>
									<MobileFilterButton>Minor</MobileFilterButton>
								</div>
							</div>
							<div className="flex gap-6px flex-wrap">
								<MobileFilterButton>C</MobileFilterButton>
								<MobileFilterButton>C#</MobileFilterButton>
								<MobileFilterButton>D</MobileFilterButton>
								<MobileFilterButton>D#</MobileFilterButton>
								<MobileFilterButton>E</MobileFilterButton>
								<MobileFilterButton>F</MobileFilterButton>
								<MobileFilterButton>F#</MobileFilterButton>
								<MobileFilterButton>G</MobileFilterButton>
								<MobileFilterButton>G#</MobileFilterButton>
								<MobileFilterButton>A</MobileFilterButton>
								<MobileFilterButton>A#</MobileFilterButton>
								<MobileFilterButton>B</MobileFilterButton>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-suit text-xs text-white">태그 Tags</span>
						<div className="flex gap-6px flex-wrap">
							{Array.from({ length: 18 }).map((_, index) => (
								<MobileFilterButton key={index}>Tag {index + 1}</MobileFilterButton>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex gap-1 mt-100px">
				<button className="flex-1 bg-white text-black flex justify-center items-center rounded-5px h-29px">
					<Check />
				</button>
				<button
					onClick={onClose}
					className="flex-1 bg-white text-black flex justify-center items-center rounded-5px h-29px"
				>
					<X />
				</button>
			</div>
		</div>
	);
};

const SliderInput = ({ value }: { value: number }) => {
	return (
		<input
			className="text-center text-10px text-white leading-86% w-8 h-15px border border-white rounded-5px"
			readOnly
			value={value}
		/>
	);
};
