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

  async signup(dto: SignupDoctorDto): Promise<string> {
    const hash = await argon.hash(dto.password);
    const token = await this.getToken({ email: dto.email });
    const link = `${this.config.get('BASE_SERVER_URL')}/auth/confirm/${token}`;

    const doctor = this.doctorRepo.create({
      ...dto,
      password: hash,
      token,
    });

    await this.doctorRepo.save(doctor);
    await this.email.sendConfirmationLink(dto.email, link);

    return link;
  }

  async confirm(token): Promise<void> {
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
          throw new UnauthorizedException('Invalid verification link!');
      });
  }

  async reconfirm(dto): Promise<string> {
    const token = await this.getToken({ email: dto.email });
    const link = `${this.config.get('BASE_SERVER_URL')}/auth/confirm/${token}`;

    await this.doctorRepo
      .createQueryBuilder('doctor')
      .update(Doctor)
      .set({
        token,
        updatedAt: new Date(),
      })
      .where('doctor.email = :email', { email: dto.email })
      .andWhere('doctor.isVerified = false')
      .execute()
      .then((response) => {
        if (!response.affected)
          throw new UnauthorizedException(
            "You don't need to verify you account.",
          );
      });

    await this.email.sendConfirmationLink(dto.email, link);

    return link;
  }

  async getToken(payload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
