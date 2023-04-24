import { HttpStatus } from '@nestjs/common';

export interface IServerResponse<T = object> {
  statusCode: HttpStatus;
  message?: string | string[];
  data?: T;
}
