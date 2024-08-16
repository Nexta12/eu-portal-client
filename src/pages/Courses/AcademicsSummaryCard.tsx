import React, { ReactNode } from 'react';
import { Card, Col, ColProps, Row } from 'antd';
import cn from 'classnames';
import { Level, Semester } from '@customTypes/courses';
import { capitalize } from '@utils/letterFormatter';

interface TextColProps extends ColProps {
  children: ReactNode;
}

interface PreRegistrationSummaryCardProps {
  cohort?: string;
  programme?: string;
  level?: Level;
  semester?: Semester;
}

const TextCol = ({ children, className = '', ...props }: TextColProps) => (
  <Col {...props} className={cn('font-semi-large my-1', { [className]: className })}>
    {children}
  </Col>
);

const AcademicsSummaryCard = ({
  cohort = '',
  programme = '',
  level,
  semester
}: PreRegistrationSummaryCardProps) => (
  <Card className="mb-2">
    <Row gutter={16}>
      <Col span={12}>
        <Row>
          <TextCol span={5}>Cohort:</TextCol>
          <TextCol span={19}>
            {capitalize(cohort) || <span className="text-color-error">No Cohort</span>}
          </TextCol>
        </Row>
        <Row>
          <TextCol span={5}>Programme:</TextCol>
          <TextCol span={19}>
            {capitalize(programme) || <span className="text-color-error">No Programme</span>}
          </TextCol>
        </Row>
      </Col>
      <Col span={12}>
        <Row>
          <TextCol span={4}>Level:</TextCol>
          <TextCol span={20}>{level || <span className="text-color-error">No Level</span>}</TextCol>
        </Row>
        <Row>
          <TextCol span={4}>Semester:</TextCol>
          <TextCol span={20}>
            {semester ? (
              capitalize(semester.toString())
            ) : (
              <span className="text-color-error">No Semester</span>
            )}
          </TextCol>
        </Row>
      </Col>
    </Row>
  </Card>
);

export default AcademicsSummaryCard;
