import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { CartModule } from "../cart/cart.module";
import { FileModule } from "../file/file.module";

@Module({
	imports: [PrismaModule, CartModule, FileModule],
	providers: [PaymentService],
	controllers: [PaymentController],
	exports: [PaymentService],
})
export class PaymentModule {}
