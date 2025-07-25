import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiExtraModels,
	ApiHeaders,
	ApiOperation,
	ApiParam,
	ApiProduces,
	ApiQuery,
	ApiResponse,
	getSchemaPath,
} from "@nestjs/swagger";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "~/common/doc/constants/doc.enum.constant";
import {
	IDocAuthOptions,
	IDocDefaultOptions,
	IDocGuardOptions,
	IDocOfOptions,
	IDocOptions,
	IDocRequestFileOptions,
	IDocRequestOptions,
	IDocResponseFileOptions,
	IDocResponseOptions,
} from "~/common/doc/interfaces/doc.interface";
import { ENUM_FILE_MIME } from "~/common/file/constants/file.enum.constant";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "~/common/pagination/constants/pagination.enum.constant";
import { ResponseDto } from "~/common/response/dtos/response.dto";
import { ResponsePagingDto } from "~/common/response/dtos/response.paging.dto";
import { ENUM_POLICY_STATUS_CODE_ERROR } from "~/common/policy/constants/policy.status-code.constant";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "~/common/request/constants/request.status-code.constant";
import {
	AUTH_JWT_ACCESS_TOKEN_ERROR,
	AUTH_JWT_REFRESH_TOKEN_ERROR,
	AUTH_SOCIAL_GOOGLE_ERROR,
	AUTH_SOCIAL_KAKAO_ERROR,
	AUTH_SOCIAL_NAVER_ERROR,
} from "~/modules/auth/auth.error";
import { ENUM_APP_STATUS_CODE_ERROR } from "~/constants/app.status-code.constant";

export function DocDefault<T>(options: IDocDefaultOptions<T>): MethodDecorator {
	const docs = [];
	const schema: Record<string, any> = {
		allOf: [{ $ref: getSchemaPath(ResponseDto) }],
		properties: {
			message: {
				example: options.messagePath,
			},
			statusCode: {
				type: "number",
				example: options.statusCode,
			},
		},
	};

	if (options.dto) {
		docs.push(ApiExtraModels(options.dto as any));
		schema.properties = {
			...schema.properties,
			data: {
				$ref: getSchemaPath(options.dto as any),
			},
		};
	}

	return applyDecorators(
		ApiExtraModels(ResponseDto),
		ApiResponse({
			description: options.httpStatus.toString(),
			status: options.httpStatus,
			schema,
		}),
		...docs,
	);
}

export function DocOneOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
	const docs = [];
	const oneOf = [];

	for (const doc of documents) {
		const oneOfSchema: Record<string, any> = {
			allOf: [{ $ref: getSchemaPath(ResponseDto) }],
			properties: {
				message: {
					example: doc.messagePath,
				},
				statusCode: {
					type: "number",
					example: doc.statusCode ?? HttpStatus.OK,
				},
			},
		};

		if (doc.dto) {
			docs.push(ApiExtraModels(doc.dto));
			oneOfSchema.properties = {
				...oneOfSchema.properties,
				data: {
					$ref: getSchemaPath(doc.dto),
				},
			};
		}

		oneOf.push(oneOfSchema);
	}

	return applyDecorators(
		ApiExtraModels(ResponseDto),
		ApiResponse({
			description: httpStatus.toString(),
			status: httpStatus,
			schema: {
				oneOf,
			},
		}),
		...docs,
	);
}

export function DocAnyOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
	const docs = [];
	const anyOf = [];

	for (const doc of documents) {
		const anyOfSchema: Record<string, any> = {
			allOf: [{ $ref: getSchemaPath(ResponseDto) }],
			properties: {
				message: {
					example: doc.messagePath,
				},
				statusCode: {
					type: "number",
					example: doc.statusCode ?? HttpStatus.OK,
				},
			},
		};

		if (doc.dto) {
			docs.push(ApiExtraModels(doc.dto));
			anyOfSchema.properties = {
				...anyOfSchema.properties,
				data: {
					$ref: getSchemaPath(doc.dto),
				},
			};
		}

		anyOf.push(anyOfSchema);
	}

	return applyDecorators(
		ApiExtraModels(ResponseDto),
		ApiResponse({
			description: httpStatus.toString(),
			status: httpStatus,
			schema: {
				anyOf,
			},
		}),
		...docs,
	);
}

