import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";

// type SerializeBigIntResponse<T> = T;

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

	serializeBigIntTyped<T>(data: T): T {
		return JSONbig.parse(JSONbig.stringify(data)) as T;
	}
}
