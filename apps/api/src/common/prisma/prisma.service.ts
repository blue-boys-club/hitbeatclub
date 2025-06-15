import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";

// type SerializeBigIntResponse<T> =
// 	// bigint → number 변환
// 	T extends bigint
// 		? number
// 		: // 배열 처리
// 			T extends Array<infer U>
// 			? SerializeBigIntResponse<U>[]
// 			: // 객체(프로토타입 기반) 처리 – 재귀적으로 순회
// 				T extends object
// 				? {
// 						[K in keyof T]: SerializeBigIntResponse<T[K]>;
// 					}
// 				: // 나머지(프리미티브) 타입은 그대로 유지
// 					T;
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	// BigInt 직렬화 처리를 위한 도우미 함수 (json-bigint 사용)
	serializeBigInt(data: any): any {
		return JSONbig.parse(JSONbig.stringify(data));
	}
}
