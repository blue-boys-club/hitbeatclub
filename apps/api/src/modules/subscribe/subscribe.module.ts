import { Module } from "@nestjs/common";
import { SubscribeController } from "./subscribe.controller";
import { SubscribeService } from "./subscribe.service";
import { UserModule } from "../user/user.module";
import { ArtistModule } from "../artist/artist.module";

@Module({
	imports: [UserModule, ArtistModule],
	controllers: [SubscribeController],
	providers: [SubscribeService],
	exports: [SubscribeService],
})
export class SubscribeModule {}
