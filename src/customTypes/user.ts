import { Dayjs } from 'dayjs';
import { Level, Programme } from '@customTypes/courses';

export enum UserRole {
  student = 'student',
  admin = 'admin',
  staff = 'staff',
  chat = 'chat'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNSPECIFIED = 'unspecified',
  UNDISCLOSED = 'undisclosed'
}

export enum AdmissionStatus {
  APPLICATION = 'application',
  APPLICATION_FEE_PAID = 'application_fee_paid',
  IN_REVIEW = 'in_review',
  ADMITTED = 'admitted',
  REJECTED = 'rejected'
}

export enum Cohort {
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  DEGREE = 'degree',
  POSTGRADUATE = 'postgraduate'
}

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  SELF_EMPLOYED = 'self-employed'
}

export type DocType = {
  format: string;
  bytes: number;
  createdAt: Date;
  url: string;
};

export type StudentDocument = {
  picture: string;
  docs: DocType[];
};

export interface StudentProfile {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  isPasswordGenerated?: boolean;
  gender: Gender;
  dateOfBirth?: Dayjs | string | null;
  phoneNumber?: string;
  matriculationNumber: string;
  nationality: string;
  country?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  cohort: Cohort;
  programme: Programme;
  level: Level;
  employmentStatus: EmploymentStatus;
  admissionStatus: AdmissionStatus;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
  document: StudentDocument;
}

export enum ProcessAdmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface User {
  userId: string;
  name: string;
  role: UserRole;
}
