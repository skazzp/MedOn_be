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
    const user = await this.userRepository.findOneBy({ email: details.email });
    if (user) return user;
    const newUser = this.userRepository.create(details);
    return this.userRepository.save(newUser);
  }

  async findUser(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
