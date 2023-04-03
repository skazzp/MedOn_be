import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public sendConfirmationLink() {
    return this.mailerService.sendMail({
      to: 'jurchenko.a@gmail.com',
      from: this.configService.get('EMAIL_SENDER'),
      subject: 'Please confirm your registration in MedOn System',
      template: 'welcome',
      context: {
        link: 'http://link_example/1387253671256',
      },
    });
  }
}
