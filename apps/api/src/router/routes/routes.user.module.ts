import { Module } from "@nestjs/common";
import { AwsModule } from "src/common/aws/aws.module";
import { FileModule } from "src/common/file/file.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { ProductModule } from "src/modules/product/product.module";
import { ArtistModule } from "src/modules/artist/artist.module";
import { SubscribeModule } from "src/modules/subscribe/subscribe.module";
import { SettlementModule } from "src/modules/settlement/settlement.module";
import { TagModule } from "src/modules/tag/tag.module";
import { GenreModule } from "src/modules/genre/genre.module";
import { AccountTokenModule } from "src/modules/account-token/account-token.module";

@Module({
	controllers: [],
	providers: [],
	exports: [],
	imports: [
		AuthModule.forRoot(),
		UserModule,
		AwsModule,
		AccountTokenModule,
		FileModule,
		ProductModule,
		ArtistModule,
		SubscribeModule,
		SettlementModule,
		TagModule,
		GenreModule,
	],
})
export class RoutesUserModule {}
