import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async sendMail(to, link) {
    return this.emailService.sendConfirmationLink(to, link);
  }
}
