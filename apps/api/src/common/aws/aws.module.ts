import { Module } from "@nestjs/common";
import { AwsS3Service } from "~/common/aws/services/aws.s3.service";
import { AwsSESService } from "~/common/aws/services/aws.ses.service";
import { AwsCloudfrontService } from "~/common/aws/services/aws.cloudfront.service";

@Module({
	exports: [AwsS3Service, AwsSESService, AwsCloudfrontService],
	providers: [AwsS3Service, AwsSESService, AwsCloudfrontService],
	imports: [],
	controllers: [],
})
export class AwsModule {}
