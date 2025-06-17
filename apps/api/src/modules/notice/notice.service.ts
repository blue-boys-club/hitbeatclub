import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { FileService } from "../file/file.service";
import { NoticeCreateRequest, NoticeUpdateRequest, NoticeListQueryRequest } from "@hitbeatclub/shared-types";
import { NOTICE_NOT_FOUND_ERROR, NOTICE_CREATE_ERROR, NOTICE_UPDATE_ERROR, NOTICE_DELETE_ERROR } from "./notice.error";
import { Logger } from "@nestjs/common";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";

@Injectable()
export class NoticeService {
	private readonly logger = new Logger(NoticeService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService,
	) {}

	async findAll(query: NoticeListQueryRequest) {
		try {
			const { page, limit, search, searchType } = query;

			const where: any = {
				deletedAt: null,
			};

			// 검색 조건 추가
			if (search) {
				if (searchType === "title") {
					where.title = { contains: search };
				} else if (searchType === "content") {
					where.content = { contains: search };
				} else {
					where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
				}
			}

			const notices = await this.prisma.notice
				.findMany({
					where,
					orderBy: [{ createdAt: "desc" }],
					skip: (page - 1) * limit,
					take: limit,
				})
				.then((data) => this.prisma.serializeBigInt(data));

			// 각 공지사항의 첨부파일 조회
			const noticeIds = notices.map((notice) => notice.id);
			const allFiles = await this.fileService.findFilesByTargetIds({
				targetIds: noticeIds,
				targetTable: "notice",
			});

			// 파일을 noticeId별로 그룹화
			const filesByNoticeId: Record<string, any[]> = {};
			for (const file of allFiles) {
				if (!filesByNoticeId[file.targetId.toString()]) {
					filesByNoticeId[file.targetId.toString()] = [];
				}
				filesByNoticeId[file.targetId.toString()].push({
					id: file.id.toString(),
					url: file.url,
					originalName: file.originName,
					type: file.type,
				});
			}

			// 결과에 파일 정보 추가
			const result = notices.map((notice) => ({
				...notice,
				id: notice.id.toString(),
				files: filesByNoticeId[notice.id.toString()] || [],
			}));

			return result;
		} catch (error) {
			this.logger.error("공지사항 목록 조회 중 오류 발생", error);
			throw new BadRequestException(error);
		}
	}

	async findOne(id: number) {
		try {
			const notice = await this.prisma.notice
				.findFirst({
					where: { id, deletedAt: null },
				})
				.then((data) => (data ? this.prisma.serializeBigInt(data) : null));

			if (!notice) {
				throw new NotFoundException(NOTICE_NOT_FOUND_ERROR);
			}

			// 조회수 증가
			await this.prisma.notice.update({
				where: { id },
				data: { viewCount: { increment: 1 } },
			});

			// 첨부파일 조회
			const files = await this.fileService.findFilesByTargetIds({
				targetIds: [id],
				targetTable: "notice",
			});

			const fileList = files.map((file) => ({
				id: file.id.toString(),
				url: file.url,
				originalName: file.originName,
				type: file.type,
			}));

			return {
				...notice,
				id: notice.id.toString(),
				files: fileList,
			};
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error("공지사항 상세 조회 중 오류 발생", error);
			throw new BadRequestException(error);
		}
	}

	async create(userId: number, createNoticeDto: NoticeCreateRequest) {
		try {
			const { noticeFileIds, ...noticeData } = createNoticeDto;

			const notice = await this.prisma.notice
				.create({
					data: {
						...noticeData,
						viewCount: 0,
					},
				})
				.then((data) => this.prisma.serializeBigInt(data));

			// 파일 ID가 있는 경우 파일 연결
			if (noticeFileIds && noticeFileIds.length > 0) {
				await this.uploadNoticeFiles({
					uploaderId: userId,
					noticeId: notice.id,
					fileIds: noticeFileIds,
				});
			}

			return notice;
		} catch (error) {
			this.logger.error("공지사항 생성 중 오류 발생", error);
			throw new BadRequestException(NOTICE_CREATE_ERROR);
		}
	}

	async update(userId: number, id: number, updateNoticeDto: NoticeUpdateRequest) {
		try {
			const existingNotice = await this.prisma.notice.findFirst({
				where: { id, deletedAt: null },
			});

			if (!existingNotice) {
				throw new NotFoundException(NOTICE_NOT_FOUND_ERROR);
			}

			const { noticeFileIds, ...noticeData } = updateNoticeDto;

			const notice = await this.prisma.notice.update({
				where: { id },
				data: noticeData,
			});

			// 파일 ID가 있는 경우 기존 파일 삭제 후 새 파일 연결
			if (noticeFileIds !== undefined) {
				// 새 파일 연결
				if (noticeFileIds.length > 0) {
					await this.uploadNoticeFiles({
						uploaderId: userId,
						noticeId: id,
						fileIds: noticeFileIds,
					});
				}
			}

			return this.prisma.serializeBigInt(notice);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error("공지사항 수정 중 오류 발생", error);
			throw new BadRequestException(NOTICE_UPDATE_ERROR);
		}
	}

	async softDelete(id: number) {
		try {
			const existingNotice = await this.prisma.notice.findFirst({
				where: { id, deletedAt: null },
			});

			if (!existingNotice) {
				throw new NotFoundException(NOTICE_NOT_FOUND_ERROR);
			}

			await this.prisma.notice.update({
				where: { id },
				data: { deletedAt: new Date() },
			});

			// 관련 파일도 삭제
			await this.fileService.softDeleteFile(id);

			return { id };
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error("공지사항 삭제 중 오류 발생", error);
			throw new BadRequestException(NOTICE_DELETE_ERROR);
		}
	}

	async getTotal(query: NoticeListQueryRequest) {
		const { search, searchType } = query;

		const where: any = {
			deletedAt: null,
		};

		if (search) {
			if (searchType === "title") {
				where.title = { contains: search };
			} else if (searchType === "content") {
				where.content = { contains: search };
			} else {
				where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
			}
		}

		return await this.prisma.notice.count({ where });
	}

	private async uploadNoticeFiles({
		uploaderId,
		noticeId,
		fileIds,
	}: {
		uploaderId: number;
		noticeId: number;
		fileIds: number[];
	}) {
		try {
			// 파일 ID들을 notice와 연결
			for (const fileId of fileIds) {
				await this.fileService.updateFileEnabledAndDelete({
					uploaderId,
					newFileId: fileId,
					targetId: noticeId,
					targetTable: "notice",
					type: ENUM_FILE_TYPE.NOTICE_FILE,
				});
			}
		} catch (error) {
			this.logger.error("공지사항 파일 연결 중 오류 발생", error);
			throw error;
		}
	}
}