export function DocAllOf(httpStatus: HttpStatus, ...documents: IDocOfOptions[]): MethodDecorator {
	const docs = [];
	const allOf = [];

	for (const doc of documents) {
		const allOfSchema: Record<string, any> = {
			allOf: [{ $ref: getSchemaPath(ResponseDto) }],
			properties: {
				message: {
					example: doc.messagePath,
				},
				statusCode: {
					type: "number",
					example: doc.statusCode ?? HttpStatus.OK,
				},
			},
		};

		if (doc.dto) {
			docs.push(ApiExtraModels(doc.dto));
			allOfSchema.properties = {
				...allOfSchema.properties,
				data: {
					$ref: getSchemaPath(doc.dto),
				},
			};
		}

		allOf.push(allOfSchema);
	}

	return applyDecorators(
		ApiExtraModels(ResponseDto),
		ApiResponse({
			description: httpStatus.toString(),
			status: httpStatus,
			schema: {
				allOf,
			},
		}),
		...docs,
	);
}

export function Doc(options?: IDocOptions): MethodDecorator {
	return applyDecorators(
		ApiOperation({
			summary: options?.summary,
			deprecated: options?.deprecated,
			description: options?.description,
			operationId: options?.operation,
		}),
		ApiHeaders([
			// {
			//     name: 'x-custom-lang',
			//     description: 'Custom language header',
			//     required: false,
			//     schema: {
			//         default: ENUM_MESSAGE_LANGUAGE.EN,
			//         example: ENUM_MESSAGE_LANGUAGE.EN,
			//         type: 'string',
			//     },
			// },
		]),
		DocDefault({
			httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
			messagePath: "http.serverError.internalServerError",
			statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN_ERROR,
		}),
		DocDefault({
			httpStatus: HttpStatus.REQUEST_TIMEOUT,
			messagePath: "http.serverError.requestTimeout",
			statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMEOUT_ERROR,
		}),
	);
}

export function DocRequest(options?: IDocRequestOptions) {
	const docs: Array<ClassDecorator | MethodDecorator> = [];

	if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA) {
		docs.push(ApiConsumes("multipart/form-data"));
	} else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.TEXT) {
		docs.push(ApiConsumes("text/plain"));
	} else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.JSON) {
		docs.push(ApiConsumes("application/json"));
	}

	if (options?.bodyType) {
		docs.push(
			DocDefault({
				httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
				statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
				messagePath: "request.validation",
			}),
		);
	}

	if (options?.params) {
		const params: MethodDecorator[] = options?.params?.map((param) => ApiParam(param));
		docs.push(...params);
	}

	if (options?.queries) {
		const queries: MethodDecorator[] = options?.queries?.map((query) => ApiQuery(query));
		docs.push(...queries);
	}

	if (options?.dto) {
		docs.push(ApiBody({ type: options?.dto }));
	}

	return applyDecorators(...docs);
}

export function DocRequestFile(options?: IDocRequestFileOptions) {
	const docs: Array<ClassDecorator | MethodDecorator> = [];

	docs.push(ApiConsumes("multipart/form-data"));

	if (options?.params) {
		const params: MethodDecorator[] = options?.params.map((param) => ApiParam(param));
		docs.push(...params);
	}

	if (options?.queries) {
		const queries: MethodDecorator[] = options?.queries?.map((query) => ApiQuery(query));
		docs.push(...queries);
	}

	if (options?.dto) {
		docs.push(
			ApiBody({
				type: options?.dto,
				description: "파일 업로드",
			}),
		);
	}

	docs.push(
		DocDefault({
			httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
			statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
			messagePath: "request.validation",
		}),
	);

	return applyDecorators(...docs);
}

export function DocGuard(options?: IDocGuardOptions) {
	const oneOfForbidden: IDocOfOptions[] = [];

	if (options?.role) {
		oneOfForbidden.push({
			statusCode: ENUM_POLICY_STATUS_CODE_ERROR.ROLE_FORBIDDEN_ERROR,
			messagePath: "policy.error.roleForbidden",
		});
	}

	if (options?.policy) {
		oneOfForbidden.push({
			statusCode: ENUM_POLICY_STATUS_CODE_ERROR.ABILITY_FORBIDDEN_ERROR,
			messagePath: "policy.error.abilityForbidden",
		});
	}

	return applyDecorators(DocOneOf(HttpStatus.FORBIDDEN, ...oneOfForbidden));
}

