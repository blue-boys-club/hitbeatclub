import { Module } from "@nestjs/common";
import { AwsModule } from "src/common/aws/aws.module";
import { FileModule } from "src/common/file/file.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { ProductModule } from "src/modules/product/product.module";
import { ArtistModule } from "src/modules/artist/artist.module";
import { SubscribeModule } from "src/modules/subscribe/subscribe.module";

@Module({
	controllers: [],
	providers: [],
	exports: [],
	imports: [AuthModule.forRoot(), UserModule, AwsModule, FileModule, ProductModule, ArtistModule, SubscribeModule],
})
export class RoutesUserModule {}
