import { useState } from "react";
import { KeyDropdown, KeyValue } from "./KeyDropdown";

/**
 * KeyDropdown 사용 예시
 *
 * 1. 기본 사용법 (내장 트리거)
 * 2. 커스텀 트리거 사용 (asChild + children)
 * 3. Render Prop 패턴 (children as function)
 * 4. Render Prop + asChild 조합
 */

export const KeyDropdownExamples = () => {
	// 상태 관리
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>();
	const [scaleValue, setScaleValue] = useState<string | null>(null);

	// 핸들러들
	const handleChangeKey = (key: KeyValue) => {
		setKeyValue(key);
	};

	const handleChangeScale = (scale: string) => {
		setScaleValue(scale);
	};

	const handleClear = () => {
		setKeyValue(undefined);
		setScaleValue(null);
	};

	return (
		<div className="p-8 space-y-8">
			<div>
				<h2 className="text-xl font-bold mb-4">Key Dropdown 사용 예시</h2>

				{/* 기본 트리거 사용 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">1. 기본 트리거</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
						/>
					</div>
				</div>

				{/* 커스텀 트리거 사용 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">2. 커스텀 트리거 (asChild)</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
							asChild
						>
							<button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
								🎹 Key 선택하기
							</button>
						</KeyDropdown>
					</div>
				</div>

				{/* Render Prop 패턴 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">3. Render Prop 패턴 (children as function)</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
						>
							{({ currentValue, isOpen, keyValue, scaleValue, activeTab }) => (
								<div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-sm">{currentValue || "Key 미설정"}</div>
											<div className="text-xs text-gray-500">
												Tab: {activeTab}
												{keyValue && ` | Key: ${keyValue.label}`}
												{scaleValue && ` | Scale: ${scaleValue}`}
											</div>
										</div>
										<div className="text-xl">{isOpen ? "🔼" : "🔽"}</div>
									</div>
								</div>
							)}
						</KeyDropdown>
					</div>
				</div>

				{/* Render Prop + asChild */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">4. Render Prop + asChild 조합</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
							asChild
						>
							{({ currentValue, isOpen, keyValue, scaleValue, activeTab }) => (
								<button className="w-full p-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 shadow-lg">
									<div className="flex flex-col items-center">
										<div className="text-lg font-bold">🎼 {currentValue || "Key 설정"}</div>
										<div className="text-sm opacity-90">
											{keyValue && scaleValue
												? `${keyValue.label} ${scaleValue} 선택됨`
												: keyValue
													? `${keyValue.label} (scale 선택 필요)`
													: "음악 키 선택"}
											{isOpen && " (열림)"}
										</div>
										{/* 상세 정보도 접근 가능 */}
										<div className="text-xs opacity-75">현재 탭: {activeTab === "flat" ? "플랫 키" : "샤프 키"}</div>
									</div>
								</button>
							)}
						</KeyDropdown>
					</div>
				</div>

				{/* 미니멀 스타일 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">5. 미니멀 카드 스타일</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
						>
							{({ currentValue, isOpen, keyValue, scaleValue }) => (
								<div className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold text-gray-900">음악 키</h4>
										<div className="flex gap-1">
											{keyValue && (
												<div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{keyValue.label}</div>
											)}
											{scaleValue && (
												<div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">{scaleValue}</div>
											)}
										</div>
									</div>
									<div className="text-2xl font-bold text-gray-800 mb-1">{currentValue || "미설정"}</div>
									<div className="flex items-center justify-between text-sm text-gray-500">
										<span>
											{keyValue && scaleValue
												? "키와 스케일 모두 설정됨"
												: keyValue
													? "스케일 선택 필요"
													: "키와 스케일 선택"}
										</span>
										<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
									</div>
								</div>
							)}
						</KeyDropdown>
					</div>
				</div>

				{/* 피아노 키 스타일 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">6. 피아노 키 스타일</h3>
					<div className="w-80">
						<KeyDropdown
							keyValue={keyValue}
							scaleValue={scaleValue}
							onChangeKey={handleChangeKey}
							onChangeScale={handleChangeScale}
							onClear={handleClear}
							asChild
						>
							{({ currentValue, isOpen, keyValue, scaleValue }) => (
								<div className="cursor-pointer relative overflow-hidden rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
									{/* 피아노 키 배경 효과 */}
									<div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-50"></div>
									<div className="relative p-4 bg-white">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
													{keyValue?.label || "?"}
												</div>
												<div>
													<div className="font-medium text-gray-900">{currentValue || "음악 키 선택"}</div>
													<div className="text-xs text-gray-500">
														{keyValue && scaleValue ? "완료" : keyValue ? "스케일 선택하세요" : "키를 선택하세요"}
													</div>
												</div>
											</div>
											<div className="text-xl">{isOpen ? "⬆️" : "⬇️"}</div>
										</div>
									</div>
								</div>
							)}
						</KeyDropdown>
					</div>
				</div>

				{/* 현재 값 표시 */}
				<div className="mt-8 p-4 bg-gray-100 rounded-lg">
					<h4 className="font-medium mb-2">현재 선택된 값:</h4>
					<div className="text-sm space-y-1">
						<div>Key: {keyValue ? `${keyValue.label} (${keyValue.value})` : "없음"}</div>
						<div>Scale: {scaleValue ?? "없음"}</div>
						<div>Combined: {keyValue && scaleValue ? `${keyValue.label} ${scaleValue}` : "미완성"}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
