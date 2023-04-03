import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async sendMail() {
    const result = await this.emailService.sendConfirmationLink();
    return result;
  }
}
