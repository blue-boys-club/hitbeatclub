import { Module } from "@nestjs/common";
import { SubscribeController } from "./subscribe.controller";
import { SubscribeService } from "./subscribe.service";
import { UserModule } from "../user/user.module";
import { ArtistModule } from "../artist/artist.module";
import { CouponModule } from "../coupon/coupon.module";
import { SubscribeCron } from "./subscribe.cron";

@Module({
	imports: [UserModule, ArtistModule, CouponModule],
	controllers: [SubscribeController],
	providers: [SubscribeService, SubscribeCron],
	exports: [SubscribeService],
})
export class SubscribeModule {}
