import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { Genre } from "@prisma/client";

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			return await this.prisma.genre
				.findMany({
					where: { deletedAt: null },
					orderBy: { createdAt: "desc" },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Genre[]);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	/**
	 * 모든 장르별 개수 조회
	 * @returns
	 */
	async findAllWithCount() {
		return await this.prisma.genre
			.findMany({
				where: {
					deletedAt: null,
				},
				select: {
					id: true,
					name: true,
					_count: {
						select: {
							productGenre: {
								where: {
									deletedAt: null,
								},
							},
						},
					},
				},
			})
			.then((data) =>
				this.prisma.serializeBigInt(data).map((genre) => ({
					id: genre.id,
					name: genre.name,
					count: genre._count.productGenre,
				})),
			);
	}
}
