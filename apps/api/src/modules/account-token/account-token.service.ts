// account-token.service.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { TokenPurpose } from "@prisma/client";
import moment from "moment";
import crypto from "crypto";

@Injectable()
export class AccountTokenService {
	constructor(private readonly prisma: PrismaService) {}

	/** 토큰 발급 */
	async issueToken(userId: bigint, purpose: TokenPurpose, ttlMinutes: number = 10) {
		const token = crypto.randomUUID();

		return this.prisma.$transaction(async (tx) => {
			// 1) 기존 활성 토큰 비활성화 (active를 null로 설정하여 unique constraint 해제)
			await tx.accountToken.updateMany({
				where: { userId, purpose, active: true, deletedAt: null },
				data: { active: null, consumedAt: new Date() },
			});

			// 2) 새 토큰 발급
			return tx.accountToken.create({
				data: {
					token,
					purpose,
					userId,
					expiresAt: moment().add(ttlMinutes, "minutes").toDate(),
				},
			});
		});
	}

	/** 토큰 정보 조회 (소모하지 않음) */
	async getTokenInfo(rawToken: string) {
		const now = new Date();

		const row = await this.prisma.accountToken.findFirst({
			where: {
				token: rawToken,
				active: true,
				deletedAt: null,
				expiresAt: { gt: now },
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		return row;
	}

	/** 1회용 토큰 검증 & 소모 */
	async consumeToken(rawToken: string) {
		const now = new Date();

		const row = await this.prisma.accountToken.findFirst({
			where: {
				token: rawToken,
				active: true,
				deletedAt: null,
				expiresAt: { gt: now },
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!row) throw new BadRequestException("토큰이 유효하지 않거나 만료되었습니다.");

		await this.prisma.accountToken.update({
			where: { id: row.id },
			data: { active: null, consumedAt: now },
		});

		return row;
	}

	/** 특정 목적의 토큰 검증 & 소모 */
	async consumeTokenByPurpose(rawToken: string, purpose: TokenPurpose, userEmail?: string) {
		const now = new Date();

		const where: any = {
			token: rawToken,
			purpose,
			active: true,
			deletedAt: null,
			expiresAt: { gt: now },
		};

		// 이메일이 제공된 경우 사용자 검증도 포함
		if (userEmail) {
			where.user = {
				email: userEmail,
				deletedAt: null,
			};
		}

		const row = await this.prisma.accountToken.findFirst({
			where,
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!row) throw new BadRequestException("토큰이 유효하지 않거나 만료되었습니다.");

		await this.prisma.accountToken.update({
			where: { id: row.id },
			data: { active: null, consumedAt: now },
		});

		return row;
	}

	/** 만료·휴지 토큰 소프트 삭제 (retentionDays 이후) */
	async softDeleteGarbage(retentionDays: number) {
		const border = moment().subtract(retentionDays, "days").toDate();

		return this.prisma.accountToken.updateMany({
			where: {
				deletedAt: null,
				OR: [{ active: null }, { expiresAt: { lt: new Date() } }],
				expiresAt: { lt: border },
			},
			data: { deletedAt: new Date() },
		});
	}
}
