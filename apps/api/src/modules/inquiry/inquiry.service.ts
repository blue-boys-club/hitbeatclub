import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { InquiryCreateDto } from "./dto/request/inquiry.create.dto";
import { InquiryUpdateDto } from "./dto/request/inquiry.update.dto";
import {
	INQUIRY_CREATE_ERROR,
	INQUIRY_FIND_ERROR,
	INQUIRY_NOT_FOUND_ERROR,
	INQUIRY_DETAIL_ERROR,
	INQUIRY_UPDATE_ERROR,
	INQUIRY_DELETE_ERROR,
} from "./inquiry.error";

@Injectable()
export class InquiryService {
	private readonly logger = new Logger(InquiryService.name);

	constructor(private readonly prisma: PrismaService) {}

	async create(createInquiryDto: InquiryCreateDto) {
		try {
			const inquiry = await this.prisma.inquiry.create({
				data: {
					name: createInquiryDto.name,
					email: createInquiryDto.email,
					phoneNumber: createInquiryDto.phoneNumber || null,
					content: createInquiryDto.content,
				},
			});

			return this.prisma.serializeBigInt(inquiry);
		} catch (error) {
			this.logger.error("Error creating inquiry:", error);
			throw new BadRequestException({ ...INQUIRY_CREATE_ERROR, detail: error.message });
		}
	}

	async findAll() {
		try {
			const inquiries = await this.prisma.inquiry.findMany({
				where: {
					deletedAt: null,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return this.prisma.serializeBigInt(inquiries);
		} catch (error) {
			this.logger.error("Error finding inquiries:", error);
			throw new BadRequestException({ ...INQUIRY_FIND_ERROR, detail: error.message });
		}
	}

	async findOne(id: number) {
		try {
			const inquiry = await this.prisma.inquiry.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!inquiry) {
				throw new NotFoundException(INQUIRY_NOT_FOUND_ERROR);
			}

			return this.prisma.serializeBigInt(inquiry);
		} catch (error) {
			this.logger.error("Error finding inquiry:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...INQUIRY_DETAIL_ERROR, detail: error.message });
		}
	}

	async update(id: number, updateInquiryDto: InquiryUpdateDto) {
		try {
			const existingInquiry = await this.prisma.inquiry.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!existingInquiry) {
				throw new NotFoundException(INQUIRY_NOT_FOUND_ERROR);
			}

			const updateData: any = {};
			if (updateInquiryDto.name !== undefined) updateData.name = updateInquiryDto.name;
			if (updateInquiryDto.email !== undefined) updateData.email = updateInquiryDto.email;
			if (updateInquiryDto.phoneNumber !== undefined) updateData.phoneNumber = updateInquiryDto.phoneNumber;
			if (updateInquiryDto.content !== undefined) updateData.content = updateInquiryDto.content;

			const inquiry = await this.prisma.inquiry.update({
				where: {
					id: BigInt(id),
				},
				data: updateData,
			});

			return this.prisma.serializeBigInt(inquiry);
		} catch (error) {
			this.logger.error("Error updating inquiry:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...INQUIRY_UPDATE_ERROR, detail: error.message });
		}
	}

	async softDelete(id: number) {
		try {
			const existingInquiry = await this.prisma.inquiry.findFirst({
				where: {
					id: BigInt(id),
					deletedAt: null,
				},
			});

			if (!existingInquiry) {
				throw new NotFoundException(INQUIRY_NOT_FOUND_ERROR);
			}

			const inquiry = await this.prisma.inquiry.update({
				where: {
					id: BigInt(id),
				},
				data: {
					deletedAt: new Date(),
				},
			});

			return this.prisma.serializeBigInt(inquiry);
		} catch (error) {
			this.logger.error("Error deleting inquiry:", error);
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({ ...INQUIRY_DELETE_ERROR, detail: error.message });
		}
	}
}
