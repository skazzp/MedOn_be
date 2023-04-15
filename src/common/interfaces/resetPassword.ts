import { Request } from 'express';

export interface IResetPasswordRequest extends Request {
  doctor: {
    email: string;
  };
}

export interface IResetPassword {
  email: string;
  newPassword: string;
}
