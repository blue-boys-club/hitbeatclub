# BPMDropdown 컴포넌트

BPM (Beats Per Minute) 선택을 위한 드롭다운 컴포넌트입니다. 정확한 BPM 값과 범위 설정을 모두 지원하며, 다양한 커스터마이징 옵션을 제공합니다.

## 주요 기능

- ✅ 정확한 BPM 값 설정 (Exact)
- ✅ BPM 범위 설정 (Range)
- ✅ 커스텀 트리거 지원 (Radix Slot)
- ✅ Render Prop 패턴 지원
- ✅ TypeScript 완전 지원
- ✅ 접근성 준수 (ARIA)

## 설치 및 의존성

```bash
npm install @radix-ui/react-slot
```

## 기본 사용법

### 1. 기본 트리거 사용

```tsx
import { BPMDropdown } from "@/components/ui/BPMDropdown";

function MyComponent() {
	const [bpmType, setBpmType] = useState<"exact" | "range">("exact");
	const [bpmValue, setBpmValue] = useState<number | undefined>();
	const [bpmRangeValue, setBpmRangeValue] = useState<{ min?: number; max?: number } | undefined>();

	return (
		<BPMDropdown
			bpmType={bpmType}
			bpmValue={bpmValue}
			bpmRangeValue={bpmRangeValue}
			onChangeBPMType={setBpmType}
			onChangeExactBPM={setBpmValue}
			onChangeBPMRange={(type, bpm) => setBpmRangeValue((prev) => ({ ...prev, [type]: bpm }))}
			onClear={() => {
				setBpmValue(undefined);
				setBpmRangeValue({ min: undefined, max: undefined });
			}}
		/>
	);
}
```

### 2. 커스텀 트리거 (asChild)

```tsx
<BPMDropdown
	bpmType={bpmType}
	bpmValue={bpmValue}
	bpmRangeValue={bpmRangeValue}
	onChangeBPMType={setBpmType}
	onChangeExactBPM={setBpmValue}
	onChangeBPMRange={handleChangeBPMRange}
	onClear={handleClear}
	asChild
>
	<button className="custom-button">🎵 BPM 선택하기</button>
</BPMDropdown>
```

### 3. Render Prop 패턴

```tsx
<BPMDropdown
	bpmType={bpmType}
	bpmValue={bpmValue}
	bpmRangeValue={bpmRangeValue}
	onChangeBPMType={setBpmType}
	onChangeExactBPM={setBpmValue}
	onChangeBPMRange={handleChangeBPMRange}
	onClear={handleClear}
>
	{({ currentValue, isOpen, bpmType }) => (
		<div className="custom-trigger">
			<span>{currentValue || "BPM 선택"}</span>
			<span>{isOpen ? "🔼" : "🔽"}</span>
		</div>
	)}
</BPMDropdown>
```

### 4. Render Prop + asChild 조합

```tsx
<BPMDropdown
	bpmType={bpmType}
	bpmValue={bpmValue}
	bpmRangeValue={bpmRangeValue}
	onChangeBPMType={setBpmType}
	onChangeExactBPM={setBpmValue}
	onChangeBPMRange={handleChangeBPMRange}
	onClear={handleClear}
	asChild
>
	{({ currentValue, isOpen, bpmType, bpmValue, bpmRangeValue }) => (
		<button className="advanced-trigger">
			<div>{currentValue || "BPM 설정"}</div>
			<div>{bpmType === "exact" ? "정확" : "범위"}</div>
			{/* 모든 상태값에 접근 가능 */}
		</button>
	)}
</BPMDropdown>
```

## Props

### BPMDropdownProps

| Prop               | 타입                                                          | 필수 | 설명                           |
| ------------------ | ------------------------------------------------------------- | ---- | ------------------------------ |
| `bpmType`          | `"exact" \| "range"`                                          | ✅   | BPM 타입 (정확값 또는 범위)    |
| `bpmValue`         | `number \| undefined`                                         | ✅   | 정확한 BPM 값                  |
| `bpmRangeValue`    | `BPMRange \| undefined`                                       | ✅   | BPM 범위 값                    |
| `onChangeBPMType`  | `(type: "exact" \| "range") => void`                          | ✅   | BPM 타입 변경 핸들러           |
| `onChangeExactBPM` | `(bpm: number) => void`                                       | ✅   | 정확한 BPM 변경 핸들러         |
| `onChangeBPMRange` | `(type: "min" \| "max", bpm: number) => void`                 | ✅   | BPM 범위 변경 핸들러           |
| `onClear`          | `() => void`                                                  | ✅   | 초기화 핸들러                  |
| `children`         | `ReactNode \| ((props: BPMDropdownRenderProps) => ReactNode)` | ❌   | 커스텀 트리거 또는 render prop |
| `asChild`          | `boolean`                                                     | ❌   | Radix Slot 사용 여부           |

### BPMDropdownRenderProps (Render Prop 패턴용)

| 속성            | 타입                            | 설명                    |
| --------------- | ------------------------------- | ----------------------- |
| `currentValue`  | `string \| number \| undefined` | 현재 선택된 값 (표시용) |
| `isOpen`        | `boolean`                       | 드롭다운 열림 상태      |
| `bpmType`       | `"exact" \| "range"`            | 현재 BPM 타입           |
| `bpmValue`      | `BPM`                           | 정확한 BPM 값           |
| `bpmRangeValue` | `BPMRange`                      | BPM 범위 값             |

### 타입 정의

```tsx
export type BPM = number | undefined;
export type BPMRange = { min?: number | undefined; max?: number | undefined } | undefined;
```

## 스타일링

기본 스타일은 Tailwind CSS를 사용합니다. 커스텀 스타일링을 원한다면 `asChild`나 render prop 패턴을 사용하여 완전한 커스터마이징이 가능합니다.

## 접근성

- ARIA 속성 완전 지원
- 키보드 네비게이션 지원
- 스크린 리더 호환

## 예제

더 많은 예제는 `BPMDropdown.example.tsx` 파일을 참조하세요.

## Storybook

```bash
npm run storybook
```

Storybook에서 다양한 사용 예시를 확인할 수 있습니다.
