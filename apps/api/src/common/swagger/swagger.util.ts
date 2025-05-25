import { z } from "zod";

/**
 * Zod 스키마를 Swagger schema 객체로 변환
 */
export function createSwaggerSchemaFromZod(zodSchema: z.ZodObject<any>): any {
	const shape = zodSchema.shape;
	const swaggerProperties: Record<string, any> = {};
	const exampleData: Record<string, any> = {};
	const requiredFields: string[] = [];

	for (const [key, value] of Object.entries(shape)) {
		const field = value as any;
		const propertySchema = processZodField(field);

		swaggerProperties[key] = propertySchema.schema;

		// 예제 데이터 추가
		if (propertySchema.example !== undefined) {
			exampleData[key] = propertySchema.example;
		}

		// required 필드 체크
		if (!propertySchema.optional) {
			requiredFields.push(key);
		}
	}

	return {
		type: "object",
		properties: swaggerProperties,
		...(requiredFields.length > 0 && { required: requiredFields }),
		example: exampleData,
	};
}

/**
 * 개별 Zod 필드를 처리하여 Swagger 스키마와 예제 데이터 생성
 */
function processZodField(field: any): { schema: any; example?: any; optional: boolean } {
	let currentField = field;
	let isOptional = false;

	// ZodOptional 처리
	if (currentField._def.typeName === "ZodOptional") {
		isOptional = true;
		currentField = currentField._def.innerType;
	}

	// description 추출
	let description = "";
	if (currentField._def?.description) {
		description = currentField._def.description;
	}

	// default 값 추출
	let defaultValue: any;
	if (currentField._def?.defaultValue !== undefined) {
		defaultValue =
			typeof currentField._def.defaultValue === "function"
				? currentField._def.defaultValue()
				: currentField._def.defaultValue;
	}

	// 타입별 스키마 생성
	const schema = createSwaggerSchemaForType(currentField, description);

	return {
		schema,
		example: defaultValue,
		optional: isOptional,
	};
}

/**
 * Zod 타입에 따른 Swagger 스키마 생성
 */
function createSwaggerSchemaForType(field: any, description: string): any {
	const typeName = field._def.typeName;

	const baseSchema: any = {
		...(description && { description }),
	};

	switch (typeName) {
		case "ZodString":
			baseSchema.type = "string";
			// 이메일 체크
			if (field._def.checks) {
				for (const check of field._def.checks) {
					if (check.kind === "email") {
						baseSchema.format = "email";
					} else if (check.kind === "url") {
						baseSchema.format = "uri";
					} else if (check.kind === "min") {
						baseSchema.minLength = check.value;
					} else if (check.kind === "max") {
						baseSchema.maxLength = check.value;
					}
				}
			}
			break;

		case "ZodNumber":
			baseSchema.type = "number";
			if (field._def.checks) {
				for (const check of field._def.checks) {
					if (check.kind === "min") {
						baseSchema.minimum = check.value;
					} else if (check.kind === "max") {
						baseSchema.maximum = check.value;
					}
				}
			}
			break;

		case "ZodBoolean":
			baseSchema.type = "boolean";
			break;

		case "ZodEnum":
			baseSchema.type = "string";
			baseSchema.enum = field._def.values;
			break;

		case "ZodArray":
			baseSchema.type = "array";
			baseSchema.items = createSwaggerSchemaForType(field._def.type, "");
			break;

		case "ZodObject":
			baseSchema.type = "object";
			// 중첩된 객체는 재귀적으로 처리
			const nestedSchema = createSwaggerSchemaFromZod(field);
			baseSchema.properties = nestedSchema.properties;
			if (nestedSchema.required) {
				baseSchema.required = nestedSchema.required;
			}
			break;

		default:
			baseSchema.type = "string";
			break;
	}

	return baseSchema;
}

/**
 * Zod 스키마를 Swagger schema 객체로 변환 (기존 함수)
 */
export function zodToSwaggerSchema(zodSchema: z.ZodType): any {
	try {
		// Zod 스키마를 파싱하여 기본 구조 추출
		const parsed = zodSchema.safeParse({});

		// 기본적으로 object 타입으로 처리
		return {
			type: "object",
			additionalProperties: true,
		};
	} catch (error) {
		// 에러 발생 시 기본 object 반환
		return {
			type: "object",
			additionalProperties: true,
		};
	}
}

/**
 * Zod 스키마에서 직접 API 응답 스키마 생성
 */
export function createApiResponseFromZodSchema(
	dataSchema: z.ZodObject<any>,
	message: string = "success",
	statusCode: number = 200,
) {
	// Zod 스키마에서 Swagger 스키마 생성
	const shape = dataSchema.shape;
	const swaggerProperties: Record<string, any> = {};
	const exampleData: Record<string, any> = {};

	for (const [key, value] of Object.entries(shape)) {
		const field = value as any;

		// description 추출
		let description = key;
		if (field._def?.description) {
			description = field._def.description;
		}

		// default 값 추출
		let defaultValue: any;
		if (field._def?.defaultValue !== undefined) {
			defaultValue =
				typeof field._def.defaultValue === "function" ? field._def.defaultValue() : field._def.defaultValue;
		}

		// Swagger 스키마 생성
		swaggerProperties[key] = {
			type: getZodType(field),
			description: description,
			...(getZodFormat(field) && { format: getZodFormat(field) }),
		};

		// 예제 데이터에 default 값 추가
		if (defaultValue !== undefined) {
			exampleData[key] = defaultValue;
		}
	}

	return {
		type: "object",
		properties: {
			statusCode: { type: "number", example: statusCode },
			message: { type: "string", example: message },
			data: {
				type: "object",
				properties: swaggerProperties,
				example: exampleData,
			},
		},
		required: ["statusCode", "message", "data"],
	};
}

function getZodType(zodField: any): string {
	const typeName = zodField._def.typeName;
	switch (typeName) {
		case "ZodString":
			return "string";
		case "ZodNumber":
			return "number";
		case "ZodBoolean":
			return "boolean";
		case "ZodArray":
			return "array";
		case "ZodObject":
			return "object";
		default:
			return "string";
	}
}

function getZodFormat(zodField: any): string | undefined {
	if (zodField._def.checks) {
		for (const check of zodField._def.checks) {
			if (check.kind === "email") return "email";
		}
	}
	return undefined;
}

/**
 * API 응답 형태로 래핑된 Swagger schema 생성
 */
export function createApiResponseSchema(dataSchema: z.ZodType, example?: any) {
	return {
		type: "object",
		properties: {
			statusCode: { type: "number", example: 200 },
			message: { type: "string", example: "success" },
			data: {
				type: "object",
				...(example && { example }),
			},
		},
		required: ["statusCode", "message", "data"],
	};
}

/**
 * 간단한 스키마 생성 헬퍼 (수동 정의용)
 */
export function createSimpleSchema(properties: Record<string, any>, example?: any) {
	return {
		type: "object",
		properties,
		...(example && { example }),
	};
}
