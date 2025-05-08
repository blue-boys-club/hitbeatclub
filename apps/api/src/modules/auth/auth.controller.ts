import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  version: '1',
  path: '/auth',
})
@ApiBearerAuth()
export class AuthController {
  constructor() {}
}
