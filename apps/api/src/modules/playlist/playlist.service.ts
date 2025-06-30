import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { ProductService } from "../product/product.service";
import { UserService } from "../user/user.service";
import { CartService } from "../cart/cart.service";
import { ENUM_PRODUCT_CATEGORY, ENUM_PRODUCT_SORT } from "../product/product.enum";
import { UserLikeProductListRequest } from "@hitbeatclub/shared-types";

// TODO: Replace 'any' with actual imports when shared-types export is available
type PlaylistAutoRequest = any;
type PlaylistManualRequest = { trackIds: number[] };

@Injectable()
export class PlaylistService {
	private readonly logger = new Logger(PlaylistService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly productService: ProductService,
		private readonly userService: UserService,
		private readonly cartService: CartService,
	) {}

	/**
	 * 자동 재생목록 (컨텍스트 기반)
	 * @param userId 로그인 사용자 ID(optional)
	 * @param payload PlaylistAutoRequest
	 */
	async createAutoPlaylist(userId: number | undefined, payload: PlaylistAutoRequest) {
		const { type } = payload;
		let trackIds: number[] = [];

		try {
			switch (type) {
				case "MAIN": {
					const { category } = payload;
					const where: any = { isPublic: 1 };

					if (category === "BEAT") {
						where.category = ENUM_PRODUCT_CATEGORY.BEAT;
					} else if (category === "ACAPELLA") {
						where.category = ENUM_PRODUCT_CATEGORY.ACAPELA;
					}

					const items = await this.productService.findAll(
						where,
						{ page: 1, limit: 100, sort: ENUM_PRODUCT_SORT.RECENT },
						["id"],
					);
					trackIds = items.map((p: any) => Number(p.id));
					break;
				}
				case "SEARCH": {
					// payload.query 는 ProductSearchQuerySchema 기반 (page, limit 제거됨)
					const items = await this.createSearchPlaylist(payload);
					trackIds = items.trackIds;
					break;
				}
				case "ARTIST": {
					const items = await this.createArtistPlaylist(userId, payload);
					trackIds = items.trackIds;
					break;
				}
				case "FOLLOWING": {
					if (!userId) {
						throw new BadRequestException("로그인 필요");
					}
					const followed = await this.userService.findFollowedArtists(userId, {
						page: 1,
						limit: 100,
					});
					const artistIds = followed.data.map((a: any) => Number(a.artistId));
					if (artistIds.length === 0) break;

					const items = await this.productService.findAll(
						{ isPublic: 1, sellerId: { in: artistIds } },
						{ page: 1, limit: 100, sort: ENUM_PRODUCT_SORT.RECENT },
						["id"],
					);
					trackIds = items.map((p: any) => Number(p.id));
					break;
				}
				case "LIKED": {
					if (!userId) {
						throw new BadRequestException("로그인 필요");
					}
					const likedProductsPayload: UserLikeProductListRequest = {
						...payload,
						page: 1,
						limit: 100,
					};
					const liked = await this.productService.findLikedProducts(userId, likedProductsPayload);
					trackIds = liked.data.map((p: any) => Number(p.id));
					break;
				}
				case "CART": {
					if (!userId) {
						throw new BadRequestException("로그인 필요");
					}
					const cartItems = await this.cartService.findAll(userId);
					trackIds = cartItems.map((item: any) => Number(item.product.id));
					break;
				}
				default:
					trackIds = [];
			}
		} catch (e) {
			this.logger.error(e);
			throw new BadRequestException(e);
		}

		trackIds = trackIds.slice(0, 100);

		if (userId) {
			await this.savePlaylist(userId, trackIds, payload.type, payload);
		}

		return { trackIds };
	}

