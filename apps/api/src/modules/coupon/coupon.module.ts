import { Module } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { CouponController } from "./coupon.controller";

@Module({
	imports: [PrismaModule],
	providers: [CouponService],
	controllers: [CouponController],
	exports: [CouponService],
})
export class CouponModule {}
