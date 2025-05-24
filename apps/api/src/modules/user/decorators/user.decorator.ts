import {
    ExecutionContext,
    UseGuards,
    applyDecorators,
    createParamDecorator,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthJwtAccessGuard } from 'src/modules/auth/guards/jwt/auth.jwt.access.guard';

export function UserProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export const User = createParamDecorator(<T>(_, ctx: ExecutionContext): T => {
    const { __user } = ctx
        .switchToHttp()
        .getRequest<IRequestApp & { __user: T }>();
    return __user;
});
