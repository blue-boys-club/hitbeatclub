import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGoogleLoginDto } from './dto/request/auth.google.login.dto';
import { AuthGoogleLoginResponseDto } from './dto/response/auth.google.login.response.dto';

@ApiTags('auth.public')
@Controller('auth')
@ApiBearerAuth()
export class AuthPublicController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({ summary: 'Google login' })
  @ApiResponse({
    status: 200,
    description: 'Google login successful',
    type: AuthGoogleLoginResponseDto,
  })
  async loginWithGoogle(
    @Body() body: AuthGoogleLoginDto,
  ): Promise<AuthGoogleLoginResponseDto> {
    return this.authService.googleLogin(body.code);
  }
}