	private async createSearchPlaylist(payload: Extract<PlaylistAutoRequest, { type: "SEARCH" }>) {
		const { query } = payload;
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = query;

		const where = {
			...(category === "null" ? {} : { category }),
			...(musicKey === "null" ? {} : { musicKey }),
			...(scaleType === "null" ? {} : { scaleType }),
			...(minBpm ? { minBpm: { lte: minBpm }, maxBpm: { gte: minBpm } } : {}),
			...(maxBpm ? { minBpm: { lte: maxBpm }, maxBpm: { gte: maxBpm } } : {}),
			...(genreIds && genreIds.length > 0
				? {
						productGenre: {
							some: {
								deletedAt: null,
								genreId: { in: genreIds },
							},
						},
					}
				: {}),
			...(tagIds && tagIds.length > 0
				? {
						productTag: {
							some: {
								deletedAt: null,
								tagId: { in: tagIds },
							},
						},
					}
				: {}),
			isPublic: 1,
		};

		const items = await this.productService.findAll(where, { page: 1, limit: 100, sort: ENUM_PRODUCT_SORT.RECENT }, [
			"id",
		]);
		const trackIds = items.map((p: any) => Number(p.id));
		return { trackIds };
	}

	private async createArtistPlaylist(userId: number, payload: Extract<PlaylistAutoRequest, { type: "ARTIST" }>) {
		const { artistId, query } = payload;
		const { category, musicKey, scaleType, minBpm, maxBpm, genreIds, tagIds } = query;

		const where = {
			sellerId: artistId,
			isPublic: 1, // 공개된 제품만 조회
			...(category === "null" || category === undefined ? {} : { category }),
			...(musicKey === "null" || musicKey === undefined ? {} : { musicKey }),
			...(scaleType === "null" || scaleType === undefined ? {} : { scaleType }),
			...(minBpm ? { minBpm: { lte: minBpm }, maxBpm: { gte: minBpm } } : {}),
			...(maxBpm ? { minBpm: { lte: maxBpm }, maxBpm: { gte: maxBpm } } : {}),
			...(genreIds && genreIds.length > 0
				? {
						productGenre: {
							some: {
								deletedAt: null,
								genreId: { in: genreIds },
							},
						},
					}
				: {}),
			...(tagIds && tagIds.length > 0
				? {
						productTag: {
							some: {
								deletedAt: null,
								tagId: { in: tagIds },
							},
						},
					}
				: {}),
		};

		const items = await this.productService.findAll(where, { page: 1, limit: 100, sort: ENUM_PRODUCT_SORT.RECENT }, [
			"id",
		]);
		const trackIds = items.map((p: any) => Number(p.id));
		return { trackIds };
	}

	/**
	 * 수동 재생목록 - 클라이언트에서 전달된 trackIds 기반
	 */
	async createManualPlaylist(userId: number | undefined, payload: PlaylistManualRequest) {
		let trackIds = payload.trackIds.slice(0, 100);

		if (userId) {
			await this.savePlaylist(userId, trackIds, "MANUAL", { trackIds });
		}

		return { trackIds };
	}

	/**
	 * DB에 Playlist 저장 (있으면 update, 없으면 create)
	 */
	private async savePlaylist(userId: number, trackIds: number[], sourceContext: string, contextData: any) {
		// BigInt 변환
		const userIdBig = BigInt(userId);

		const existing = await this.prisma.playlist
			.findFirst({
				where: { userId: userIdBig, deletedAt: null },
			})
			.then((playlist) => this.prisma.serializeBigIntTyped(playlist));

		if (existing) {
			await this.prisma.playlist.update({
				where: { id: existing.id },
				data: {
					trackIds: trackIds,
					currentIndex: 0,
					sourceContext,
					contextData,
				} as any,
			});
		} else {
			await this.prisma.playlist.create({
				data: {
					userId: userIdBig,
					trackIds: trackIds,
					currentIndex: 0,
					sourceContext,
					contextData,
				} as any,
			});
		}
	}

