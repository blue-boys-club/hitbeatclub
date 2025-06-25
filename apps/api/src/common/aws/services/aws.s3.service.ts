import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import {
	IAwsS3PutItem,
	IAwsS3PutItemOptions,
	IAwsS3PutItemWithAclOptions,
	IAwsS3RandomFilename,
} from "~/common/aws/interfaces/aws.interface";
import { IAwsS3Service } from "~/common/aws/interfaces/aws.s3-service.interface";
import { Readable } from "stream";
import {
	S3Client,
	GetObjectCommand,
	ListBucketsCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	ObjectIdentifier,
	CreateMultipartUploadCommand,
	CreateMultipartUploadCommandInput,
	UploadPartCommandInput,
	UploadPartCommand,
	CompleteMultipartUploadCommandInput,
	CompleteMultipartUploadCommand,
	GetObjectCommandInput,
	AbortMultipartUploadCommand,
	AbortMultipartUploadCommandInput,
	HeadBucketCommand,
	HeadBucketCommandOutput,
	ListBucketsOutput,
	ListObjectsV2Output,
	GetObjectOutput,
	DeleteObjectsCommandInput,
	ListObjectsV2CommandInput,
	ListObjectsV2CommandOutput,
	DeleteObjectsCommandOutput,
	DeleteObjectCommandInput,
	DeleteObjectCommandOutput,
	HeadBucketCommandInput,
	ListBucketsCommandInput,
	ListBucketsCommandOutput,
	GetObjectCommandOutput,
	PutObjectCommandInput,
	PutObjectCommandOutput,
	CreateMultipartUploadCommandOutput,
	UploadPartCommandOutput,
	CompleteMultipartUploadCommandOutput,
	AbortMultipartUploadCommandOutput,
	Bucket,
	_Object,
	ObjectCannedACL,
	CompletedPart,
} from "@aws-sdk/client-s3";
import { HelperStringService } from "~/common/helper/services/helper.string.service";
import { AwsS3Dto } from "~/common/aws/dtos/aws.s3.dto";
import { AwsS3MultipartDto, AwsS3MultipartPartsDto } from "~/common/aws/dtos/aws.s3-multipart.dto";
import { AWS_S3_MAX_PART_NUMBER } from "~/common/aws/constants/aws.constant";
import { ENUM_S3_UPLOAD_TYPE } from "~/common/aws/constants/aws.enum.constant";
import { ENUM_AWS_STATUS_CODE_ERROR } from "~/common/aws/constants/aws.status-code.constant";
import { AwsCloudfrontService } from "~/common/aws/services/aws.cloudfront.service";

