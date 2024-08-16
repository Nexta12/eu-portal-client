import React from 'react';
import { AntTable } from '@components/Table';
import { AntTag } from '@components/Tag';

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type SemesterResult = {
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  grade: Grade;
  status: string;
};

const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: 'Course Code',
    dataIndex: 'courseCode',
    key: 'courseCode'
  },
  {
    title: 'Course Title',
    dataIndex: 'courseTitle',
    key: 'courseTitle'
  },
  {
    title: 'Credit Unit',
    dataIndex: 'creditUnit',
    key: 'creditUnit'
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) =>
      status === 'passed' ? (
        <AntTag color="green" text="Passed" />
      ) : (
        <AntTag color="red" text="Failed" />
      )
  }
];

interface TranscriptTableProps {
  title: string;
  year: string;
  result: SemesterResult[];
}

export const TranscriptTable = ({ title, result, year }: TranscriptTableProps) => {
  const dataSource = result.map((item, index) => ({
    key: `${item.courseTitle}-${index}-${title}`,
    sn: index + 1,
    ...item
  }));

  return (
    <div className="mt-3">
      <div className="mb-2">
        <h2 className="font-weight-bold">{title}</h2>
        <div>{year}</div>
      </div>
      <AntTable columns={columns} dataSource={dataSource} />
    </div>
  );
};
