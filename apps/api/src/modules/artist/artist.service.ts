import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Artist } from "@prisma/client";
import { ArtistUpdateDto } from "./dto/request/artist.update.dto";
import { ArtistCreateDto } from "./dto/request/artist.create.request.dto";

@Injectable()
export class ArtistService {
	constructor(private readonly prisma: PrismaService) {}

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

			const user = (artist as any).user;
			delete (artist as any).user;
			return {
				...artist,
				user,
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
}
