import { Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";
import { SettlementModule } from "../settlement/settlement.module";
import { ProductModule } from "../product/product.module";

@Module({
	imports: [PrismaModule, FileModule, SettlementModule, ProductModule],
	controllers: [ArtistController],
	providers: [ArtistService],
	exports: [ArtistService],
})
export class ArtistModule {}
