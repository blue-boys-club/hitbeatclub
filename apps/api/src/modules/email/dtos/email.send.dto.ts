import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsEmail, IsOptional, IsString } from 'class-validator';
import { ENUM_EMAIL } from 'src/modules/email/constants/email.enum.constant';

export class EmailSendDto {
    @ApiProperty({
        description: 'The type of the message',
        required: true,
        nullable: false,
        example: ENUM_EMAIL.CHANGE_PASSWORD,
        enum: ENUM_EMAIL,
    })
    @IsString()
    @IsEnum(ENUM_EMAIL)
    @IsOptional()
    type?: ENUM_EMAIL;

    @ApiProperty({
        description: 'Recipient email address',
        required: true,
        nullable: false,
        example: 'recipient@example.com',
    })
    @IsEmail()
    to: string;
}
