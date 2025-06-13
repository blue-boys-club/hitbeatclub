import { Injectable } from "@nestjs/common";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SHA256, enc } from "crypto-js";
import { IHelperHashService } from "~/common/helper/interfaces/helper.hash-service.interface";

@Injectable()
export class HelperHashService implements IHelperHashService {
	constructor() {}

	randomSalt(length: number): string {
		return genSaltSync(length);
	}

	bcrypt(passwordString: string, salt: string): string {
		return hashSync(passwordString, salt);
	}

	bcryptCompare(passwordString: string, passwordHashed: string): boolean {
		return compareSync(passwordString, passwordHashed);
	}

	sha256(string: string): string {
		return SHA256(string).toString(enc.Hex);
	}

	sha256Compare(hashOne: string, hashTwo: string): boolean {
		return hashOne === hashTwo;
	}

	/**
	 * 비밀번호를 해시화합니다 (자동으로 salt 생성)
	 * @param password 원본 비밀번호
	 * @returns 해시된 비밀번호
	 */
	hashPassword(password: string): string {
		const salt = this.randomSalt(10);
		return this.bcrypt(password, salt);
	}

	/**
	 * 비밀번호를 검증합니다
	 * @param password 원본 비밀번호
	 * @param hashedPassword 해시된 비밀번호
	 * @returns 일치 여부
	 */
	comparePassword(password: string, hashedPassword: string): boolean {
		return this.bcryptCompare(password, hashedPassword);
	}
}
