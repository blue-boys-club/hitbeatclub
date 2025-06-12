import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/common/prisma/prisma.service";
import { AwsS3Service } from "./aws.s3.service";

@Injectable()
export class AwsS3MigrationService {
	private readonly logger = new Logger(AwsS3MigrationService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly awsS3Service: AwsS3Service,
	) {}

	/**
	 * 데이터베이스의 모든 S3 URL을 CloudFront URL로 마이그레이션합니다
	 * 실제 필드명은 프로젝트에 맞게 수정해주세요
	 */
	async migrateAllS3UrlsToCloudFront(): Promise<{ updated: number; errors: string[] }> {
		const errors: string[] = [];
		let totalUpdated = 0;

		try {
			// 1. 사용자 프로필 이미지 마이그레이션
			const usersWithS3Urls = await this.prismaService.user.findMany({
				where: {
					profileUrl: {
						contains: ".s3.",
					},
				},
				select: {
					id: true,
					profileUrl: true,
				},
			});

			this.logger.log(`Found ${usersWithS3Urls.length} users with S3 URLs to migrate`);

			for (const user of usersWithS3Urls) {
				try {
					const newUrl = await this.awsS3Service.convertS3UrlToCloudFrontUrl(user.profileUrl);

					await this.prismaService.user.update({
						where: { id: user.id },
						data: { profileUrl: newUrl },
					});

					totalUpdated++;
					this.logger.debug(`Updated user ${user.id}: ${user.profileUrl} -> ${newUrl}`);
				} catch (error) {
					const errorMsg = `Failed to update user ${user.id}: ${error.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			// 2. 아티스트 프로필 이미지 마이그레이션
			const artistsWithS3Urls = await this.prismaService.artist.findMany({
				where: {
					profileImageUrl: {
						contains: ".s3.",
					},
				},
				select: {
					id: true,
					profileImageUrl: true,
				},
			});

			this.logger.log(`Found ${artistsWithS3Urls.length} artists with S3 URLs to migrate`);

			for (const artist of artistsWithS3Urls) {
				try {
					const newUrl = await this.awsS3Service.convertS3UrlToCloudFrontUrl(artist.profileImageUrl);

					await this.prismaService.artist.update({
						where: { id: artist.id },
						data: { profileImageUrl: newUrl },
					});

					totalUpdated++;
					this.logger.debug(`Updated artist ${artist.id}: ${artist.profileImageUrl} -> ${newUrl}`);
				} catch (error) {
					const errorMsg = `Failed to update artist ${artist.id}: ${error.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			// 3. 상품 이미지 마이그레이션
			const productsWithS3Urls = await this.prismaService.product.findMany({
				where: {
					imageUrl: {
						contains: ".s3.",
					},
				},
				select: {
					id: true,
					imageUrl: true,
				},
			});

			this.logger.log(`Found ${productsWithS3Urls.length} products with S3 URLs to migrate`);

			for (const product of productsWithS3Urls) {
				try {
					const newUrl = await this.awsS3Service.convertS3UrlToCloudFrontUrl(product.imageUrl);

					await this.prismaService.product.update({
						where: { id: product.id },
						data: { imageUrl: newUrl },
					});

					totalUpdated++;
					this.logger.debug(`Updated product ${product.id}: ${product.imageUrl} -> ${newUrl}`);
				} catch (error) {
					const errorMsg = `Failed to update product ${product.id}: ${error.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			// 4. 파일 URL 마이그레이션
			const filesWithS3Urls = await this.prismaService.file.findMany({
				where: {
					url: {
						contains: ".s3.",
					},
				},
				select: {
					id: true,
					url: true,
				},
			});

			this.logger.log(`Found ${filesWithS3Urls.length} files with S3 URLs to migrate`);

			for (const file of filesWithS3Urls) {
				try {
					const newUrl = await this.awsS3Service.convertS3UrlToCloudFrontUrl(file.url);

					await this.prismaService.file.update({
						where: { id: file.id },
						data: { url: newUrl },
					});

					totalUpdated++;
					this.logger.debug(`Updated file ${file.id}: ${file.url} -> ${newUrl}`);
				} catch (error) {
					const errorMsg = `Failed to update file ${file.id}: ${error.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			this.logger.log(`Migration completed. Updated: ${totalUpdated}, Errors: ${errors.length}`);
		} catch (error) {
			this.logger.error("Migration failed", error);
			errors.push(`Global migration error: ${error.message}`);
		}

		return { updated: totalUpdated, errors };
	}

	/**
	 * 특정 테이블의 S3 URL을 CloudFront URL로 마이그레이션합니다
	 */
	async migrateTableUrls(
		tableName: string,
		urlFields: string[],
		condition?: any,
	): Promise<{ updated: number; errors: string[] }> {
		const errors: string[] = [];
		let totalUpdated = 0;

		try {
			// 동적 쿼리를 위한 로직
			// 실제 구현시에는 각 테이블별로 개별 메서드를 만드는 것을 추천
			this.logger.log(`Starting migration for table: ${tableName}, fields: ${urlFields.join(", ")}`);

			// 여기에 테이블별 마이그레이션 로직 구현
		} catch (error) {
			this.logger.error(`Migration failed for table ${tableName}`, error);
			errors.push(`Table ${tableName} migration error: ${error.message}`);
		}

		return { updated: totalUpdated, errors };
	}

	/**
	 * 마이그레이션 상태를 확인합니다
	 */
	async checkMigrationStatus(): Promise<{
		totalS3Urls: number;
		migratedUrls: number;
		remainingUrls: number;
	}> {
		try {
			// 각 테이블에서 S3 URL 개수 확인
			const s3UrlCount = await this.countS3Urls();
			const cloudfrontUrlCount = await this.countCloudfrontUrls();

			return {
				totalS3Urls: s3UrlCount,
				migratedUrls: cloudfrontUrlCount,
				remainingUrls: s3UrlCount,
			};
		} catch (error) {
			this.logger.error("Failed to check migration status", error);
			throw error;
		}
	}

	private async countS3Urls(): Promise<number> {
		// 각 테이블에서 S3 URL 개수를 세는 로직
		// 실제 구현시에는 프로젝트의 스키마에 맞게 조정
		return 0;
	}

	private async countCloudfrontUrls(): Promise<number> {
		// 각 테이블에서 CloudFront URL 개수를 세는 로직
		return 0;
	}
}
