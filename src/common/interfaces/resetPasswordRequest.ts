import { Request } from 'express';

export interface IResetPasswordRequest extends Request {
  doctor: {
    email: string;
  };
}