	/**
	 * 사용자가 현재 재생목록을 덮어쓰는 PUT /users/me/playlist 용 메서드
	 */
	async overwritePlaylist(userId: number, payload: { trackIds: number[]; currentIndex: number }) {
		let { trackIds, currentIndex } = payload;
		trackIds = (trackIds || []).slice(0, 100);
		if (currentIndex < 0) currentIndex = 0;
		if (currentIndex >= trackIds.length) currentIndex = trackIds.length - 1;

		const userIdBig = BigInt(userId);

		// 최신 플레이리스트 정보를 담기 위한 변수
		let playlistRecord: any;

		const existing = await this.prisma.playlist
			.findFirst({
				where: { userId: userIdBig, deletedAt: null },
			})
			.then((playlist) => this.prisma.serializeBigIntTyped(playlist));

		if (existing) {
			playlistRecord = await this.prisma.playlist
				.update({
					where: { id: existing.id },
					data: {
						trackIds,
						currentIndex,
						updatedAt: new Date(),
					} as any,
				})
				.then((pl) => this.prisma.serializeBigIntTyped(pl));
		} else {
			playlistRecord = await this.prisma.playlist
				.create({
					data: {
						userId: userIdBig,
						trackIds,
						currentIndex,
						sourceContext: "MANUAL", // overwrite는 컨텍스트 의미 없음 → MANUAL 지정
					} as any,
				})
				.then((pl) => this.prisma.serializeBigIntTyped(pl));
		}

		// ───────── 최근 재생 트랙 관리 ─────────
		if (trackIds.length > 0 && currentIndex >= 0) {
			const playedTrackId = trackIds[currentIndex];
			await this.recordRecentTrack(userId, BigInt(playlistRecord.id), playedTrackId);
		}

		return { trackIds, currentIndex };
	}

	/**
	 * 최근 재생 트랙 저장 / 업데이트 (중복 제거, 최대 100개 유지)
	 */
	private async recordRecentTrack(userId: number, playlistId: bigint, playedTrackId: number) {
		try {
			const userIdBig = BigInt(userId);
			const existing = await this.prisma.playedTracks
				.findFirst({
					where: { userId: userIdBig, deletedAt: null },
				})
				.then((pt) => this.prisma.serializeBigIntTyped(pt));

			if (existing) {
				let trackIds: number[] = (existing.trackIds ?? []) as number[];
				// 중복 제거 후 맨 앞에 추가
				trackIds = trackIds.filter((id) => id !== playedTrackId);
				trackIds.unshift(playedTrackId);
				trackIds = trackIds.slice(0, 100);

				await this.prisma.playedTracks.update({
					where: { id: BigInt(existing.id) },
					data: {
						trackIds,
						playlistId,
						updatedAt: new Date(),
					} as any,
				});
			} else {
				await this.prisma.playedTracks.create({
					data: {
						userId: userIdBig,
						playlistId,
						trackIds: [playedTrackId],
					} as any,
				});
			}
		} catch (e) {
			this.logger.error(e);
		}
	}

	/**
	 * 최근 재생목록 조회 (GET /users/me/playlist/recent)
	 */
	async findRecentPlaylist(userId: number) {
		const userIdBig = BigInt(userId);
		const played = await this.prisma.playedTracks
			.findFirst({
				where: { userId: userIdBig, deletedAt: null },
				orderBy: { updatedAt: "desc" },
			})
			.then((pt) => this.prisma.serializeBigIntTyped(pt));

		if (!played) {
			return { trackIds: [], tracks: [] };
		}

		const trackIds: number[] = (played.trackIds ?? []) as number[];
		if (trackIds.length === 0) {
			return { trackIds: [], tracks: [] };
		}

		// Product 상세 정보 병합 (order 유지)
		const tracks = await Promise.all(trackIds.map((id) => this.productService.findOne(id, userId)));

		return { trackIds, tracks };
	}

	/**
	 * GET /users/me/playlist 저장된 재생목록 반환
	 */
	async findPlaylist(userId: number) {
		const playlist = await this.prisma.playlist
			.findFirst({
				where: { userId: BigInt(userId), deletedAt: null },
			})
			.then((playlist) => this.prisma.serializeBigIntTyped(playlist));

		if (!playlist) {
			return { trackIds: [], currentIndex: 0 };
		}

		const pl: any = playlist;
		return {
			trackIds: pl?.trackIds ?? [],
			currentIndex: pl?.currentIndex ?? 0,
		};
	}
}
