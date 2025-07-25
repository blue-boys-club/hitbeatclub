import { HeadBucketCommandOutput, UploadPartRequest } from "@aws-sdk/client-s3";
import { ENUM_S3_UPLOAD_TYPE } from "~/common/aws/constants/aws.enum.constant";
import { AwsS3MultipartDto, AwsS3MultipartPartsDto } from "~/common/aws/dtos/aws.s3-multipart.dto";
import { AwsS3Dto } from "~/common/aws/dtos/aws.s3.dto";
import {
	IAwsS3PutItem,
	IAwsS3PutItemOptions,
	IAwsS3PutItemWithAclOptions,
} from "~/common/aws/interfaces/aws.interface";
import { Readable } from "stream";

export interface IAwsS3Service {
	checkBucketExistence(): Promise<HeadBucketCommandOutput>;
	listBucket(): Promise<string[]>;
	listItemInBucket(prefix?: string): Promise<AwsS3Dto[]>;
	getItemInBucket(pathWithFilename: string): Promise<Readable | ReadableStream<any> | Blob>;
	putItemInBucket(file: IAwsS3PutItem, options?: IAwsS3PutItemOptions): Promise<AwsS3Dto>;
	putItemInBucketWithAcl(file: IAwsS3PutItem, options?: IAwsS3PutItemWithAclOptions): Promise<AwsS3Dto>;
	deleteItemInBucket(pathWithFilename: string): Promise<void>;
	deleteItemsInBucket(pathWithFilename: string[]): Promise<void>;
	deleteFolder(dir: string): Promise<void>;
	createMultiPart(
		file: IAwsS3PutItem,
		maxPartNumber: number,
		options?: IAwsS3PutItemOptions,
	): Promise<AwsS3MultipartDto>;
	createMultiPartWithAcl(
		file: IAwsS3PutItem,
		maxPartNumber: number,
		options?: IAwsS3PutItemWithAclOptions,
	): Promise<AwsS3MultipartDto>;
	uploadPart(
		multipart: AwsS3MultipartDto,
		partNumber: number,
		content: UploadPartRequest["Body"] | string | Uint8Array | Buffer,
	): Promise<AwsS3MultipartPartsDto>;
	updateMultiPart(
		{ size, parts, ...others }: AwsS3MultipartDto,
		part: AwsS3MultipartPartsDto,
	): Promise<AwsS3MultipartDto>;
	completeMultipart(multipart: AwsS3MultipartDto): Promise<void>;
	abortMultipart(multipart: AwsS3MultipartDto): Promise<void>;
	getFilenameFromCompletedUrl(completedUrl: string): Promise<string>;
	createRandomFilename(path?: string): Promise<Record<string, any>>;
	getS3UploadPath(type: ENUM_S3_UPLOAD_TYPE, data: { [key: string]: any }): Promise<string>;
	convertS3UrlToCloudFrontUrl(s3Url: string): Promise<string>;
	convertMultipleS3UrlsToCloudFrontUrls(s3Urls: string[]): Promise<string[]>;
}
