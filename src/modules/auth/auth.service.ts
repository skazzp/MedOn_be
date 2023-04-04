import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { Doctor } from '../../typeorm/entities/Doctor';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private email: EmailService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDoctorDto): Promise<{ confirmationLink: string }> {
    const hash = await argon.hash(dto.password);
    const verificationToken = await this.jwt.signAsync(
      { email: dto.email },
      { expiresIn: '2h', secret: this.config.get('JWT_SECRET') },
    );
    const doctor = this.doctorRepo.create({
      ...dto,
      password: hash,
      token: verificationToken,
    });

    const doctorSaved = await this.doctorRepo.save(doctor);
    const confirmationLink = `${this.config.get(
      'BASE_SERVER_URL',
    )}/auth/confirm/${doctorSaved.token}`;

    await this.email.sendConfirmationLink(doctorSaved.email, confirmationLink);

    return { confirmationLink };
  }

  async confirm(token): Promise<{ account_confirmed: boolean }> {
    await this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    });

    await this.doctorRepo
      .createQueryBuilder('doctor')
      .update(Doctor)
      .set({
        token: null,
        isVerified: true,
        updatedAt: new Date(),
      })
      .where('token = :token', { token })
      .execute()
      .then((response) => {
        if (!response.affected)
          throw new UnauthorizedException(
            'You have already confirmed your account!',
          );
      });

    return { account_confirmed: true };
  }
}
