import { TranscriptResult } from '@pages/Account/Transcript/Transcript';

export const dummyProfileDetails = {
  name: 'Giftu Girma',
  firstName: 'Giftu',
  lastName: 'Girma',
  course: 'Computer science',
  email: 'giftugirma@gmail.com',
  birthday: '24-03-2023',
  telephone: '+25170311283',
  gender: 'Male',
  country: 'Ethopia',
  city: 'Addis Abba',
  postalCode: '340106',
  address: 'AR_04_0655 Street, Kolfe Keranio Addis Ababa Ethopia',
  joined: 'Joined in January 2023',
  cohort: 'certificate',
  matricNum: 'EUA202300934',
  image: 'https://i.ibb.co/DfHjrqM/1686187108970.jpg',
  degree: 'BSc Computer Science',
  balance: 1234.56
};

export const dummyResults: TranscriptResult[] = [
  {
    title: 'First Semester (Year 1)',
    year: '2020/2021',
    result: [
      {
        courseCode: 'CSC 101',
        courseTitle: 'Introduction to Computer Science1',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 102',
        courseTitle: 'Mathematics',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 103',
        courseTitle: 'Chemistry',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 104',
        courseTitle: 'Biology',
        creditUnit: 3,
        grade: 'F',
        status: 'failed'
      }
    ]
  },
  {
    title: 'Second Semester (Year 1)',
    year: '2020/2021',
    result: [
      {
        courseCode: 'CSC 101',
        courseTitle: 'Introduction to Computer Science1',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 102',
        courseTitle: 'Mathematics',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 103',
        courseTitle: 'Chemistry',
        creditUnit: 3,
        grade: 'A',
        status: 'passed'
      },
      {
        courseCode: 'CSC 104',
        courseTitle: 'Biology',
        creditUnit: 3,
        grade: 'F',
        status: 'failed'
      }
    ]
  }
];
