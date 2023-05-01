import { Role } from '@common/enums';

export interface JwtPayload {
  email: string;
  id: string;
  role: Role;
}
