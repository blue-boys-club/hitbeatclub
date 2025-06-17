import { Module } from "@nestjs/common";
import { NoticeController } from "./notice.controller";
import { NoticeService } from "./notice.service";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";

@Module({
	imports: [PrismaModule, FileModule],
	controllers: [NoticeController],
	providers: [NoticeService],
	exports: [NoticeService],
})
export class NoticeModule {}
