import { OmitType, PickType } from '@nestjs/swagger';
import { AuthJwtAccessPayloadDto } from './auth.jwt.access-payload.dto';

export class AuthJwtRefreshPayloadDto extends PickType(
  AuthJwtAccessPayloadDto,
  ['id', 'loginType', 'loginDate'] as const,
) {}
