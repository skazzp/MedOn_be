import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface RequestJwt extends Request {
  user: {
    userId: number;
  } & JwtPayload;
}
