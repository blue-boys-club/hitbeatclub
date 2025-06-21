import { Module } from "@nestjs/common";
import { InquiryService } from "./inquiry.service";
import { InquiryPublicController } from "./inquiry.public.controller";

@Module({
	controllers: [InquiryPublicController],
	providers: [InquiryService],
	exports: [InquiryService],
})
export class InquiryModule {}
