import { Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";
import { SettlementModule } from "../settlement/settlement.module";

@Module({
	imports: [PrismaModule, FileModule, SettlementModule],
	controllers: [ArtistController],
	providers: [ArtistService],
	exports: [ArtistService],
})
export class ArtistModule {}
