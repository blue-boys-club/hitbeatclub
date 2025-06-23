import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { PlayerStartRequestDto } from "./dto/request/player.start.request.dto";
import { PLAYER_LIST_FIND_ERROR, PLAYER_RECORD_CREATE_ERROR, PLAYER_RECORD_NOT_FOUND_ERROR } from "./player.error";
import { ENUM_PRODUCT_FILE_TYPE } from "../product/product.enum";

@Injectable()
export class PlayerService {
	private readonly logger = new Logger(PlayerService.name);

	constructor(private readonly prisma: PrismaService) {}

	async createPlayRecord(playerStartRequestDto: PlayerStartRequestDto) {
		try {
			const { productId, userId } = playerStartRequestDto;

			// 이미 존재하는 플레이리스트 확인
			const existingPlaylist = await this.prisma.playlist
				.findFirst({
					where: {
						userId,
						productId,
						deletedAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigIntTyped(data));

			if (existingPlaylist) {
				// 이미 존재하면 업데이트
				const updatedPlaylist = await this.prisma.playlist.update({
					where: {
						id: existingPlaylist.id,
					},
					data: {
						updatedAt: new Date(),
					},
				});
				return this.prisma.serializeBigInt(updatedPlaylist);
			}

			// 새로운 플레이리스트 생성
			const playRecord = await this.prisma.playlist.create({
				data: {
					userId,
					productId,
				},
			});

			return this.prisma.serializeBigInt(playRecord);
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(PLAYER_RECORD_CREATE_ERROR);
		}
	}

	async findPlayList(userId: number, page: number = 1, limit: number = 10) {
		try {
			const skip = (page - 1) * limit;
			const playRecords = await this.prisma.playlist
				.findMany({
					where: {
						userId,
						deletedAt: null,
					},
					include: {
						product: {
							select: {
								id: true,
								productName: true,
								category: true,
								artistSellerIdToArtist: {
									select: {
										id: true,
										stageName: true,
										profileImageUrl: true,
									},
								},
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
					skip,
					take: Number(limit),
				})
				.then((data) => this.prisma.serializeBigInt(data));

			const productIds = playRecords.map((record) => Number(record.product.id));
			const allFiles = await this.prisma.file
				.findMany({
					where: {
						targetId: { in: productIds.map((id) => BigInt(id)) },
						targetTable: "product",
						deletedAt: null,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			const filesByProductId: Record<string, any[]> = {};
			for (const file of allFiles) {
				if (!filesByProductId[file.targetId.toString()]) {
					filesByProductId[file.targetId.toString()] = [];
				}
				filesByProductId[file.targetId.toString()].push(file);
			}

			const result = [];
			for (const playRecord of playRecords) {
				const product = playRecord.product;
				const seller = product.artistSellerIdToArtist;
				delete product.artistSellerIdToArtist;

				const files = filesByProductId[product.id.toString()] ?? [];
				const audioFile = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_AUDIO_FILE);
				const coverImage = files.find((file) => file.type === ENUM_PRODUCT_FILE_TYPE.PRODUCT_COVER_IMAGE);

				result.push({
					id: playRecord.id,
					productId: product.id,
					productName: product.productName,
					seller: {
						id: seller.id,
						stageName: seller.stageName,
						profileImageUrl: seller.profileImageUrl,
						isVerified: seller.isVerified,
					},
					audioFile: audioFile
						? {
								id: audioFile.id,
								url: audioFile.url,
								originName: audioFile.originName,
							}
						: null,
					coverImage: coverImage
						? {
								id: coverImage.id,
								url: coverImage.url,
								originName: coverImage.originName,
							}
						: null,
				});
			}

			const total = await this.prisma.playlist.count({
				where: {
					userId,
					deletedAt: null,
				},
			});

			return {
				data: this.prisma.serializeBigInt(result),
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			};
		} catch (error: any) {
			console.log("findPlayList error:", error);
			throw new BadRequestException({
				...PLAYER_LIST_FIND_ERROR,
				detail: error.message,
			});
		}
	}
}
