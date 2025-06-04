import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { ArtistModule } from "../artist/artist.module";
import { ProductModule } from "../product/product.module";
import { SettlementService } from "./settlement.service";

@Module({
	imports: [UserModule, ArtistModule, ProductModule],
	controllers: [
		// SettlementController
	],
	providers: [SettlementService],
	exports: [SettlementService],
})
export class SettlementModule {}
