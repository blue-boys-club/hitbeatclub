import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artist/artist.service";
import { SETTLEMENT_ALREADY_EXISTS_ERROR, SETTLEMENT_NOT_FOUND_ERROR } from "./settlement.error";
import { ARTIST_NOT_FOUND_ERROR } from "../artist/artist.error";
import { SettlementCreateDto } from "./dto/request/settlement.create.dto";
import { SettlementUpdateDto } from "./dto/request/settlement.update.dto";
import type { SettlementCreateRequest, SettlementUpdateRequest } from "@hitbeatclub/shared-types/settlement";

/**
 * 정산 정보 관련 서비스
 * 아티스트의 정산 정보를 조회하고 관리합니다.
 */
@Injectable()
export class SettlementService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly artistService: ArtistService,
	) {}

	async findOneByArtistId(artistId: number) {
		const settlement = await this.prisma.settlement.findUnique({
			where: {
				artistId,
			},
		});

		if (!settlement) {
			throw new NotFoundException(SETTLEMENT_NOT_FOUND_ERROR);
		}

		return settlement;
	}

	async createByArtistId(artistId: number, settlementCreateDto: SettlementCreateDto) {
		const artist = await this.artistService.findOne(artistId).then((data) => this.prisma.serializeBigInt(data));
		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		const existingSettlement = await this.prisma.settlement
			.findUnique({
				where: {
					artistId,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (existingSettlement) {
			throw new BadRequestException(SETTLEMENT_ALREADY_EXISTS_ERROR);
		}

		const settlement = await this.prisma.settlement
			.create({
				data: {
					...(settlementCreateDto as SettlementCreateRequest),
					artistId: artist.id,
				},
				select: {
					id: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return settlement;
	}

	async updateByArtistId(artistId: number, settlementUpdateDto: SettlementUpdateDto) {
		const artist = await this.artistService.findOne(artistId);
		if (!artist) {
			throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
		}

		const existingSettlement = await this.prisma.settlement
			.findUnique({
				where: {
					artistId,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (!existingSettlement) {
			throw new NotFoundException(SETTLEMENT_NOT_FOUND_ERROR);
		}

		const settlement = await this.prisma.settlement
			.update({
				where: { artistId },
				data: settlementUpdateDto,
				select: {
					id: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return settlement;
	}

	async findOne(id: number) {
		const settlement = await this.prisma.settlement.findUnique({
			where: { id },
		});

		if (!settlement) {
			throw new NotFoundException(SETTLEMENT_NOT_FOUND_ERROR);
		}

		return settlement;
	}
}
