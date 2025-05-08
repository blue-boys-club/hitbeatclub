import { Injectable } from '@nestjs/common';
import { AwsSESService } from 'src/common/aws/services/aws.ses.service';
import { ENUM_EMAIL } from 'src/modules/email/constants/email.enum.constant';
import { ConfigService } from '@nestjs/config';
import { IEmailService } from 'src/modules/email/interfaces/email.service.interface';
import { readFileSync } from 'fs';
import { GetTemplateCommandOutput } from '@aws-sdk/client-ses';
import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';
import { IAuthHash } from 'src/modules/auth/interfaces/auth.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly fromEmail: string;
  private readonly domain: string;

  constructor(
    private readonly awsSESService: AwsSESService,
    private readonly configService: ConfigService,
  ) {
    this.fromEmail = this.configService.get<string>('email.fromEmail');
    this.domain = this.configService.get<string>('email.domain');
  }

  async createChangePassword(): Promise<boolean> {
    try {
      await this.awsSESService.createTemplate({
        name: ENUM_EMAIL.CHANGE_PASSWORD,
        subject: `Change Password`,
        htmlBody: readFileSync(
          './templates/email.change-password.template.html',
          'utf8',
        ),
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async getChangePassword(): Promise<GetTemplateCommandOutput> {
    try {
      const template = await this.awsSESService.getTemplate({
        name: ENUM_EMAIL.CHANGE_PASSWORD,
      });

      return template;
    } catch (err: unknown) {
      return;
    }
  }

  async deleteChangePassword(): Promise<boolean> {
    try {
      await this.awsSESService.deleteTemplate({
        name: ENUM_EMAIL.CHANGE_PASSWORD,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async sendChangePassword(to: string, salt: string): Promise<boolean> {
    try {
      await this.awsSESService.sendEmail({
        subject: '[Findeet!] 비밀번호를 변경하시겠습니까?',
        recipients: [to],
        sender: this.fromEmail,
        htmlBody: `<h2>혹시, 비밀번호 잊으셨나요? 🥺</h2><br>
                새로운 비밀번호 설정을 위해 변경하기 버튼을 클릭해 주세요!<br>
                <a href="${this.domain}/reset-password?salt=${salt}&email=${to}" target="_blank">변경하기</a>`,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async createSignUp(): Promise<boolean> {
    try {
      await this.awsSESService.createTemplate({
        name: ENUM_EMAIL.SIGN_UP,
        subject: `Welcome`,
        htmlBody: readFileSync(
          './templates/email.sign-up.template.html',
          'utf8',
        ),
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async getSignUp(): Promise<GetTemplateCommandOutput> {
    try {
      const template = await this.awsSESService.getTemplate({
        name: ENUM_EMAIL.SIGN_UP,
      });

      return template;
    } catch (err: unknown) {
      return;
    }
  }

  async deleteSignUp(): Promise<boolean> {
    try {
      await this.awsSESService.deleteTemplate({
        name: ENUM_EMAIL.SIGN_UP,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async sendSignUp(
    { to }: EmailSendDto,
    { salt }: IAuthHash,
  ): Promise<boolean> {
    try {
      await this.awsSESService.sendEmail({
        subject: '[Findeet!] 회원 가입을 환영합니다.',
        recipients: [to],
        sender: this.fromEmail,
        htmlBody: `<h2>안녕하세요, Findeet! 에 오신 것을 환영합니다 😊</h2><br>
                회원 가입을 위해 아래 이메일 인증을 완료해 주세요!<br>
                <a href="${this.domain}/new-password?salt=${salt}&email=${to}" target="_blank">인증하기</a>`,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }
}
