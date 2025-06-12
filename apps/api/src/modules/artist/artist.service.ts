import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Artist, Prisma } from "@prisma/client";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { FileService } from "src/modules/file/file.service";
import { ArtistListResponse, ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";

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
		if (profileImageFileId) {
			await this.fileService.updateFileEnabledAndDelete(
				{
					uploaderId,
					newFileId: profileImageFileId,
					targetTable: "artist",
					targetId: artistId,
					type: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE,
				},
				tx,
			);
		}
	}
}
