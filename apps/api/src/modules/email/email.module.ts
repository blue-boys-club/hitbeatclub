import { Module } from '@nestjs/common';
import { EmailService } from 'src/modules/email/services/email.service';
import { AwsModule } from 'src/common/aws/aws.module';
import { EmailController } from 'src/modules/email/controllers/email.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AwsModule, AuthModule],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
