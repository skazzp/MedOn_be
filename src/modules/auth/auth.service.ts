import { Repository } from 'typeorm';
import * as argon from 'argon2';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { LoginDoctorDto } from '@modules/dto/login-doctor.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async login(dto: LoginDoctorDto) {
    const doctor = await this.doctorRepo.findOne({
      where: {
        email: dto.email,
      },
    });
    if (!doctor) {
      throw new UnauthorizedException('Invalid email');
    }

    const pwMatches = await argon.verify(
      doctor.password,
      dto.password
    );
    if (!pwMatches) {
      throw new UnauthorizedException('Invalid  password');
    }
    const accessToken = await this.generateAccessToken(doctor.id, doctor.email);
    return {
      access_token: accessToken,
    };
  }

  private async generateAccessToken(
    doctorId: number,
    email: string
  ): Promise<string> {
    const payload = {
      sub: doctorId,
      email: email,
    };
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRATION_TIME');
    const accessToken = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
    return accessToken;
  }
}
