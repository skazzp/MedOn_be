import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { IProfile } from '@common/interfaces/userProfileResponses';
import { Doctor } from '@entities/Doctor';
import { UpdateUserPasswordDto } from '@modules/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private config: ConfigService,
  ) {}

  async getUserByEmail(email: string): Promise<Doctor> {
    const user = await this.doctorRepo
      .createQueryBuilder('doctor')
      .where('doctor.email = :email', { email })
      .getOne();
    if (!user) throw new UnauthorizedException('User not found!');
    return user;
  }

  async getUser(payload: { email: string }): Promise<IProfile> {
    const user = await this.getUserByEmail(payload.email);
    const { password, createdAt, updatedAt, token, ...result } = user;
    return result;
  }

  async updateUser(payload: Partial<Doctor>): Promise<Doctor> {
    const user = await this.getUserByEmail(payload.email);
    return user;
  }

  async updatePassword(
    payload: Partial<Doctor>,
    dto: UpdateUserPasswordDto,
  ): Promise<void> {
    const user = await this.getUserByEmail(payload.email);
    const isPasswordCorrect = await argon.verify(
      user.password,
      dto.currentPassword,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    user.password = await argon.hash(dto.newPassword);
    await this.doctorRepo.save(user);
  }
}