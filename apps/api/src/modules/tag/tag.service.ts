import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Tag } from "@prisma/client";
import { TagCreateDto } from "./dto/request/tag.create.request.dto";
import { TAG_ALREADY_EXISTS_ERROR, TAG_CREATE_ERROR, TAG_MAX_COUNT_ERROR } from "./tag.error";

@Injectable()
export class TagService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			return await this.prisma.tag
				.findMany({
					where: { deletedAt: null },
					orderBy: { createdAt: "desc" },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Tag[]);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findOne(id: number) {
		try {
			const tag = await this.prisma.tag
				.findFirst({
					where: { id, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigInt(data) as Tag);

			return tag;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async create(userId: number, createTagDto: TagCreateDto) {
		try {
			const isExistsTag = await this.isExistsTag(createTagDto.name);
			if (isExistsTag) {
				throw new BadRequestException(TAG_ALREADY_EXISTS_ERROR);
			}

			const tagCount = await this.findTagCountByUserId(userId);
			if (tagCount >= 5) {
				throw new BadRequestException(TAG_MAX_COUNT_ERROR);
			}

			return await this.prisma.tag
				.create({
					data: {
						...createTagDto,
						userId,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e: any) {
			if (e?.response) {
				throw new BadRequestException(e.response);
			}

			throw new BadRequestException({
				...TAG_CREATE_ERROR,
				detail: e?.message,
			});
		}
	}

	/**
	 * 유저 태그 개수 조회
	 * @param userId
	 * @returns
	 */
	async findTagCountByUserId(userId: number) {
		const tagCount = await this.prisma.tag.count({
			where: { userId, deletedAt: null },
		});
		return tagCount;
	}

	/**
	 * 태그 존재여부
	 * @param name
	 * @returns
	 */
	async isExistsTag(name: string) {
		const tag = await this.prisma.tag.findFirst({
			where: { name, deletedAt: null },
		});
		return !!tag;
	}

	/**
	 * 태그 삭제
	 * @param id
	 * @returns
	 */
	async softDelete(id: number) {
		try {
			return await this.prisma.$transaction(async (transaction) => {
				await transaction.productTag.deleteMany({
					where: { tagId: id },
				});

				// tag 삭제
				return await transaction.tag
					.update({
						where: { id },
						data: { deletedAt: new Date() },
					})
					.then((data) => this.prisma.serializeBigInt(data));
			});
		} catch (error) {
			throw new BadRequestException(error);
		}
	}
}
