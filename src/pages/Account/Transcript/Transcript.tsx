import React from 'react';
import { DownloadButton } from '@components/Button';
import { DashboardContentLayout } from '@components/Layout';
import { dummyProfileDetails, dummyResults } from '@utils/data';
import { TranscriptSummaryCard } from './TranscriptSummaryCard';
import { SemesterResult, TranscriptTable } from './TranscriptTable';

export type TranscriptResult = {
  title: string;
  year: string;
  result: SemesterResult[];
};

const Transcript = () => {
  const studentProfile = {
    cohort: dummyProfileDetails.name,
    startDate: 'May 2021',
    studentStatus: 'registered',
    totalRequiredCreditUnits: 120,
    totalAcquiredCreditUnits: 100,
    cgpa: 4.5
  };

  return (
    <DashboardContentLayout title="Transcript" preTitle="Unofficial transcript">
      <div className="d-flex justify-content-end">
        <DownloadButton text="Download Transcript" />
      </div>
      <TranscriptSummaryCard {...studentProfile} />
      {dummyResults.map(({ title, year, result }, index) => (
        <TranscriptTable title={title} year={year} result={result} key={index} />
      ))}
    </DashboardContentLayout>
  );
};

export default Transcript;
