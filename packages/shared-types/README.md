# @hitbeatclub/shared-types

HitBeatClub 프론트엔드와 백엔드에서 공유하는 타입 정의 패키지입니다. Zod를 활용하여 런타임 타입 검증과 TypeScript 타입 안전성을 모두 제공합니다.

## 설치

```bash
# 워크스페이스 내에서
pnpm add @hitbeatclub/shared-types

# 또는 개별 프로젝트에서
pnpm add @hitbeatclub/shared-types@workspace:*
```

## 사용법

### 기본 사용법

```typescript
import { UserSchema, CreateUserRequest, SuccessResponse, createSuccessResponse } from "@hitbeatclub/shared-types";

// 스키마 검증
const userData = UserSchema.parse(rawUserData);

// 타입 사용
const createUser = (data: CreateUserRequest): SuccessResponse<User> => {
	// 사용자 생성 로직
	return createSuccessResponse(userData, "사용자가 생성되었습니다");
};
```

### 모듈별 임포트

```typescript
// 특정 모듈만 임포트
import { UserSchema, LoginRequest } from "@hitbeatclub/shared-types/user";
import { ProductSchema, CreateProductRequest } from "@hitbeatclub/shared-types/product";
import { OrderSchema, PaymentRequest } from "@hitbeatclub/shared-types/order";
import { ArtistSchema, CreateArtistRequest } from "@hitbeatclub/shared-types/artist";
import { BaseResponse, PaginatedResponse } from "@hitbeatclub/shared-types/common";
```

## 모듈 구조

### Common (`/common`)

- 기본 응답 스키마 (`BaseResponse`, `SuccessResponse`, `ErrorResponse`)
- 페이지네이션 스키마 (`PaginatedResponse`)
- 공통 필드 스키마 (`Timestamp`, `Id`)
- 파일 업로드 스키마
- 유틸리티 함수

### User (`/user`)

- 사용자 기본 정보 스키마
- 로그인/회원가입 요청/응답 스키마
- 소셜 로그인 스키마
- 사용자 필터링/정렬 스키마

### Artist (`/artist`)

- 아티스트 정보 스키마
- 아티스트 생성/수정 요청 스키마
- 슬러그 검증 스키마
- 아티스트 필터링/정렬 스키마

### Product (`/product`)

- 상품 정보 스키마
- 상품 생성/수정 요청 스키마
- 라이센스 정보 스키마
- 파일 업로드 스키마
- 상품 필터링/정렬 스키마

### Order (`/order`)

- 주문 정보 스키마
- 주문 생성 요청 스키마
- 결제 정보 스키마
- 장바구니 스키마
- 주문 통계 스키마

## API 응답 형식

모든 API 응답은 일관된 형식을 따릅니다:

### 성공 응답

```typescript
{
  success: true,
  data: T, // 실제 데이터
  message?: string,
  timestamp: string // ISO 8601 형식
}
```

### 에러 응답

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: unknown
  },
  timestamp: string // ISO 8601 형식
}
```

### 페이지네이션 응답

```typescript
{
  success: true,
  data: {
    items: T[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  },
  timestamp: string
}
```

## 백엔드에서 사용 예시

```typescript
// Express.js 예시
import { CreateUserRequestSchema, createSuccessResponse } from "@hitbeatclub/shared-types";

app.post("/api/users", async (req, res) => {
	try {
		// 요청 데이터 검증
		const userData = CreateUserRequestSchema.parse(req.body);

		// 사용자 생성 로직
		const user = await createUser(userData);

		// 일관된 응답 형식
		res.json(createSuccessResponse(user, "사용자가 생성되었습니다"));
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json(createErrorResponse("VALIDATION_ERROR", "입력 데이터가 올바르지 않습니다", error.errors));
		} else {
			res.status(500).json(createErrorResponse("INTERNAL_ERROR", "서버 오류가 발생했습니다"));
		}
	}
});
```

## 프론트엔드에서 사용 예시

```typescript
// React/Next.js 예시
import { LoginRequest, LoginResponse, UserResponse } from "@hitbeatclub/shared-types";

const useAuth = () => {
	const login = async (data: LoginRequest): Promise<LoginResponse> => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const result = await response.json();

		// 타입 안전성 보장
		if (result.success) {
			return result as LoginResponse;
		} else {
			throw new Error(result.error.message);
		}
	};

	return { login };
};
```

## 개발

```bash
# 개발 모드 (watch)
pnpm dev

# 빌드
pnpm build

# 타입 체크
pnpm type-check

# 린트
pnpm lint

# 테스트
pnpm test
```

## 배포 고려사항

### Vercel (프론트엔드)

- ESM 모듈 형식 지원
- Tree-shaking 최적화
- 타입 정의 파일 포함

### AWS ECS (백엔드)

- CommonJS 모듈 형식 지원
- Docker 이미지에 포함
- 런타임 검증 활용

## 버전 관리

이 패키지는 semantic versioning을 따릅니다:

- **Major**: 호환성을 깨는 변경사항
- **Minor**: 새로운 기능 추가
- **Patch**: 버그 수정

## 기여하기

1. 새로운 스키마 추가 시 해당 모듈 폴더에 추가
2. 타입 안전성을 위해 Zod 스키마 우선 작성
3. 테스트 코드 작성
4. README 업데이트
