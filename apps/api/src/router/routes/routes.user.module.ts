import { Module } from "@nestjs/common";
import { AwsModule } from "~/common/aws/aws.module";
import { FileModule } from "~/common/file/file.module";
import { AuthModule } from "~/modules/auth/auth.module";
import { UserModule } from "~/modules/user/user.module";
import { ProductModule } from "~/modules/product/product.module";
import { ArtistModule } from "~/modules/artist/artist.module";
import { SubscribeModule } from "~/modules/subscribe/subscribe.module";
import { SettlementModule } from "~/modules/settlement/settlement.module";
import { TagModule } from "~/modules/tag/tag.module";
import { GenreModule } from "~/modules/genre/genre.module";
import { AccountTokenModule } from "~/modules/account-token/account-token.module";
import { CouponModule } from "~/modules/coupon/coupon.module";
import { PaymentModule } from "~/modules/payment/payment.module";
import { SearchModule } from "~/modules/search/search.module";
import { PlaylistModule } from "~/modules/playlist/playlist.module";

@Module({
	controllers: [],
	providers: [],
	exports: [],
	imports: [
		AuthModule.forRoot(),
		UserModule,
		PaymentModule,
		AwsModule,
		AccountTokenModule,
		FileModule,
		ProductModule,
		ArtistModule,
		SubscribeModule,
		SettlementModule,
		TagModule,
		GenreModule,
		CouponModule,
		SearchModule,
		PlaylistModule,
	],
})
export class RoutesUserModule {}
