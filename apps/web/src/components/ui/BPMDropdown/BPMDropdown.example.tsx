import { useState } from "react";
import { BPMDropdown, BPM, BPMRange } from "./BPMDropdown";

/**
 * BPMDropdown 사용 예시
 *
 * 1. 기본 사용법 (내장 트리거)
 * 2. 커스텀 트리거 사용 (asChild + children)
 * 3. Render Prop 패턴 (children as function)
 * 4. Render Prop + asChild 조합
 */

export const BPMDropdownExamples = () => {
	// 상태 관리
	const [bpmType, setBpmType] = useState<"exact" | "range">("exact");
	const [bpmValue, setBpmValue] = useState<BPM>(undefined);
	const [bpmRangeValue, setBpmRangeValue] = useState<BPMRange>(undefined);

	// 핸들러들
	const handleChangeBPMType = (type: "exact" | "range") => {
		setBpmType(type);
	};

	const handleChangeExactBPM = (bpm: number) => {
		setBpmValue(bpm === 0 ? undefined : bpm);
	};

	const handleChangeBPMRange = (type: "min" | "max", bpm: number) => {
		setBpmRangeValue((prev) => ({
			...prev,
			[type]: bpm === 0 ? undefined : bpm,
		}));
	};

	const handleClear = () => {
		setBpmValue(undefined);
		setBpmRangeValue({ min: undefined, max: undefined });
	};

	return (
		<div className="p-8 space-y-8">
			<div>
				<h2 className="text-xl font-bold mb-4">BPM Dropdown 사용 예시</h2>

				{/* 기본 트리거 사용 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">1. 기본 트리거</h3>
					<div className="w-80">
						<BPMDropdown
							bpmType={bpmType}
							bpmValue={bpmValue}
							bpmRangeValue={bpmRangeValue}
							onChangeBPMType={handleChangeBPMType}
							onChangeExactBPM={handleChangeExactBPM}
							onChangeBPMRange={handleChangeBPMRange}
							onClear={handleClear}
						/>
					</div>
				</div>

				{/* 커스텀 트리거 사용 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">2. 커스텀 트리거 (asChild)</h3>
					<div className="w-80">
						<BPMDropdown
							bpmType={bpmType}
							bpmValue={bpmValue}
							bpmRangeValue={bpmRangeValue}
							onChangeBPMType={handleChangeBPMType}
							onChangeExactBPM={handleChangeExactBPM}
							onChangeBPMRange={handleChangeBPMRange}
							onClear={handleClear}
							asChild
						>
							<button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
								🎵 BPM 선택하기
							</button>
						</BPMDropdown>
					</div>
				</div>

				{/* Render Prop 패턴 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">3. Render Prop 패턴 (children as function)</h3>
					<div className="w-80">
						<BPMDropdown
							bpmType={bpmType}
							bpmValue={bpmValue}
							bpmRangeValue={bpmRangeValue}
							onChangeBPMType={handleChangeBPMType}
							onChangeExactBPM={handleChangeExactBPM}
							onChangeBPMRange={handleChangeBPMRange}
							onClear={handleClear}
						>
							{({ currentValue, isOpen, bpmType }) => (
								<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-sm">{currentValue || "BPM 미설정"}</div>
											<div className="text-xs text-gray-500">Type: {bpmType}</div>
										</div>
										<div className="text-xl">{isOpen ? "🔼" : "🔽"}</div>
									</div>
								</div>
							)}
						</BPMDropdown>
					</div>
				</div>

				{/* Render Prop + asChild */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">4. Render Prop + asChild 조합</h3>
					<div className="w-80">
						<BPMDropdown
							bpmType={bpmType}
							bpmValue={bpmValue}
							bpmRangeValue={bpmRangeValue}
							onChangeBPMType={handleChangeBPMType}
							onChangeExactBPM={handleChangeExactBPM}
							onChangeBPMRange={handleChangeBPMRange}
							onClear={handleClear}
							asChild
						>
							{({ currentValue, isOpen, bpmType, bpmValue, bpmRangeValue }) => (
								<button className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg">
									<div className="flex flex-col items-center">
										<div className="text-lg font-bold">🎼 {currentValue || "BPM 설정"}</div>
										<div className="text-sm opacity-90">
											{bpmType === "exact" ? "정확한 BPM" : "BPM 범위"}
											{isOpen && " (열림)"}
										</div>
										{/* 상세 정보도 접근 가능 */}
										{bpmType === "exact" && bpmValue && <div className="text-xs opacity-75">정확히 {bpmValue} BPM</div>}
										{bpmType === "range" && bpmRangeValue && (
											<div className="text-xs opacity-75">
												{bpmRangeValue.min} ~ {bpmRangeValue.max} BPM
											</div>
										)}
									</div>
								</button>
							)}
						</BPMDropdown>
					</div>
				</div>

				{/* 다른 스타일 커스텀 트리거 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">5. 카드 스타일 Render Prop</h3>
					<div className="w-80">
						<BPMDropdown
							bpmType={bpmType}
							bpmValue={bpmValue}
							bpmRangeValue={bpmRangeValue}
							onChangeBPMType={handleChangeBPMType}
							onChangeExactBPM={handleChangeExactBPM}
							onChangeBPMRange={handleChangeBPMRange}
							onClear={handleClear}
						>
							{({ currentValue, isOpen, bpmType, bpmValue, bpmRangeValue }) => (
								<div className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold text-gray-900">BPM 설정</h4>
										<div
											className={`text-xs px-2 py-1 rounded-full ${
												bpmType === "exact" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
											}`}
										>
											{bpmType === "exact" ? "정확" : "범위"}
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-800 mb-1">{currentValue || "미설정"}</div>
									<div className="flex items-center justify-between text-sm text-gray-500">
										<span>{bpmType === "exact" ? "정확한 BPM 값" : "BPM 범위 설정"}</span>
										<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
									</div>
								</div>
							)}
						</BPMDropdown>
					</div>
				</div>

				{/* 현재 값 표시 */}
				<div className="mt-8 p-4 bg-gray-100 rounded-lg">
					<h4 className="font-medium mb-2">현재 선택된 값:</h4>
					<div className="text-sm space-y-1">
						<div>BPM Type: {bpmType}</div>
						<div>Exact BPM: {bpmValue ?? "없음"}</div>
						<div>
							BPM Range: {bpmRangeValue?.min ?? "없음"} - {bpmRangeValue?.max ?? "없음"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
