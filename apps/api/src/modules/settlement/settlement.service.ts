import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artist/artist.service";

/**
 * 정산 관련 서비스
 * 아티스트의 수익 정산 및 관리를 담당합니다.
 */
@Injectable()
export class SettlementService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly artistService: ArtistService,
	) {}

	async saveSettlement(userId: number) {}

	/**
	 * 아티스트별 정산 내역을 조회합니다
	 *
	 * @description 특정 아티스트의 수익 정산 내역을 기간별로 조회할 수 있습니다.
	 *
	 * @param artistId - 조회할 아티스트 ID
	 * @param startDate - 조회 시작 날짜 (선택사항)
	 * @param endDate - 조회 종료 날짜 (선택사항)
	 * @returns 정산 내역 목록
	 *
	 * @throws {NotFoundException} 아티스트를 찾을 수 없는 경우
	 *
	 * @example
	 * ```typescript
	 * const settlements = await settlementService.findByArtist(123);
	 * ```
	 */
	async findByArtist(artistId: number, startDate?: Date, endDate?: Date) {
		// 아티스트 존재 확인
		const artist = await this.artistService.findOne(artistId);
		if (!artist) {
			throw new NotFoundException("Artist not found");
		}

		try {
			const whereCondition: any = {
				artistId,
				deletedAt: null,
			};

			if (startDate && endDate) {
				whereCondition.createdAt = {
					gte: startDate,
					lte: endDate,
				};
			}

			// TODO: Settlement 테이블 구현 후 실제 정산 데이터 조회
			// const settlements = await this.prisma.settlement.findMany({
			//   where: whereCondition,
			//   orderBy: { createdAt: 'desc' }
			// });

			// 임시 응답
			return {
				artistId,
				totalRevenue: 0,
				settlements: [],
				period: { startDate, endDate },
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	/**
	 * 정산을 처리합니다
	 *
	 * @description 미처리 상태의 정산을 완료 처리합니다.
	 *
	 * @param settlementId - 처리할 정산 ID
	 * @returns 처리된 정산 정보
	 *
	 * @throws {NotFoundException} 정산을 찾을 수 없는 경우
	 * @throws {BadRequestException} 이미 처리된 정산인 경우
	 *
	 * @example
	 * ```typescript
	 * const result = await settlementService.processSettlement(456);
	 * ```
	 */
	async processSettlement(settlementId: number) {
		try {
			// TODO: Settlement 테이블 구현 후 실제 처리 로직 구현
			// const settlement = await this.prisma.settlement.findFirst({
			//   where: { id: settlementId, deletedAt: null }
			// });

			// if (!settlement) {
			//   throw new NotFoundException(SETTLEMENT_NOT_FOUND_ERROR);
			// }

			// if (settlement.status === 'PROCESSED') {
			//   throw new BadRequestException(SETTLEMENT_ALREADY_PROCESSED_ERROR);
			// }

			// const updatedSettlement = await this.prisma.settlement.update({
			//   where: { id: settlementId },
			//   data: {
			//     status: 'PROCESSED',
			//     processedAt: new Date()
			//   }
			// });

			// 임시 응답
			return {
				settlementId,
				status: "PROCESSED",
				processedAt: new Date(),
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	/**
	 * 사용자의 정산 내역을 조회합니다
	 *
	 * @description 인증된 사용자의 아티스트 정산 내역을 조회합니다.
	 *
	 * @param userId - 사용자 ID
	 * @returns 사용자의 정산 내역
	 *
	 * @throws {NotFoundException} 사용자나 아티스트를 찾을 수 없는 경우
	 */
	async findMySettlements(userId: number) {
		const artist = await this.artistService.findByUserId(userId);
		if (!artist) {
			throw new NotFoundException("Artist profile not found");
		}

		return this.findByArtist(Number(artist.id));
	}
}
