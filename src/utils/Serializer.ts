import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { GoogleUser } from 'src/typeorm/entities/GoogleUser';

type AuthError = Error | null;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(
    user: GoogleUser,
    done: (err: AuthError, user: GoogleUser) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    payload: GoogleUser,
    done: (err: AuthError, user: GoogleUser) => void,
  ) {
    const user = await this.authService.findUser(payload.email);
    return user ? done(null, user) : done(null, null);
  }
}
