import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface AvailabilityReq extends Request {
  user: {
    userId: number;
  } & JwtPayload;
}
