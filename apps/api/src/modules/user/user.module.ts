import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ProductModule } from "../product/product.module";
import { CartModule } from "../cart/cart.module";
import { PlaylistModule } from "../playlist/playlist.module";
import { NotificationModule } from "../notification/notification.module";
@Module({
	imports: [ProductModule, CartModule, forwardRef(() => PlaylistModule), NotificationModule],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
