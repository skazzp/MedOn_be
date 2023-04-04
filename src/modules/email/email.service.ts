import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public sendConfirmationLink(to, link) {
    return this.mailerService.sendMail({
      to,
      from: this.configService.get('EMAIL_SENDER'),
      subject: 'Please confirm your registration in MedOn System',
      template: 'welcome',
      context: {
        link,
      },
    });
  }
}
