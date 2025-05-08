import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthGoogleLoginDto {
  @ApiProperty({
    description: 'Google OAuth code',
    example: '4/0AfJohXn5g6rXK...',
  })
  @IsString()
  code: string;
}
