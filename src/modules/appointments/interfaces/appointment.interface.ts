export interface Appointment {
  id: number;
  link: string;
  startTime: Date;
  endTime: Date;
  localDoctorId: number;
  remoteDoctorId: number;
  patientId: number;
  createdAt: Date;
  updatedAt?: Date;
}