export function DocAuth(options?: IDocAuthOptions) {
	const docs: Array<ClassDecorator | MethodDecorator> = [];
	const oneOfUnauthorized: IDocOfOptions[] = [];

	if (options?.jwtRefreshToken) {
		docs.push(ApiBearerAuth("refreshToken"));
		oneOfUnauthorized.push({
			messagePath: "auth.error.refreshTokenUnauthorized",
			statusCode: AUTH_JWT_REFRESH_TOKEN_ERROR.code,
		});
	}

	if (options?.jwtAccessToken) {
		docs.push(ApiBearerAuth("accessToken"));
		oneOfUnauthorized.push({
			messagePath: "auth.error.accessTokenUnauthorized",
			statusCode: AUTH_JWT_ACCESS_TOKEN_ERROR.code,
		});
	}

	if (options?.google) {
		docs.push(ApiBearerAuth("google"));
		oneOfUnauthorized.push({
			messagePath: "auth.error.socialGoogle",
			statusCode: AUTH_SOCIAL_GOOGLE_ERROR.code,
		});
	}

	if (options?.kakao) {
		docs.push(ApiBearerAuth("kakao"));
		oneOfUnauthorized.push({
			messagePath: "auth.error.socialKakao",
			statusCode: AUTH_SOCIAL_KAKAO_ERROR.code,
		});
	}

	if (options?.naver) {
		docs.push(ApiBearerAuth("naver"));
		oneOfUnauthorized.push({
			messagePath: "auth.error.socialNaver",
			statusCode: AUTH_SOCIAL_NAVER_ERROR.code,
		});
	}

	//   if (options?.apple) {
	//     docs.push(ApiBearerAuth('apple'));
	//     oneOfUnauthorized.push({
	//       messagePath: 'auth.error.socialApple',
	//         statusCode: AUTH_SOCIAL_APPLE_ERROR.code,
	//     });
	//   }

	return applyDecorators(...docs, DocOneOf(HttpStatus.UNAUTHORIZED, ...oneOfUnauthorized));
}

export function DocResponse<T = void>(messagePath: string, options?: IDocResponseOptions<T>): MethodDecorator {
	const docs: IDocDefaultOptions = {
		httpStatus: options?.httpStatus ?? HttpStatus.OK,
		messagePath,
		statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
	};

	if (options?.dto) {
		docs.dto = options?.dto;
	}

	return applyDecorators(ApiProduces("application/json"), DocDefault(docs));
}

export function DocErrorGroup(docs: MethodDecorator[]) {
	return applyDecorators(...docs);
}

export function DocResponsePaging<T>(messagePath: string, options: IDocResponseOptions<T>): MethodDecorator {
	const docs: IDocDefaultOptions = {
		httpStatus: options?.httpStatus ?? HttpStatus.OK,
		messagePath,
		statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
	};

	if (options?.dto) {
		docs.dto = options?.dto;
	}

	return applyDecorators(
		ApiProduces("application/json"),
		ApiQuery({
			name: "page",
			required: false,
			allowEmptyValue: true,
			example: 1,
			type: "number",
			description: "페이지 번호",
		}),
		ApiQuery({
			name: "limit",
			required: false,
			allowEmptyValue: true,
			example: 10,
			type: "number",
			description: "페이지당 항목 수",
		}),
		ApiExtraModels(options.dto as any),
		ApiResponse({
			description: docs.httpStatus.toString(),
			status: docs.httpStatus,
			schema: {
				allOf: [{ $ref: getSchemaPath(ResponsePagingDto) }],
				properties: {
					message: {
						example: messagePath,
					},
					statusCode: {
						type: "number",
						example: docs.statusCode,
					},
					_pagination: {
						type: "object",
						properties: {
							page: {
								type: "number",
								example: 1,
							},
							limit: {
								type: "number",
								example: 10,
							},
							totalPage: {
								type: "number",
								example: 1,
							},
							total: {
								type: "number",
								example: 0,
							},
						},
					},
					data: {
						type: "array",
						items: {
							$ref: getSchemaPath(docs.dto),
						},
					},
				},
			},
		}),
	);
}

export function DocResponseList<T>(messagePath: string, options: IDocResponseOptions<T>): MethodDecorator {
	const docs: IDocDefaultOptions = {
		httpStatus: options?.httpStatus ?? HttpStatus.OK,
		messagePath,
		statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
	};

	if (options?.dto) {
		docs.dto = options?.dto;
	}

	return applyDecorators(
		ApiProduces("application/json"),
		ApiExtraModels(options.dto as any),
		ApiResponse({
			description: docs.httpStatus.toString(),
			status: docs.httpStatus,
			schema: {
				properties: {
					message: {
						example: messagePath,
					},
					statusCode: {
						type: "number",
						example: docs.statusCode,
					},
					data: {
						type: "array",
						items: {
							$ref: getSchemaPath(docs.dto),
						},
					},
				},
			},
		}),
	);
}

export function DocResponseFile(options?: IDocResponseFileOptions): MethodDecorator {
	const httpStatus: HttpStatus = options?.httpStatus ?? HttpStatus.OK;

	return applyDecorators(
		ApiProduces(options?.fileType ?? ENUM_FILE_MIME.CSV),
		ApiResponse({
			description: httpStatus.toString(),
			status: httpStatus,
		}),
	);
}
