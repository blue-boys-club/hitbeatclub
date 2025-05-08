import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthSignInKakaoResponseDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'access token',
    example: 'ym0dvWJgUAXgE6hTQjOxIsjhB_6IYwxKAAAAAQo9cusAAAGSbCfnbejqOP6o1CZo',
  })
  accessToken: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'refresh token',
    example: '1pj7QL8YIrjEN7rBqWeT0No1AiqkIwJ6AAAAAgo9dGgAAAGScYII5OjqOP6o1CZo',
  })
  refreshToken: string;
}
