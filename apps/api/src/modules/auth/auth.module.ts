import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthJwtAccessStrategy } from './guards/jwt/strategies/auth.jwt.access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt/strategies/auth.jwt.refresh.strategy';
import { AuthPublicController } from './auth.public.controller';

@Module({
    imports: [],
    providers: [AuthService],
    exports: [AuthService],
    controllers: [AuthPublicController],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
