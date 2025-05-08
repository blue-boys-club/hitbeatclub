import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '../modules/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { AppMiddlewareModule } from './app.middleware.module';

@Module({
    imports: [
        AuthModule,
        CommonModule,
        AppMiddlewareModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
