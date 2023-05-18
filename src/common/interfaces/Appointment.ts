import { Appointment } from '@entities/Appointments';
import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        userId: number;
    };
}

export interface IProfileResponse {
    statusCode: HttpStatus;
    data: Appointment[];
}

export interface IProfileResponseOne {
    statusCode: HttpStatus;
    data: Appointment;
}
export interface IServerResponse<T> {
    statusCode: HttpStatus;
    data: T;
}

