import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export interface IProfileResponse {
  statusCode: HttpStatus;
  data: IProfile;
}

export interface IProfileRequest extends Request {
  user: {
    email: string;
    userId: number;
  };
}

export interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string | null;
  country: string | null;
  photo: string | null;
  dateOfBirth: Date | null;
  role: string | null;
  isVerified: boolean;
  timeZone: string | null;
  specialityId: number | null;
}

export interface IUpdateProfileResponse {
  statusCode: HttpStatus;
  message: string;
}

export interface IUpdateProfile {
  user: IProfile;
  token: string;
}

export interface IUpdatePhoto {
  photo: string;
}
