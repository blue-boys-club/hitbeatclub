import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { Artist, Prisma } from "@prisma/client";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { FileService } from "~/modules/file/file.service";
import { ArtistListResponse, ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";
import {
	ARTIST_NOT_FOUND_ERROR,
	ARTIST_ALREADY_BLOCKED_ERROR,
	ARTIST_NOT_BLOCKED_ERROR,
	ARTIST_SELF_BLOCK_ERROR,
	ARTIST_REPORT_FAILED_ERROR,
} from "./artist.error";
import { ArtistReportRequestDto } from "./dto/request/artist.report.request.dto";

@Injectable()
export class ArtistService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll(): Promise<ArtistListResponse[]> {
		try {
			const artists = await this.prisma.$queryRaw`
				SELECT 
					a.id,
					a.stage_name as stageName,
					f.url as profileImageUrl
				FROM artist a
				LEFT JOIN file f ON a.id = f.target_id 
					AND f.target_table = 'artist'
					AND f.type = ${ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE}
					AND f.is_enabled = 1
					AND f.deleted_at IS NULL
				WHERE a.deleted_at IS NULL
				ORDER BY a.id DESC
			`.then((data) => this.prisma.serializeBigInt(data));

			return artists;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findAllBySearch(search: string) {
		try {
			const searchPattern = `%${search}%`;

			// 아티스트 데이터 조회
			const artists = await this.prisma.$queryRaw`
				SELECT 
					a.id,
					a.stage_name as stageName,
					a.slug as slug,
					a.is_verified as isVerified,
					f.url as profileImageUrl
				FROM artist a
				LEFT JOIN file f ON a.id = f.target_id 
					AND f.target_table = 'artist'
					AND f.type = ${ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE}
					AND f.is_enabled = 1
					AND f.deleted_at IS NULL
				WHERE a.deleted_at IS NULL
				AND a.stage_name LIKE ${searchPattern}
				ORDER BY a.id DESC
			`.then((data) => this.prisma.serializeBigInt(data));

			// 총 개수 조회
			const totalResult = await this.prisma.$queryRaw`
				SELECT COUNT(*) as total
				FROM artist a
				WHERE a.deleted_at IS NULL
				AND a.stage_name LIKE ${searchPattern}
			`.then((data) => this.prisma.serializeBigInt(data));

			const total = totalResult[0]?.total || 0;

			return {
				artists,
				total,
				pagination: {
					total,
					hasMore: false, // 페이징 로직에 따라 조정
				},
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findMe(userId: number): Promise<ArtistDetailResponseDto> {
		const artist = await this.prisma.artist
			.findFirst({
				where: { userId, deletedAt: null },
				include: {
					settlement: {
						select: {
							type: true,
							accountHolder: true,
							accountNumber: true,
							accountBank: true,
							paypalAccount: true,
						},
					},
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		if (!artist) {
			throw new NotFoundException("Artist not found");
		}
		const profileImageFile = await this.fileService
			.findFilesByTargetId({
				targetId: Number(artist.id),
				targetTable: "artist",
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return {
			...artist,
			id: Number(artist.id),
			userId: Number(artist.userId),
			profileImage: profileImageFile[0] || null,
			settlement: artist.settlement[0] || null,
		};
	}

	async findOne(id: number) {
		try {
			const artist = await this.prisma.artist
				.findFirst({
					where: { id, deletedAt: null },
					include: {
						user: {
							select: {
								id: true,
								email: true,
								name: true,
							},
						},
						settlement: {
							select: {
								type: true,
								accountHolder: true,
								accountNumber: true,
								accountBank: true,
								paypalAccount: true,
							},
						},
					},
				})
				.then((data) => this.prisma.serializeBigInt(data) as Artist);

			if (!artist) {
				throw new NotFoundException("Artist not found");
			}
			const profileImageFile = await this.fileService.findFilesByTargetId({
				targetId: Number(artist.id),
				targetTable: "artist",
			});

			return {
				...artist,
				id: Number(artist.id),
				userId: Number(artist.userId),
				profileImageUrl: profileImageFile[0]?.url || null,
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findBySlug(slug: string) {
		try {
			const artist = await this.prisma.artist
				.findFirst({
					where: { slug, deletedAt: null },
					include: {
						user: {
							select: {
								id: true,
								email: true,
								name: true,
							},
						},
						settlement: {
							select: {
								type: true,
								accountHolder: true,
								accountNumber: true,
								accountBank: true,
								paypalAccount: true,
							},
						},
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			if (!artist) {
				throw new NotFoundException("Artist not found");
			}

			// 팔로워 수 조회
			const followerCount = await this.getFollowerCount(artist.id);

			// 트랙 수 조회
			const trackCount = await this.getTrackCount(artist.id);

			const profileImageFile = await this.fileService.findFilesByTargetId({
				targetId: Number(artist.id),
				targetTable: "artist",
			});

			return {
				...artist,
				id: Number(artist.id),
				userId: Number(artist.userId),
				profileImageUrl: profileImageFile[0]?.url || null,
				followerCount,
				trackCount,
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findByUserId(userId: number) {
		try {
			const artist = await this.prisma.artist
				.findFirst({
					where: { userId, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Artist);

			return artist;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async create(userId: number, createArtistDto: ArtistCreateDto, tx?: Prisma.TransactionClient) {
		const prisma = tx ?? this.prisma;

		const artist = await prisma.artist
			.create({
				data: {
					...createArtistDto,
					userId,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		return artist;
	}

	async update(id: number, updateArtistDto: ArtistUpdateDto) {
		try {
			return await this.prisma.artist
				.update({
					where: { id },
					data: updateArtistDto,
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async softDelete(id: number) {
		try {
			return await this.prisma.artist
				.update({
					where: { id },
					data: { deletedAt: new Date() },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async uploadArtistProfile({
		uploaderId,
		artistId,
		profileImageFileId,
		tx,
	}: {
		uploaderId: number;
		artistId: number;
		profileImageFileId: number;
		tx?: Prisma.TransactionClient;
	}) {
		await this.fileService.updateFileEnabledAndDelete(
			{
				uploaderId,
				newFileIds: profileImageFileId ? [profileImageFileId] : [],
				targetTable: "artist",
				targetId: artistId,
				type: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE,
			},
			tx,
		);
	}

	// 아티스트 차단 관련 메서드들
	async blockArtist(userId: number, artistId: number) {
		try {
			if (userId === artistId) {
				throw new BadRequestException(ARTIST_SELF_BLOCK_ERROR);
			}

			// 아티스트가 존재하는지 확인
			const artist = await this.prisma.artist.findFirst({
				where: { id: artistId, deletedAt: null },
			});

			if (!artist) {
				throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
			}

			// 이미 차단되어 있는지 확인
			const existingBlock = await this.prisma.userArtistBlock.findFirst({
				where: {
					userId,
					artistId,
					deletedAt: null,
				},
			});

			if (existingBlock) {
				throw new BadRequestException(ARTIST_ALREADY_BLOCKED_ERROR);
			}

			// 차단 레코드 생성
			const block = await this.prisma.userArtistBlock.create({
				data: {
					userId,
					artistId,
				},
			});

			return this.prisma.serializeBigInt(block);
		} catch (error) {
			if (error instanceof BadRequestException || error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException(error);
		}
	}

	async unblockArtist(userId: number, artistId: number) {
		try {
			// 차단 레코드가 존재하는지 확인
			const existingBlock = await this.prisma.userArtistBlock.findFirst({
				where: {
					userId,
					artistId,
					deletedAt: null,
				},
			});

			if (!existingBlock) {
				throw new BadRequestException(ARTIST_NOT_BLOCKED_ERROR);
			}

			// 소프트 삭제 (차단 해제)
			const unblock = await this.prisma.userArtistBlock.update({
				where: { id: existingBlock.id },
				data: { deletedAt: new Date() },
			});

			return this.prisma.serializeBigInt(unblock);
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(error);
		}
	}

	async getBlockedArtists(userId: number) {
		try {
			const blockedArtists = await this.prisma.userArtistBlock.findMany({
				where: {
					userId,
					deletedAt: null,
				},
				include: {
					artist: {
						select: {
							id: true,
							stageName: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});

			// 각 아티스트의 프로필 이미지 가져오기
			const result = await Promise.all(
				blockedArtists.map(async (block) => {
					const profileImageFile = await this.fileService.findFilesByTargetId({
						targetId: Number(block.artistId),
						targetTable: "artist",
					});

					return {
						id: Number(block.id),
						artistId: Number(block.artistId),
						stageName: block.artist.stageName,
						profileImageUrl: profileImageFile[0]?.url || null,
						createdAt: block.createdAt,
					};
				}),
			);

			return this.prisma.serializeBigInt(result);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async isArtistBlocked(userId: number, artistId: number): Promise<boolean> {
		try {
			const block = await this.prisma.userArtistBlock.findFirst({
				where: {
					userId,
					artistId,
					deletedAt: null,
				},
			});

			return !!block;
		} catch (error) {
			return false;
		}
	}

	async reportArtist(artistId: number, reportData: ArtistReportRequestDto) {
		try {
			// 아티스트가 존재하는지 확인
			const artist = await this.prisma.artist.findFirst({
				where: { id: artistId, deletedAt: null },
			});

			if (!artist) {
				throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
			}

			// 신고 레코드 생성
			const report = await this.prisma.artistReport.create({
				data: {
					artistId,
					reporterName: reportData.reporterName,
					reporterPhone: reportData.reporterPhone,
					reporterEmail: reportData.reporterEmail,
					content: reportData.content,
					agreedPrivacyPolicy: reportData.agreedPrivacyPolicy,
				},
			});

			return this.prisma.serializeBigInt(report);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException(ARTIST_REPORT_FAILED_ERROR);
		}
	}

	async incrementViewCount(artistId: number) {
		try {
			console.log("incrementViewCount", artistId);
			const artist = await this.prisma.artist.findFirst({
				where: { id: artistId },
				select: { viewCount: true },
			});

			await this.prisma.artist
				.update({
					where: { id: artistId },
					data: {
						viewCount: (Number(artist?.viewCount) || 0) + 1,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async getFollowerCount(artistId: number): Promise<number> {
		return await this.prisma.userArtistFollow.count({
			where: {
				artistId: Number(artistId),
				deletedAt: null,
			},
		});
	}

	async getTrackCount(artistId: number): Promise<number> {
		return await this.prisma.product.count({
			where: {
				sellerId: Number(artistId),
				deletedAt: null,
				isPublic: 1,
			},
		});
	}
}
