import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AwsS3Dto } from "~/common/aws/dtos/aws.s3.dto";
import { IAwsS3PutItemOptions } from "~/common/aws/interfaces/aws.interface";
import { IAwsS3PutItem } from "~/common/aws/interfaces/aws.interface";
import { FILE_PUT_ITEM_IN_BUCKET_ERROR, FILE_UPDATE_FILE_ENABLED_AND_DELETE_ERROR } from "./file.error";
import { PrismaService } from "~/common/prisma/prisma.service";
import { FileCreateRequestDto } from "./dto/request/file.create.dto";
import { v4 as uuidv4 } from "uuid";
import { File, Prisma } from "@prisma/client";

@Injectable()
export class FileService {
	private s3Client: S3Client;
	private readonly bucket: string;
	private readonly s3Region: string;
	private readonly s3BaseBucketUrl: string;
	private readonly cloudfrontBaseUrl: string;
	private readonly cloudfrontEnabled: boolean;

	constructor(
		private configService: ConfigService,
		private readonly prisma: PrismaService,
	) {
		this.s3Client = new S3Client({
			region: this.configService.get<string>("AWS_REGION"),
			credentials: {
				accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
				secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
			},
		});
		this.bucket = this.configService.get("AWS_S3_BUCKET_NAME");
		this.s3Region = this.configService.get("AWS_REGION");
		this.s3BaseBucketUrl = `https://${this.bucket}.s3.${this.s3Region}.amazonaws.com`;
		this.cloudfrontBaseUrl = this.configService.get<string>("aws.cloudfront.baseUrl") ?? this.s3BaseBucketUrl;
		this.cloudfrontEnabled = this.configService.get<boolean>("aws.cloudfront.enabled");
	}

	async create(fileCreateRequestDto: FileCreateRequestDto) {
		return this.prisma.file
			.create({
				data: {
					targetTable: fileCreateRequestDto.targetTable,
					targetId: fileCreateRequestDto?.targetId || null,
					type: fileCreateRequestDto.type,
					uploaderId: fileCreateRequestDto.uploaderId,
					url: fileCreateRequestDto.url,
					originName: fileCreateRequestDto.originalName,
					mimeType: fileCreateRequestDto.mimeType,
					size: fileCreateRequestDto.size,
					isEnabled: 0,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async putItemInBucket(file: IAwsS3PutItem, options?: IAwsS3PutItemOptions): Promise<AwsS3Dto> {
		let path: string = options?.path;
		path = path?.startsWith("/") ? path.replace("/", "") : path;

		const mime: string = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);

		const filename = uuidv4();

		const content: string | Uint8Array | Buffer = file.buffer;
		const key: string = path ? `${path}/${filename}` : filename;

		const command: PutObjectCommand = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: content,
		});

		try {
			await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(command);

			return {
				bucket: this.bucket,
				path,
				pathWithFilename: key,
				filename: filename,
				url: this.generateFileUrl(key),
				baseUrl: this.s3BaseBucketUrl,
				mime,
				size: file.size,
			};
		} catch (e: any) {
			throw new BadRequestException({
				...FILE_PUT_ITEM_IN_BUCKET_ERROR,
				detail: e.message,
			});
		}
	}

	converterFileNameToNFCAndUTF8(name) {
		return Buffer.from(name.normalize("NFC"), "ascii").toString("utf8");
	}

	/**
	 * 각 feature에서 등록, 수정 시 사용하는 함수 - 공용함수
	 * 1. 기존 파일을 삭제하고
	 * 2. 새로운 파일 활성화 한다.
	 */
	async updateFileEnabledAndDelete(
		{
			uploaderId,
			newFileIds,
			targetId,
			targetTable,
			type,
		}: {
			uploaderId: number;
			newFileIds: number[];
			targetId: number;
			targetTable: string;
			type: string;
		},
		tx?: Prisma.TransactionClient,
	) {
		const prisma = tx ?? this.prisma;

		try {
			const files = await this.findDeleteFiles({
				uploaderId,
				targetTable,
				targetId,
				type,
				newFileIds,
			});

			for (const file of files) {
				await this.softDeleteFile(file.id, tx);
			}

			if (!newFileIds.length) {
				return;
			}

			return await prisma.file
				.updateMany({
					where: { id: { in: newFileIds } },
					data: { isEnabled: 1, targetId: targetId, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e) {
			throw new BadRequestException({
				...FILE_UPDATE_FILE_ENABLED_AND_DELETE_ERROR,
				detail: e.message,
			});
		}
	}

	async updateFileEnabled({ uploaderId, newFileId, targetId, targetTable, type }, tx?: Prisma.TransactionClient) {
		const prisma = tx ?? this.prisma;

		try {
			return await prisma.file
				.update({
					where: { id: newFileId },
					data: { isEnabled: 1, targetId: targetId, deletedAt: null },
				})
				.then((data) => this.prisma.serializeBigInt(data));
		} catch (e) {
			throw new BadRequestException({
				...FILE_UPDATE_FILE_ENABLED_AND_DELETE_ERROR,
				detail: e.message,
			});
		}
	}

	// 삭제할 파일을 찾는다.
	async findDeleteFiles({
		uploaderId,
		targetTable,
		targetId,
		type,
		newFileIds,
	}: {
		uploaderId: number;
		targetTable: string;
		targetId: number;
		type: string;
		newFileIds?: number[];
	}) {
		return this.prisma.file
			.findMany({
				where: {
					uploaderId: uploaderId,
					targetTable: targetTable,
					type: type,
					targetId: targetId,
					id: { notIn: newFileIds },
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findFilesByTargetId({ targetId, targetTable }: { targetId: number; targetTable: string }) {
		return await this.prisma.file
			.findMany({
				where: {
					deletedAt: null,
					targetId,
					targetTable,
					isEnabled: 1,
				},
			})
			.then((data) => this.prisma.serializeBigInt(data));
	}

	async findFilesByTargetIds({
		targetIds,
		targetTable,
		type,
	}: {
		targetIds: number[];
		targetTable: string;
		type?: string;
	}) {
		return await this.prisma.file
			.findMany({
				where: {
					deletedAt: null,
					targetId: { in: targetIds },
					targetTable,
					isEnabled: 1,
					...(type ? { type: type } : {}),
				},
			})
			.then((data) => this.prisma.serializeBigInt(data) as File[]);
	}

	async softDeleteFile(id: number, tx?: Prisma.TransactionClient): Promise<void> {
		const prisma = tx ?? this.prisma;

		await prisma.file.update({
			where: { id },
			data: { isEnabled: 0, deletedAt: new Date() },
		});
	}

	/**
	 * 파일의 isEnabled를 변경하는 함수
	 * @param id
	 */
	async updateIsEnabled(id: number, isEnabled: boolean): Promise<void> {
		await this.prisma.file.update({
			where: { id },
			data: { isEnabled: Number(isEnabled) },
		});
	}

	/**
	 * S3 또는 CloudFront URL을 생성합니다
	 * CloudFront가 활성화된 경우 CloudFront URL을 반환하고, 그렇지 않으면 S3 URL을 반환합니다
	 */
	private generateFileUrl(key: string): string {
		return this.cloudfrontEnabled ? `${this.cloudfrontBaseUrl}/${key}` : `${this.s3BaseBucketUrl}/${key}`;
	}
}
