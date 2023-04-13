import { Role } from "@common/enums/Role";

export interface DoctorResponse {
  id: number;
  email: string;
  firstName: string;
  isVerified: boolean;
  lastName: string;
  city: string;
  country: string;
  role: Role;
  specialityId: number;
  photo: string;
  dateOfBirth: Date;
  timeZone: string;
}
