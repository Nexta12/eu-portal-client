import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { CardSkeleton } from '@components/Skeleton';
import { Course } from '@customTypes/courses';
import { paths } from '@routes/paths';

interface ProgrammeData {
  id: string;
  name: string;
  facultyName: string;
  courses: Course[];
}

const ProgrammesCourses = () => {
  const navigate = useNavigate();
  const { data: allProgrammes } = useSWR(`${endpoints.getCourses}?group=true`, async (url) => {
    const res = await apiClient.get(url);
    return res.data;
  });

  return (
    <DashboardContentLayout title="Programmes and Courses">
      <div className="d-flex justify-content-end">
        <Button size="large" type="primary" onClick={() => navigate(paths.newCourse)}>
          Create new course
        </Button>
      </div>
      <div className="mt-2">
        <Row gutter={[24, 24]}>
          {allProgrammes &&
            allProgrammes?.map((programme: ProgrammeData, index: number) => (
              <Col lg={6} key={index}>
                <Card
                  className="d-flex flex-direction-column height-100"
                  hoverable
                  onClick={() => navigate(`${paths.courses}/${programme.id}`)}
                >
                  <h3 className="font-weight-bolder">{programme.name}</h3>
                  <div className="mt-1">{programme.facultyName}</div>
                  <div className="mt-1">Total Courses: {programme.courses.length}</div>
                </Card>
              </Col>
            ))}
          {!allProgrammes && <CardSkeleton number={8} />}
        </Row>
      </div>
    </DashboardContentLayout>
  );
};

export default ProgrammesCourses;
