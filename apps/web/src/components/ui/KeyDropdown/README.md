# KeyDropdown 컴포넌트

음악 키(Key)와 스케일(Scale) 선택을 위한 드롭다운 컴포넌트입니다. Flat Keys와 Sharp Keys 탭으로 구분된 키 선택과 Major/Minor 스케일 선택을 지원하며, 다양한 커스터마이징 옵션을 제공합니다.

## 주요 기능

- ✅ Flat Keys / Sharp Keys 탭 지원
- ✅ 자연음 키 선택 (C, D, E, F, G, A, B)
- ✅ Major/Minor 스케일 선택
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
import { KeyDropdown, KeyValue } from "@/components/ui/KeyDropdown";

function MyComponent() {
	const [keyValue, setKeyValue] = useState<KeyValue | undefined>();
	const [scaleValue, setScaleValue] = useState<string | null>(null);

	return (
		<KeyDropdown
			keyValue={keyValue}
			scaleValue={scaleValue}
			onChangeKey={setKeyValue}
			onChangeScale={setScaleValue}
			onClear={() => {
				setKeyValue(undefined);
				setScaleValue(null);
			}}
		/>
	);
}
```

### 2. 커스텀 트리거 (asChild)

```tsx
<KeyDropdown
	keyValue={keyValue}
	scaleValue={scaleValue}
	onChangeKey={setKeyValue}
	onChangeScale={setScaleValue}
	onClear={handleClear}
	asChild
>
	<button className="custom-button">🎵 Key 선택하기</button>
</KeyDropdown>
```

### 3. Render Prop 패턴

```tsx
<KeyDropdown
	keyValue={keyValue}
	scaleValue={scaleValue}
	onChangeKey={setKeyValue}
	onChangeScale={setScaleValue}
	onClear={handleClear}
>
	{({ currentValue, isOpen, activeTab }) => (
		<div className="custom-trigger">
			<span>{currentValue || "Key 선택"}</span>
			<span>Tab: {activeTab}</span>
			<span>{isOpen ? "🔼" : "🔽"}</span>
		</div>
	)}
</KeyDropdown>
```

### 4. Render Prop + asChild 조합

```tsx
<KeyDropdown
	keyValue={keyValue}
	scaleValue={scaleValue}
	onChangeKey={setKeyValue}
	onChangeScale={setScaleValue}
	onClear={handleClear}
	asChild
>
	{({ currentValue, isOpen, keyValue, scaleValue, activeTab }) => (
		<button className="advanced-trigger">
			<div>{currentValue || "Key 설정"}</div>
			<div>{keyValue && scaleValue ? `${keyValue.label} ${scaleValue}` : "미설정"}</div>
			<div>Current tab: {activeTab}</div>
		</button>
	)}
</KeyDropdown>
```

## Props

### KeyDropdownProps

| Prop            | 타입                                                          | 필수 | 설명                           |
| --------------- | ------------------------------------------------------------- | ---- | ------------------------------ |
| `keyValue`      | `KeyValue \| undefined`                                       | ✅   | 선택된 키 값                   |
| `scaleValue`    | `string \| null`                                              | ✅   | 선택된 스케일 값               |
| `onChangeKey`   | `(key: KeyValue) => void`                                     | ✅   | 키 변경 핸들러                 |
| `onChangeScale` | `(scale: string) => void`                                     | ✅   | 스케일 변경 핸들러             |
| `onClear`       | `() => void`                                                  | ✅   | 초기화 핸들러                  |
| `children`      | `ReactNode \| ((props: KeyDropdownRenderProps) => ReactNode)` | ❌   | 커스텀 트리거 또는 render prop |
| `asChild`       | `boolean`                                                     | ❌   | Radix Slot 사용 여부           |

### KeyDropdownRenderProps (Render Prop 패턴용)

| 속성           | 타입                    | 설명                    |
| -------------- | ----------------------- | ----------------------- |
| `currentValue` | `string \| undefined`   | 현재 선택된 값 (표시용) |
| `isOpen`       | `boolean`               | 드롭다운 열림 상태      |
| `keyValue`     | `KeyValue \| undefined` | 선택된 키 값            |
| `scaleValue`   | `string \| null`        | 선택된 스케일 값        |
| `activeTab`    | `"flat" \| "sharp"`     | 현재 활성 탭            |

### 타입 정의

```tsx
export type KeyValue = {
	label: string;
	value: string;
};
```

## 지원되는 키

### Flat Keys

- D♭ (Db), E♭ (Eb), G♭ (Gb), A♭ (Ab), B♭ (Bb)

### Sharp Keys

- C# (Cs), D# (Ds), F# (Fs), G# (Gs), A# (As)

### Natural Keys

- C, D, E, F, G, A, B

### Scales

- Major, Minor

## 스타일링

기본 스타일은 Tailwind CSS를 사용합니다. 커스텀 스타일링을 원한다면 `asChild`나 render prop 패턴을 사용하여 완전한 커스터마이징이 가능합니다.

## 접근성

- ARIA 속성 완전 지원
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 탭 기반 키 선택 인터페이스

## Storybook

```bash
npm run storybook
```

Storybook에서 다양한 사용 예시를 확인할 수 있습니다:

- **Default**: 기본 사용법
- **WithSelectedKey**: 키만 선택된 상태
- **WithKeyAndScale**: 키와 스케일 모두 선택된 상태
- **CustomTrigger**: 커스텀 트리거 사용 예시
- **RenderPropPattern**: Render Prop 패턴 사용 예시
- **RenderPropWithAsChild**: Render Prop + asChild 조합 예시
