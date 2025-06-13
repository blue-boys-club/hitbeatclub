import { forwardRef, Module } from "@nestjs/common";
import { ArtistModule } from "../artist/artist.module";
import { SettlementService } from "./settlement.service";
import { PrismaModule } from "~/common/prisma/prisma.module";

@Module({
	imports: [forwardRef(() => ArtistModule), PrismaModule],
	controllers: [
		// SettlementController
	],
	providers: [SettlementService],
	exports: [SettlementService],
})
export class SettlementModule {}
