import { forwardRef, Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";
import { SettlementModule } from "../settlement/settlement.module";
import { ProductModule } from "../product/product.module";
import { ArtistPublicController } from "./artist.public.controller";
import { NotificationModule } from "../notification/notification.module";

@Module({
	imports: [
		PrismaModule,
		FileModule,
		forwardRef(() => SettlementModule),
		forwardRef(() => ProductModule),
		NotificationModule,
	],
	controllers: [ArtistController, ArtistPublicController],
	providers: [ArtistService],
	exports: [ArtistService],
})
export class ArtistModule {}
