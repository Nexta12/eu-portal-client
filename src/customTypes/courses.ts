import { Bill } from '@customTypes/finance';
import { Cohort } from '@customTypes/user';

export enum Semester {
  FIRST = 'first',
  SECOND = 'second'
}

export enum AcademicsStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum Level {
  ONE_HUNDRED_LEVEL = '100L',
  TWO_HUNDRED_LEVEL = '200L',
  THREE_HUNDRED_LEVEL = '300L',
  FOUR_HUNDRED_LEVEL = '400L',
  FIVE_HUNDRED_LEVEL = '500L'
}

export type Course = {
  id: string;
  name: string;
  code: string;
  unit: number;
  facilitator?: string;
  description: string;
  costUsd: number;
  semester: Semester;
  level: Level;
  isCompulsory: boolean;
  cohort?: Cohort;
  programme: Programme | string;
};

export type SemesterCourse = {
  semesterCourseId: string;
  name: string;
  code: string;
  unit: number;
  description: string;
  costUsd: number;
  isCompulsory: boolean;
  isPaid: boolean;
  isEnrolled: boolean;
  isCompleted: boolean;
};

export type Programme = {
  id: string;
  name: string;
  code: string;
  faculty?: string | Faculty;
  description: string;
  durationInMonths: number;
  entryRequirements?: string;
  objectives?: string;
  overview?: string;
  isCertificate: boolean;
  isDiploma: boolean;
  isDegree: boolean;
  isPostgraduate: boolean;
};

export type Academics = {
  id: string;
  level: Level;
  semester: Semester;
  gpa: number;
  status: AcademicsStatus;
  programme?: string;
  cohort?: string;
  dateCreated: string;
};

export interface Faculty {
  id: string;
  name: string;
  createdAt: Date | string;
  createdBy: string;
  programmes?: Programme[];
}

export type CurrentSemester = {
  bills: Bill[];
  courses: SemesterCourse[];
} & Academics;
