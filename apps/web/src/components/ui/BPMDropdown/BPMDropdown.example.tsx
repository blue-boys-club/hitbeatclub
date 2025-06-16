import { useState } from "react";
import { BPMDropdown } from "./BPMDropdown";

/**
 * BPMDropdown 사용 예시
 *
 * 1. 기본 사용법 (내장 트리거)
 * 2. 커스텀 트리거 사용 (asChild + children)
 * 3. Render Prop 패턴 (children as function)
 * 4. Render Prop + asChild 조합
 */

export const BPMDropdownExamples = () => {
	// 상태 관리 - 실제 BPMDropdown 인터페이스에 맞게 수정
	const [minBpm, setMinBpm] = useState<number | undefined>(undefined);
	const [maxBpm, setMaxBpm] = useState<number | undefined>(undefined);

	// 핸들러들 - 실제 인터페이스 기준
	const handleChangeMinBpm = (bpm: number) => {
		setMinBpm(bpm);
	};

	const handleChangeMaxBpm = (bpm: number) => {
		setMaxBpm(bpm);
	};

	const handleClear = () => {
		setMinBpm(undefined);
		setMaxBpm(undefined);
	};

	// 선택사항: onSubmit 핸들러 (드롭다운 닫힐 때 한 번에 처리)
	const handleSubmit = (newMinBpm: number | undefined, newMaxBpm: number | undefined) => {
		setMinBpm(newMinBpm);
		setMaxBpm(newMaxBpm);
		console.log("BPM 제출:", { min: newMinBpm, max: newMaxBpm });
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
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
							onClear={handleClear}
						/>
					</div>
				</div>

				{/* 커스텀 트리거 사용 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">2. 커스텀 트리거 (asChild)</h3>
					<div className="w-80">
						<BPMDropdown
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
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
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
							onClear={handleClear}
						>
							{({ currentValue, isOpen }) => (
								<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-sm">{currentValue || "BPM 미설정"}</div>
											<div className="text-xs text-gray-500">상태: {isOpen ? "열림" : "닫힌"}</div>
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
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
							onClear={handleClear}
							asChild
						>
							{({ currentValue, isOpen }) => (
								<button className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg">
									<div className="flex flex-col items-center">
										<div className="text-lg font-bold">🎼 {currentValue || "BPM 설정"}</div>
										<div className="text-sm opacity-90">{isOpen ? "설정 중..." : "클릭하여 설정"}</div>
									</div>
								</button>
							)}
						</BPMDropdown>
					</div>
				</div>

				{/* 카드 스타일 Render Prop */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">5. 카드 스타일 Render Prop</h3>
					<div className="w-80">
						<BPMDropdown
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
							onClear={handleClear}
						>
							{({ currentValue, isOpen }) => (
								<div className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold text-gray-900">BPM 설정</h4>
										<div
											className={`text-xs px-2 py-1 rounded-full ${
												isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
											}`}
										>
											{isOpen ? "열림" : "닫힌"}
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-800 mb-1">{currentValue || "미설정"}</div>
									<div className="flex items-center justify-between text-sm text-gray-500">
										<span>BPM 범위 또는 정확한 값</span>
										<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
									</div>
								</div>
							)}
						</BPMDropdown>
					</div>
				</div>

				{/* onSubmit 사용 예시 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">6. onSubmit 핸들러 사용</h3>
					<div className="w-80">
						<BPMDropdown
							minBpm={minBpm}
							maxBpm={maxBpm}
							onChangeMinBpm={handleChangeMinBpm}
							onChangeMaxBpm={handleChangeMaxBpm}
							onClear={handleClear}
							onSubmit={handleSubmit}
						>
							{({ currentValue, isOpen }) => (
								<div className="cursor-pointer p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-sm text-yellow-800">{currentValue || "BPM을 설정하세요"}</div>
											<div className="text-xs text-yellow-600">{isOpen ? "설정 중..." : "onSubmit으로 처리"}</div>
										</div>
										<div className="text-yellow-600">{isOpen ? "⚡" : "⚙️"}</div>
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
						<div>Min BPM: {minBpm ?? "없음"}</div>
						<div>Max BPM: {maxBpm ?? "없음"}</div>
						<div>
							표시 텍스트:{" "}
							{minBpm === undefined && maxBpm === undefined
								? "미설정"
								: minBpm !== undefined && maxBpm !== undefined && minBpm === maxBpm
									? minBpm.toString()
									: minBpm !== undefined && maxBpm !== undefined
										? `${minBpm} - ${maxBpm}`
										: minBpm !== undefined
											? `${minBpm} - `
											: maxBpm !== undefined
												? ` - ${maxBpm}`
												: "미설정"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
