import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber } from 'class-validator';
import { ENUM_AUTH_LOGIN_TYPE } from 'src/modules/auth/constants/auth.enum.constant';

export class AuthJwtAccessPayloadDto {
  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: ENUM_AUTH_LOGIN_TYPE.KAKAO,
    description: '로그인 타입',
  })
  @IsEnum(ENUM_AUTH_LOGIN_TYPE)
  loginType: ENUM_AUTH_LOGIN_TYPE;

  @ApiProperty({
    example: 'dh.lee@highpive.com',
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.recent(),
  })
  loginDate: Date;
}
