import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Artist } from "@prisma/client";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { FileService } from "src/modules/file/file.service";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { ArtistDetailResponseDto } from "./dto/response/artist.detail.response.dto";

@Injectable()
export class ArtistService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll(): Promise<Artist[]> {
		try {
			return await this.prisma.artist
				.findMany({
					where: { deletedAt: null },
					orderBy: { createdAt: "desc" },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Artist[]);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findMe(userId: number): Promise<ArtistDetailResponseDto> {
		const artist = await this.prisma.artist
			.findFirst({
				where: { userId, deletedAt: null },
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
			profileImageUrl: profileImageFile[0]?.url || null,
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

	async create(userId: number, createArtistDto: ArtistCreateDto) {
		const artist = await this.prisma.artist
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
	}: {
		uploaderId: number;
		artistId: number;
		profileImageFileId: number;
	}) {
		if (profileImageFileId) {
			await this.fileService.updateFileEnabledAndDelete({
				uploaderId,
				newFileId: profileImageFileId,
				targetTable: "artist",
				targetId: artistId,
				type: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE,
			});
		}
	}
}
