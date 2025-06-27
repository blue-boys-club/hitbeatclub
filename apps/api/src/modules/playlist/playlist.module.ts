import { Module, forwardRef } from "@nestjs/common";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";
import { CartModule } from "../cart/cart.module";

@Module({
	imports: [PrismaModule, forwardRef(() => ProductModule), forwardRef(() => UserModule), forwardRef(() => CartModule)],
	controllers: [PlaylistController],
	providers: [PlaylistService],
	exports: [PlaylistService],
})
export class PlaylistModule {}
