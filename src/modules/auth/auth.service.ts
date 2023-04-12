import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { Doctor } from '@entities/Doctor';
import { ReconfirmDoctorDto } from '@modules/auth/dto/reconfirm-doctor.dto';
import { SignupDoctorDto } from '@modules/auth/dto/signup-doctor.dto';
import { EmailService } from '@modules/email/email.service';
import { ForgetPasswordDoctorDto } from '@modules/auth/dto/forgetPassword-doctor.dto';
import { ResetPasswordDoctorDto } from '@modules/auth/dto/resetPassword-doctor.dto';

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

  async confirm(token: string): Promise<void> {
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
          throw new UnauthorizedException('Invalid confirmation link!');
      });
  }

  async reconfirm(dto: ReconfirmDoctorDto): Promise<string> {
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
      .andWhere('doctor.is_verified = 0')
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

  async getToken(payload: string | object | Buffer): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: this.config.get('CONFIRMATION_TOKEN_EXPIRED_AT'),
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async forgetPassword(dto: ForgetPasswordDoctorDto): Promise<void> {
    await this.doctorRepo
      .findOne({
        where: { email: dto.email },
      })
      .then((doctor) => {
        if (!doctor) throw new UnauthorizedException('Doctor not found!');
      });
    const token = await this.getToken({ email: dto.email });
    const link = `${this.config.get('BASE_FRONT_URL')}/reset-password/${token}`;
    await this.email.sendForgetPasswordLink(dto.email, link);
  }

  async resetPassword(dto: ResetPasswordDoctorDto): Promise<void> {
    await this.doctorRepo.update(
      {
        email: dto.email,
      },
      {
        password: await argon.hash(dto.newPassword),
      },
    );
  }
}
