import {
	UserCreatePayload,
	UserDeletePayload,
	UserFindMeResponse,
	UserUpdatePayload,
} from "@hitbeatclub/shared-types/user";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import { UserFindMeResponseDto } from "./dto/response/user.find-me.response.dto";
import { HelperHashService } from "~/common/helper/services/helper.hash.service";
import { ARTIST_NOT_FOUND_ERROR } from "../artist/artist.error";
import { ALREADY_FOLLOWING_ARTIST_ERROR, NOT_FOLLOWING_ARTIST_ERROR, USER_PROFILE_UPDATE_ERROR } from "./user.error";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { UserProfileUpdatePayload } from "@hitbeatclub/shared-types/user";

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperHashService: HelperHashService,
	) {}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async socialJoin(createUserDto: UserCreatePayload): Promise<User> {
		return this.prisma.user
			.create({
				data: {
					...createUserDto,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async create(
		createUserDto: UserUpdatePayload & {
			agreedTermsAt: Date | null;
			agreedPrivacyPolicyAt: Date | null;
			agreedEmailAt: Date | null;
		},
	) {
		// 비밀번호가 있는 경우에만 암호화
		let hashedPassword: string | undefined;
		if (createUserDto.password) {
			hashedPassword = this.helperHashService.hashPassword(createUserDto.password);
		}

		return this.prisma.user
			.create({
				data: {
					...createUserDto,
					password: hashedPassword, // 해시된 비밀번호로 저장
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findMe(id: number): Promise<UserFindMeResponseDto> {
		return await this.prisma.user
			.findUnique({
				where: { id, deletedAt: null },
				select: {
					id: true,
					email: true,
					name: true,
					phoneNumber: true,
					gender: true,
					birthDate: true,
					profileUrl: true,
					country: true,
					region: true,
					agreedTermsAt: true,
					agreedPrivacyPolicyAt: true,
					agreedEmailAt: true,
					subscribedAt: true,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async update(
		id: number,
		updateUserDto: UserUpdatePayload & {
			agreedTermsAt: Date | null;
			agreedPrivacyPolicyAt: Date | null;
			agreedEmailAt: Date | null;
		},
	): Promise<User> {
		try {
			return this.prisma.user
				.update({
					where: { id },
					data: {
						...updateUserDto,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data) as User);
		} catch (error) {
			// console.error(error);
			throw new BadRequestException(error);
		}
	}

	async softDelete(id: number, userDeletePayload: UserDeletePayload) {
		return this.prisma.user
			.update({
				where: { id },
				data: {
					deletedAt: new Date(),
					deletedReason: userDeletePayload.deletedReason,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findById(id: number): Promise<User | null> {
		return this.prisma.user
			.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User | null);
	}

	async updatePassword(id: number, hashedPassword: string): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: { password: hashedPassword },
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async findByEmail(email: string) {
		return this.prisma.user
			.findFirst({
				where: {
					email,
					deletedAt: null,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async updateToken(id: number, accessToken: string, refreshToken: string): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: {
					accessToken: accessToken,
					refreshToken: refreshToken,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async updateLastLoginAt(id: number): Promise<User> {
		return this.prisma.user
			.update({
				where: { id: BigInt(id) },
				data: { lastLoginAt: new Date() },
			})
			.then((data) => this.prisma.serializeBigInt(data) as User);
	}

	async findByNameAndPhoneNumber(name: string, phoneNumber: string) {
		return this.prisma.user
			.findFirst({
				where: { name, phoneNumber, deletedAt: null },
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	// TODO: FIXME: Temporary function
	async updateSubscribedAt(id: number, subscribedAt: Date | null): Promise<User> {
		return this.prisma.user.update({
			where: { id: BigInt(id) },
			data: { subscribedAt },
		});
	}

	// 팔로우한 아티스트 목록 조회
	async findFollowedArtists(
		userId: number,
		options: {
			page?: number;
			limit?: number;
			sort?: "RECENT" | "POPULAR";
			search?: string;
		},
	) {
		const { page = 1, limit = 10, sort = "RECENT", search } = options;
		const skip = (page - 1) * limit;

		const where: any = {
			userId: BigInt(userId),
			deletedAt: null,
		};

		if (search) {
			where.artist = {
				stageName: {
					contains: search,
				},
			};
		}

		const orderBy: any = {};
		if (sort === "RECENT") {
			orderBy.createdAt = "desc";
		} else if (sort === "POPULAR") {
			orderBy.artist = {
				_count: {
					select: {
						userArtistFollow: true,
					},
				},
				orderBy: {
					_count: "desc",
				},
			};
		}

		const [follows, total]: any = await Promise.all([
			this.prisma.$queryRaw`
				SELECT 
					a.id as "artistId",
					a.stage_name as "stageName", 
					f.url as "profileImageUrl",
					(SELECT COUNT(*) FROM user_artist_follow WHERE artist_id = a.id) as "followerCount"
				FROM user_artist_follow uaf
				INNER JOIN artist a ON a.id = uaf.artist_id 
				LEFT JOIN file f ON f.target_table = 'artist'
					AND f.target_id = a.id
					AND f.type = ${ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE}
					AND f.is_enabled = 1
				WHERE uaf.user_id = ${BigInt(userId)}
					AND uaf.deleted_at IS NULL
					${search ? Prisma.sql`AND a.stage_name LIKE ${`%${search}%`}` : Prisma.empty}
				${
					sort === "RECENT"
						? Prisma.sql`ORDER BY uaf.created_at DESC`
						: sort === "POPULAR"
							? Prisma.sql`ORDER BY (SELECT COUNT(*) FROM user_artist_follow WHERE artist_id = a.id) DESC`
							: Prisma.empty
				}
				LIMIT ${limit}
				OFFSET ${skip}
			`,
			this.prisma.userArtistFollow.count({ where }),
		]);

		return {
			data: follows.map((follow) => this.prisma.serializeBigInt(follow)),
			pagination: {
				page,
				limit,
				total,
				totalPage: Math.ceil(total / limit),
			},
		};
	}

	// 아티스트 팔로우
	async followArtist(userId: number, artistId: number) {
		const existingFollow = await this.prisma.userArtistFollow.findFirst({
			where: {
				userId: userId,
				artistId: artistId,
				deletedAt: null,
			},
			select: {
				userId: true,
				artistId: true,
				createdAt: true,
				updatedAt: true,
				deletedAt: true,
			},
		});

		if (existingFollow) {
			throw new BadRequestException(ALREADY_FOLLOWING_ARTIST_ERROR);
		}

		// 아티스트가 존재하는지 확인
		const artist = await this.prisma.artist.findFirst({
			where: { id: artistId, deletedAt: null },
		});

		if (!artist) {
			throw new BadRequestException(ARTIST_NOT_FOUND_ERROR);
		}

		const follow = await this.prisma.userArtistFollow.create({
			data: {
				userId: userId,
				artistId: artistId,
			},
		});

		return this.prisma.serializeBigInt(follow);
	}

	// 아티스트 언팔로우
	async unfollowArtist(userId: number, artistId: number) {
		const existingFollow = await this.prisma.userArtistFollow.findFirst({
			where: {
				userId: userId,
				artistId: artistId,
				deletedAt: null,
			},
		});

		if (!existingFollow) {
			throw new BadRequestException(NOT_FOLLOWING_ARTIST_ERROR);
		}

		const follow = await this.prisma.userArtistFollow.update({
			where: {
				userId_artistId: {
					userId: userId,
					artistId: artistId,
				},
			},
			data: {
				deletedAt: new Date(),
			},
		});

		return this.prisma.serializeBigInt(follow);
	}

	async updateProfile(id: number, updateData: UserProfileUpdatePayload): Promise<User> {
		try {
			return this.prisma.user
				.update({
					where: { id },
					data: {
						...updateData,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e: any) {
			throw new BadRequestException({
				...USER_PROFILE_UPDATE_ERROR,
				detail: e.message,
			});
		}
	}
}
