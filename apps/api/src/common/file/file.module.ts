import { Module, forwardRef } from "@nestjs/common";
import { FileService } from "src/common/file/services/file.service";

@Module({
	imports: [],
	providers: [FileService],
	exports: [FileService],
	controllers: [],
})
export class FileModule {}
