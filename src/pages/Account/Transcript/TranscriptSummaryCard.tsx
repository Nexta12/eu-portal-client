import React from 'react';
import { Card, Col, Row } from 'antd';
import { AntTag } from '@components/Tag';

interface TranscriptSummaryCardProps {
  cohort: string;
  startDate: string;
  studentStatus: string;
  totalRequiredCreditUnits: number;
  totalAcquiredCreditUnits: number;
  cgpa: number;
}

export const TranscriptSummaryCard = ({
  cohort,
  totalAcquiredCreditUnits,
  totalRequiredCreditUnits,
  cgpa,
  studentStatus,
  startDate
}: TranscriptSummaryCardProps) => (
  <Card title="Transcript Summary">
    <Row>
      <Col span={12}>
        <div className="mb-2 font-large font-weight-bold">STUDENT INFORMATION</div>
        <div className="d-flex gap-1 mb-1">
          <div>Programme:</div>
          <div className="font-weight-bold">{cohort}</div>
        </div>
        <div className="d-flex gap-1 mb-1">
          <div>Start Date:</div>
          <div className="font-weight-bold">{startDate}</div>
        </div>
        <div className="d-flex gap-1">
          <div>Student Status:</div>
          <AntTag color="green" text={studentStatus} />
        </div>
      </Col>
      <Col span={12}>
        <div className="mb-2 font-large font-weight-bold">GPA TOTALS</div>
        <div className="d-flex gap-1 mb-1 align-items-center">
          <div>Total required credit units:</div>
          <div className="font-weight-bold font-large">
            <AntTag color="grey" text={String(totalRequiredCreditUnits)} />
          </div>
        </div>
        <div className="d-flex gap-1 mb-1 align-items-center">
          <div>Total acquired credit units:</div>
          <div className="font-weight-bold font-large">
            <AntTag color="grey" text={String(totalAcquiredCreditUnits)} />
          </div>
        </div>
        <div className="d-flex gap-1 mb-1 align-items-center">
          <div>CGPA:</div>
          <div className="font-weight-bold font-large">
            <AntTag color="grey" text={String(cgpa)} />
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);
