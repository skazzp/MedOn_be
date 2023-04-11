import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/typeorm/entities/GoogleUser';
import { GoogleUserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(GoogleUser)
    private readonly userRepository: Repository<GoogleUser>,
  ) {}

  async validateGoogleUser(details: GoogleUserDetails) {
    try {
      const user = await this.userRepository.findOneBy({
        email: details.email,
      });
      if (user) return user;
      const newUser = this.userRepository.create(details);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error('Error validating Google user');
    }
  }

  async findUser(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return user;
    } catch (error) {
      throw new Error('Error finding user');
    }
  }
}
