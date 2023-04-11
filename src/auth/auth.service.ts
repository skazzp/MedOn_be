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

  validateGoogleUser(details: GoogleUserDetails) {
    console.log('AuthService');
    console.log(details);
  }
}