@Injectable()
export class AwsS3Service implements IAwsS3Service {
	private readonly logger = new Logger(AwsS3Service.name);
	private readonly s3Client: S3Client;
	private readonly bucket: string;
	private readonly baseUrl: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly helperStringService: HelperStringService,
		private readonly cloudfrontService: AwsCloudfrontService,
	) {
		const accessKeyId =
			this.configService.get<string>("aws.s3.credential.key") ?? this.configService.get<string>("AWS_ACCESS_KEY_ID");
		const secretAccessKey =
			this.configService.get<string>("aws.s3.credential.secret") ??
			this.configService.get<string>("AWS_SECRET_ACCESS_KEY");
		const region = this.configService.get<string>("aws.s3.region") ?? this.configService.get<string>("AWS_REGION");

		// 로컬 개발용으로 정적 자격 증명이 모두 제공되면 그 값을 사용하고,
		// 그렇지 않으면 SDK 기본 Credential Provider Chain을 사용 (ECS, EC2, SSO 등 포함)
		const staticCredentials = accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

		this.logger.log({ hasStaticCredentials: !!staticCredentials, region }, "AWS S3 Credentials");

		this.s3Client = new S3Client({
			region,
			credentials: staticCredentials ?? defaultProvider(),
		});

		this.logger.log({ clientCredentials: this.s3Client.config.credentials }, "AWS S3 Client Credentials");

		this.bucket = this.configService.get<string>("aws.s3.bucket");
		this.baseUrl = this.configService.get<string>("aws.s3.baseUrl");
	}

	/**
	 * S3 또는 CloudFront URL을 생성합니다
	 * CloudFront가 활성화된 경우 CloudFront URL을 반환하고, 그렇지 않으면 S3 URL을 반환합니다
	 */
	private generateFileUrl(key: string): string {
		return this.cloudfrontService.generateFileUrl(key);
	}

	/**
	 * 기존 S3 URL을 CloudFront URL로 변환합니다
	 * @param s3Url 기존 S3 URL
	 * @returns CloudFront URL 또는 원본 URL (CloudFront가 비활성화된 경우)
	 */
	async convertS3UrlToCloudFrontUrl(s3Url: string): Promise<string> {
		return this.cloudfrontService.convertS3UrlToCloudFrontUrl(s3Url);
	}

	/**
	 * 여러 S3 URL을 CloudFront URL로 일괄 변환합니다
	 * @param s3Urls S3 URL 배열
	 * @returns CloudFront URL 배열
	 */
	async convertMultipleS3UrlsToCloudFrontUrls(s3Urls: string[]): Promise<string[]> {
		return this.cloudfrontService.convertMultipleS3UrlsToCloudFrontUrls(s3Urls);
	}

	async checkBucketExistence(): Promise<HeadBucketCommandOutput> {
		const command: HeadBucketCommand = new HeadBucketCommand({
			Bucket: this.bucket,
		});

		try {
			const check = await this.s3Client.send<HeadBucketCommandInput, HeadBucketCommandOutput>(command);
			return check;
		} catch (err: any) {
			throw err;
		}
	}

	async listBucket(): Promise<string[]> {
		const command: ListBucketsCommand = new ListBucketsCommand({});

		try {
			const listBucket: ListBucketsOutput = await this.s3Client.send<ListBucketsCommandInput, ListBucketsCommandOutput>(
				command,
			);
			const mapList: string[] = listBucket.Buckets.map((val: Bucket) => val.Name);
			return mapList;
		} catch (err: any) {
			throw err;
		}
	}

	async listItemInBucket(prefix?: string): Promise<AwsS3Dto[]> {
		const command: ListObjectsV2Command = new ListObjectsV2Command({
			Bucket: this.bucket,
			Prefix: prefix,
		});

		try {
			const listItems: ListObjectsV2Output = await this.s3Client.send<
				ListObjectsV2CommandInput,
				ListObjectsV2CommandOutput
			>(command);

			const mapList = listItems.Contents.map((val: _Object) => {
				const lastIndex: number = val.Key.lastIndexOf("/");
				const path: string = val.Key.substring(0, lastIndex);
				const filename: string = val.Key.substring(lastIndex + 1, val.Key.length);
				const mime: string = filename.substring(filename.lastIndexOf(".") + 1, filename.length);

				return {
					bucket: this.bucket,
					path,
					pathWithFilename: val.Key,
					filename: filename,
					url: this.generateFileUrl(val.Key),
					baseUrl: this.baseUrl,
					mime,
					size: val.Size,
				};
			});

			return mapList;
		} catch (err: any) {
			throw err;
		}
	}

	async getItemInBucket(pathWithFilename: string): Promise<Readable | ReadableStream<any> | Blob> {
		const command: GetObjectCommand = new GetObjectCommand({
			Bucket: this.bucket,
			Key: pathWithFilename,
		});

		try {
			const item: GetObjectOutput = await this.s3Client.send<GetObjectCommandInput, GetObjectCommandOutput>(command);
			return item.Body;
		} catch (err: any) {
			throw err;
		}
	}

	converterFileNameToNFCAndUTF8(name) {
		return Buffer.from(name.normalize("NFC"), "ascii").toString("utf8");
	}

	async putItemInBucket(file: IAwsS3PutItem, options?: IAwsS3PutItemOptions): Promise<AwsS3Dto> {
		let path: string = options?.path;
		path = path?.startsWith("/") ? path.replace("/", "") : path;

		const mime: string = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);

		const filename = options?.customFilename
			? `${this.converterFileNameToNFCAndUTF8(options?.customFilename)}.${mime}`
			: this.converterFileNameToNFCAndUTF8(file.originalname);

		const content: string | Uint8Array | Buffer = file.buffer;
		const key: string = path ? `${path}/${filename}` : filename;

		const command: PutObjectCommand = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: content,
			...(options?.contentDisposition && { ContentDisposition: options.contentDisposition }),
		});

		try {
			await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(command);

			return {
				bucket: this.bucket,
				path,
				pathWithFilename: key,
				filename: filename,
				url: this.generateFileUrl(key),
				baseUrl: this.baseUrl,
				mime,
				size: file.size,
			};
		} catch (err: any) {
			throw new BadRequestException({
				statusCode: ENUM_AWS_STATUS_CODE_ERROR.S3_UPLOAD_ERROR,
				message: `S3 upload: ${err.message}`,
			});
		}
	}

	async putItemInBucketWithAcl(file: IAwsS3PutItem, options?: IAwsS3PutItemWithAclOptions): Promise<AwsS3Dto> {
		let path: string = options?.path;
		path = path?.startsWith("/") ? path.replace("/", "") : path;
		const acl: ObjectCannedACL = options?.acl ? (options.acl as ObjectCannedACL) : ObjectCannedACL.public_read;

		const mime: string = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);
		const filename = options?.customFilename ? `${options?.customFilename}.${mime}` : file.originalname;
		const content: string | Uint8Array | Buffer = file.buffer;
		const key: string = path ? `${path}/${filename}` : filename;
		const command: PutObjectCommand = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: content,
			ACL: acl,
			...(options?.contentDisposition && { ContentDisposition: options.contentDisposition }),
		});

		try {
			await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(command);

			return {
				bucket: this.bucket,
				path,
				pathWithFilename: key,
				filename: filename,
				url: this.generateFileUrl(key),
				baseUrl: this.baseUrl,
				mime,
				size: file.size,
			};
		} catch (err: any) {
			throw err;
		}
	}

	async deleteItemInBucket(pathWithFilename: string): Promise<void> {
		const command: DeleteObjectCommand = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: pathWithFilename,
		});

		try {
			await this.s3Client.send<DeleteObjectCommandInput, DeleteObjectCommandOutput>(command);
			return;
		} catch (err: any) {
			throw err;
		}
	}

	async deleteItemsInBucket(pathWithFilename: string[]): Promise<void> {
		const keys: ObjectIdentifier[] = pathWithFilename.map((val: string) => ({
			Key: val,
		}));
		const command: DeleteObjectsCommand = new DeleteObjectsCommand({
			Bucket: this.bucket,
			Delete: {
				Objects: keys,
			},
		});

		try {
			await this.s3Client.send<DeleteObjectsCommandInput, DeleteObjectsCommandOutput>(command);
			return;
		} catch (err: any) {
			throw err;
		}
	}

	async deleteFolder(dir: string): Promise<void> {
		const commandList: ListObjectsV2Command = new ListObjectsV2Command({
			Bucket: this.bucket,
			Prefix: dir,
		});
		const lists = await this.s3Client.send<ListObjectsV2CommandInput, ListObjectsV2CommandOutput>(commandList);

		try {
			const listItems = lists.Contents.map((val) => ({
				Key: val.Key,
			}));
			const commandDeleteItems: DeleteObjectsCommand = new DeleteObjectsCommand({
				Bucket: this.bucket,
				Delete: {
					Objects: listItems,
				},
			});

			await this.s3Client.send<DeleteObjectsCommandInput, DeleteObjectsCommandOutput>(commandDeleteItems);

			const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: dir,
			});
			await this.s3Client.send<DeleteObjectCommandInput, DeleteObjectCommandOutput>(commandDelete);

			return;
		} catch (err: any) {
			throw err;
		}
	}

	async createMultiPart(
		file: IAwsS3PutItem,
		maxPartNumber: number,
		options?: IAwsS3PutItemOptions,
	): Promise<AwsS3MultipartDto> {
		if (maxPartNumber > AWS_S3_MAX_PART_NUMBER) {
			throw new Error(`Max part number is greater than ${AWS_S3_MAX_PART_NUMBER}`);
		}
		let path: string = options?.path ?? "/";
		path = path.startsWith("/") ? path.replace("/", "") : path;

		const mime: string = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);
		const filename = options?.customFilename ? `${options?.customFilename}.${mime}` : file.originalname;
		const key: string = path ? `${path}/${filename}` : filename;
		const multiPartCommand: CreateMultipartUploadCommand = new CreateMultipartUploadCommand({
			Bucket: this.bucket,
			Key: key,
			...(options?.contentDisposition && { ContentDisposition: options.contentDisposition }),
		});

		try {
			const response = await this.s3Client.send<CreateMultipartUploadCommandInput, CreateMultipartUploadCommandOutput>(
				multiPartCommand,
			);

			return {
				bucket: this.bucket,
				uploadId: response.UploadId,
				path,
				pathWithFilename: key,
				filename: filename,
				url: this.generateFileUrl(key),
				baseUrl: this.baseUrl,
				mime,
				size: 0,
				lastPartNumber: 0,
				maxPartNumber: maxPartNumber,
				parts: [],
			};
		} catch (err: any) {
			throw err;
		}
	}

	async createMultiPartWithAcl(
		file: IAwsS3PutItem,
		maxPartNumber: number,
		options?: IAwsS3PutItemWithAclOptions,
	): Promise<AwsS3MultipartDto> {
		let path: string = options?.path ?? "/";
		path = path.startsWith("/") ? path.replace("/", "") : path;
		const acl: ObjectCannedACL = options?.acl ? (options.acl as ObjectCannedACL) : ObjectCannedACL.public_read;

		const mime: string = file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length);
		const filename = options?.customFilename ? `${options?.customFilename}.${mime}` : file.originalname;
		const key: string = path ? `${path}/${filename}` : filename;
		const multiPartCommand: CreateMultipartUploadCommand = new CreateMultipartUploadCommand({
			Bucket: this.bucket,
			Key: key,
			ACL: acl,
			...(options?.contentDisposition && { ContentDisposition: options.contentDisposition }),
		});

		try {
			const response = await this.s3Client.send<CreateMultipartUploadCommandInput, CreateMultipartUploadCommandOutput>(
				multiPartCommand,
			);

			return {
				bucket: this.bucket,
				uploadId: response.UploadId,
				path,
				pathWithFilename: key,
				filename: filename,
				url: this.generateFileUrl(key),
				baseUrl: this.baseUrl,
				mime,
				size: 0,
				lastPartNumber: 0,
				maxPartNumber: maxPartNumber,
				parts: [],
			};
		} catch (err: any) {
			throw err;
		}
	}

	async uploadPart(
		multipart: AwsS3MultipartDto,
		partNumber: number,
		content: string | Uint8Array | Buffer,
	): Promise<AwsS3MultipartPartsDto> {
		const uploadPartCommand: UploadPartCommand = new UploadPartCommand({
			Bucket: this.bucket,
			Key: multipart.path,
			Body: content,
			PartNumber: partNumber,
			UploadId: multipart.uploadId,
		});

		try {
			const { ETag } = await this.s3Client.send<UploadPartCommandInput, UploadPartCommandOutput>(uploadPartCommand);

			return {
				eTag: ETag,
				partNumber: partNumber,
				size: content.length,
			};
		} catch (err: any) {
			throw err;
		}
	}

	async updateMultiPart(
		{ size, parts, ...others }: AwsS3MultipartDto,
		part: AwsS3MultipartPartsDto,
	): Promise<AwsS3MultipartDto> {
		parts.push(part);
		return {
			...others,
			size: size + part.size,
			lastPartNumber: part.partNumber,
			parts,
		};
	}

	async completeMultipart(multipart: AwsS3MultipartDto): Promise<void> {
		const completeMultipartCommand: CompleteMultipartUploadCommand = new CompleteMultipartUploadCommand({
			Bucket: this.bucket,
			Key: multipart.path,
			UploadId: multipart.uploadId,
			MultipartUpload: {
				Parts: multipart.parts as CompletedPart[],
			},
		});

		try {
			await this.s3Client.send<CompleteMultipartUploadCommandInput, CompleteMultipartUploadCommandOutput>(
				completeMultipartCommand,
			);

			return;
		} catch (err: any) {
			throw err;
		}
	}

	async abortMultipart(multipart: AwsS3MultipartDto): Promise<void> {
		const abortMultipartCommand: AbortMultipartUploadCommand = new AbortMultipartUploadCommand({
			Bucket: this.bucket,
			Key: multipart.path,
			UploadId: multipart.uploadId,
		});

		try {
			await this.s3Client.send<AbortMultipartUploadCommandInput, AbortMultipartUploadCommandOutput>(
				abortMultipartCommand,
			);

			return;
		} catch (err: any) {
			throw err;
		}
	}

	async getFilenameFromCompletedUrl(url: string): Promise<string> {
		return url.replace(`${this.baseUrl}`, "");
	}

	async createRandomFilename(path?: string): Promise<IAwsS3RandomFilename> {
		const filename: string = this.helperStringService.random(20);

		return {
			path: path ?? "/",
			customFilename: filename,
		};
	}

	async getS3UploadPath(type: ENUM_S3_UPLOAD_TYPE, data?: { [key: string]: any }): Promise<string> {
		switch (type) {
			case ENUM_S3_UPLOAD_TYPE.USER_PROFILE:
				return `workspaces/${data.workspaceId}/users/profile`;
			case ENUM_S3_UPLOAD_TYPE.WORKSPACE_PROFILE:
				return `workspaces/${data.workspaceId}/profile`;
			case ENUM_S3_UPLOAD_TYPE.VOICE:
				return `users/voices`;
			case ENUM_S3_UPLOAD_TYPE.RESUME:
				return `users/resumes`;
			case ENUM_S3_UPLOAD_TYPE.CONNECT_LOGO:
				return `connects/logo`;
			case ENUM_S3_UPLOAD_TYPE.RECORDING_FILE:
				return `workspaces/${data.workspaceId}/interviews/${data.interviewId}/recordings`;
			default:
				throw new BadRequestException({
					statusCode: ENUM_AWS_STATUS_CODE_ERROR.UPLOAD_PATH_NOT_FOUND_ERROR,
					message: "aws.error.s3.s3UploadPathNotFound",
				});
		}
	}
}
