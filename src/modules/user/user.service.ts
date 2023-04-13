import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private config: ConfigService,
  ) {}

  async getUser(payload: { email: string }): Promise<Doctor> {
    try {
      const user = await this.doctorRepo
        .createQueryBuilder('doctor')
        .where('doctor.email = :email', { email: payload.email })
        .getOne();

      if (!user) throw new UnauthorizedException('User not found!');

      return user;
    } catch (error) {
      throw new UnauthorizedException('User not found!');
    }
  }
}
