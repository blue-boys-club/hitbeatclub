import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { QuestionCreateDto } from "./dto/request/question.create.dto";
import { QuestionUpdateDto } from "./dto/request/question.update.dto";
import {
	QUESTION_CREATE_ERROR,
	QUESTION_FIND_ERROR,
	QUESTION_NOT_FOUND_ERROR,
	QUESTION_DETAIL_ERROR,
	QUESTION_UPDATE_ERROR,
	QUESTION_DELETE_ERROR,
} from "./question.error";

@Injectable()
export class QuestionService {
	private readonly logger = new Logger(QuestionService.name);

	constructor(private readonly prisma: PrismaService) {}

	async create(createQuestionDto: QuestionCreateDto) {
		try {
			const question = await this.prisma.question.create({
				data: {
					title: createQuestionDto.title,
					content: createQuestionDto.content,
				},
			});

			return this.prisma.serializeBigInt(question);
		} catch (error) {
			this.logger.error("Error creating question:", error);
			throw new BadRequestException({ ...QUESTION_CREATE_ERROR, detail: error.message });
		}
	}

	async findAll() {
		try {
			const questions = await this.prisma.question.findMany({
				where: {
					deletedAt: null,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return this.prisma.serializeBigInt(questions);
		} catch (error) {
			this.logger.error("Error finding questions:", error);
			throw new BadRequestException({ ...QUESTION_FIND_ERROR, detail: error.message });
		}
	}

	async findOne(id: number) {
		try {
			const question = await this.prisma.question.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!question) {
				throw new NotFoundException(QUESTION_NOT_FOUND_ERROR);
			}

			return this.prisma.serializeBigInt(question);
		} catch (error) {
			this.logger.error("Error finding question:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...QUESTION_DETAIL_ERROR, detail: error.message });
		}
	}

	async update(id: number, updateQuestionDto: QuestionUpdateDto) {
		try {
			const existingQuestion = await this.prisma.question.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!existingQuestion) {
				throw new NotFoundException(QUESTION_NOT_FOUND_ERROR);
			}

			const updateData: any = {};
			if (updateQuestionDto.title !== undefined) updateData.title = updateQuestionDto.title;
			if (updateQuestionDto.content !== undefined) updateData.content = updateQuestionDto.content;

			const question = await this.prisma.question.update({
				where: {
					id: BigInt(id),
				},
				data: updateData,
			});

			return this.prisma.serializeBigInt(question);
		} catch (error) {
			this.logger.error("Error updating question:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...QUESTION_UPDATE_ERROR, detail: error.message });
		}
	}

	async softDelete(id: number) {
		try {
			const existingQuestion = await this.prisma.question.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!existingQuestion) {
				throw new NotFoundException(QUESTION_NOT_FOUND_ERROR);
			}

			const question = await this.prisma.question.update({
				where: {
					id: BigInt(id),
				},
				data: {
					deletedAt: new Date(),
				},
			});

			return this.prisma.serializeBigInt(question);
		} catch (error) {
			this.logger.error("Error deleting question:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...QUESTION_DELETE_ERROR, detail: error.message });
		}
	}
}
