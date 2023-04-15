import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { IProfile } from '@common/interfaces/userProfileResponses';
import { SignupDoctorDto } from '@modules/auth/dto/signup-doctor.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async updateUser(userId: number, payload: UpdateUserDto): Promise<void> {
    try {
      const user = await this.doctorRepo
        .createQueryBuilder('doctor')
        .where('id = :id', { id: userId })
        .getOne();

      if (!user) throw new UnauthorizedException('User not found!');

      await this.doctorRepo
        .createQueryBuilder('doctor')
        .update(Doctor)
        .set({
          ...payload,
          updatedAt: new Date(),
        })
        .where('id = :id', { id: userId })
        .execute();
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
