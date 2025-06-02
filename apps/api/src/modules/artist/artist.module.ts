import { Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";

@Module({
	imports: [PrismaModule, FileModule],
	controllers: [ArtistController],
	providers: [ArtistService],
	exports: [ArtistService],
})
export class ArtistModule {}
