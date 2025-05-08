import { GetTemplateCommandOutput } from '@aws-sdk/client-ses';
import { IAuthHash } from 'src/modules/auth/interfaces/auth.interface';
import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';

export interface IEmailService {
  createChangePassword(): Promise<boolean>;
  getChangePassword(): Promise<GetTemplateCommandOutput>;
  deleteChangePassword(): Promise<boolean>;
  sendChangePassword(to: string, salt: string): Promise<boolean>;
  createSignUp(): Promise<boolean>;
  getSignUp(): Promise<GetTemplateCommandOutput>;
  deleteSignUp(): Promise<boolean>;
  sendSignUp({ to }: EmailSendDto, { salt }: IAuthHash): Promise<boolean>;
}
