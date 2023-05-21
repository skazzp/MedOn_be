import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { UpdateUserPasswordDto } from '@modules/user/dto/updateUser.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import {
  IProfile,
  IUpdateProfile,
} from '@common/interfaces/userProfileResponses';
import { AuthService } from '@modules/auth/auth.service';
import { FilesService } from '@modules/files/files.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private config: ConfigService,
    private authService: AuthService,
    private filesService: FilesService,
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
    try {
      const user = await this.getUserByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found!');
      const { password, createdAt, updatedAt, token, ...userData } = user;

      return userData;
    } catch (error) {
      throw new UnauthorizedException('User not found!');
    }
  }

  async updateUser(
    userId: number,
    payload: UpdateUserDto,
  ): Promise<IUpdateProfile> {
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
      const updatedUser = { ...user, ...payload };
      const { password, createdAt, updatedAt, token, ...userData } =
        updatedUser;
      const accessToken = await this.authService.getToken({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      return { user: userData, token: accessToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async updatePhoto(
    id: number,
    dataBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const photo = await this.filesService
      .uploadPublicFile(dataBuffer, filename)
      .then((res) => {
        const name: string = res;
        return name;
      });

    const updateResult = await this.doctorRepo
      .createQueryBuilder('doctor')
      .update(Doctor)
      .set({
        photo,
        updatedAt: new Date(),
      })
      .where('id = :id', { id })
      .execute();

    if (!updateResult.affected) {
      throw new UnauthorizedException('User not found!');
    }

    return photo;
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
