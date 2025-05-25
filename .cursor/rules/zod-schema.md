# Zod Schema Rules

## 네이밍 컨벤션

### 필드명 규칙

- **모든 필드는 카멜케이스(camelCase)로 작성**
- 데이터베이스 컬럼명이 스네이크케이스여도 스키마에서는 카멜케이스 사용
- API 응답/요청에서 일관된 카멜케이스 형태 유지

### 예시

```typescript
// ✅ 올바른 예시 - 카멜케이스
export const UserSchema = z.object({
	userId: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string().optional(),
	profileUrl: z.string().url().optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

// ❌ 잘못된 예시 - 스네이크케이스
export const UserSchema = z.object({
	user_id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	phone_number: z.string().optional(),
	profile_url: z.string().url().optional(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});
```

### 스키마명 규칙

- 스키마명은 PascalCase + "Schema" 접미사
- 타입명은 PascalCase (Schema 접미사 제거)

```typescript
export const UserProfileResponseSchema = z.object({...});
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
```

### 설명(describe)과 기본값(default) 규칙

- 모든 필드에 `.describe()` 추가하여 Swagger 문서화 지원
- 샘플 데이터를 위한 `.default()` 값 제공
- 선택적 필드는 `.optional()` 사용

```typescript
export const UserSchema = z.object({
	userId: z.number().describe("사용자 ID").default(1),
	email: z.string().email().describe("이메일 주소").default("user@example.com"),
	phoneNumber: z.string().describe("전화번호").default("010-1234-5678").optional(),
});
```
