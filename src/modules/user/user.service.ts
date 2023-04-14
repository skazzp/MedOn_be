import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { IProfile } from '@common/interfaces/userProfileResponses';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private config: ConfigService,
  ) {}

  async getUser(payload: { email: string }): Promise<IProfile> {
    try {
      const user = await this.doctorRepo
        .createQueryBuilder('doctor')
        .where('doctor.email = :email', { email: payload.email })
        .getOne();

      if (!user) throw new UnauthorizedException('User not found!');
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.token;

      return user;
    } catch (error) {
      throw new UnauthorizedException('User not found!');
    }
  }

  async updateUser(payload: Partial<Doctor>): Promise<Doctor> {
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
