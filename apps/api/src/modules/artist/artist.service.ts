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
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class ArtistService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
		private readonly notificationService: NotificationService,
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

		// subscribe 조회
		const subscribe = await this.prisma.subscribe
			.findFirst({
				where: {
					userId,
					deletedAt: null,
					cancelledAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));

		const soldTrackCount = await this.prisma.orderItem
			.count({
				where: {
					sellerId: artist.id,
					deletedAt: null,
					order: {
						status: "COMPLETED",
						deletedAt: null,
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
			subscribe: subscribe || null,
			soldTrackCount,
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
				id: artist.id,
				userId: artist.userId,
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

	async reportArtist(reqUserId: number, artistId: number, reportData: ArtistReportRequestDto) {
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
					userId: reqUserId,
					artistId,
					reporterName: reportData.reporterName,
					reporterPhone: reportData.reporterPhone,
					reporterEmail: reportData.reporterEmail,
					content: reportData.content,
					agreedPrivacyPolicy: reportData.agreedPrivacyPolicy,
				},
			});

			try {
				await this.notificationService.create(reqUserId, {
					type: "REPORT_PROCESSED",
					receiverId: reqUserId,
					templateData: {
						beatName: artist.stageName,
					},
				});
			} catch (e) {
				console.error(e);
			}

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

	async getStatistics(artistId: number) {
		try {
			// 가장 좋아요를 많이 받은 트랙들 (최대 5개)
			const mostLikedTracks = await this.prisma.$queryRaw`
				SELECT 
					p.id,
					p.id as productId,
					p.product_name as productName,
					p.view_count as viewCount,
					COUNT(pl.id) as likeCount,
					f.url as imageUrl
				FROM product p
				LEFT JOIN product_like pl ON p.id = pl.product_id AND pl.deleted_at IS NULL
				LEFT JOIN file f ON p.id = f.target_id 
					AND f.target_table = 'product' 
					AND f.type = ${ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE}
					AND f.is_enabled = 1 
					AND f.deleted_at IS NULL
				WHERE p.seller_id = ${artistId} AND p.deleted_at IS NULL AND f.url IS NOT NULL
				GROUP BY p.id
				ORDER BY likeCount DESC, p.view_count DESC
				LIMIT 5
			`.then((data) => this.prisma.serializeBigInt(data));

			// 가장 많이 재생된 트랙들 (최대 5개)
			const mostPlayedTracks = await this.prisma.$queryRaw`
				SELECT 
					p.id,
					p.id as productId,
					p.product_name as productName,
					p.view_count as viewCount,
					f.url as imageUrl
				FROM product p
				LEFT JOIN file f ON p.id = f.target_id 
					AND f.target_table = 'product' 
					AND f.type = ${ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE}
					AND f.is_enabled = 1 
					AND f.deleted_at IS NULL
				WHERE p.seller_id = ${artistId} AND p.deleted_at IS NULL AND f.url IS NOT NULL
				GROUP BY p.id
				ORDER BY p.view_count DESC
				LIMIT 5
			`.then((data) => this.prisma.serializeBigInt(data));

			// 한달간 재생이 많은 국가 (최대 5개)
			const oneMonthAgo = new Date();
			oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

			const topCountries = await this.prisma.$queryRaw`
				SELECT 
					u.country,
					COUNT(*) as playCount
				FROM playlist_log pl
				JOIN user u ON pl.user_id = u.id
				JOIN product p ON pl.product_id = p.id
				WHERE p.seller_id = ${artistId} 
					AND pl.created_at >= ${oneMonthAgo}
					AND pl.deleted_at IS NULL
					AND u.country IS NOT NULL
				GROUP BY u.country
				ORDER BY playCount DESC
				LIMIT 5
			`.then((data) => this.prisma.serializeBigInt(data));

			// 총 월간 재생 수 계산 (비율 계산용)
			const totalMonthlyPlays = topCountries.reduce((sum, country) => sum + Number(country.playCount), 0);

			const formattedTopCountries = topCountries.map((country) => ({
				countryCode: country.country,
				playCount: Number(country.playCount),
				percentage: totalMonthlyPlays > 0 ? Math.round((Number(country.playCount) / totalMonthlyPlays) * 100) : 0,
			}));

			return {
				mostLikedTracks: mostLikedTracks,
				mostPlayedTracks: mostPlayedTracks,
				topCountries: formattedTopCountries,
			};
		} catch (error) {
			throw new BadRequestException(`통계 조회에 실패했습니다: ${error.message}`);
		}
	}
}
