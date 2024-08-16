import parse from 'html-react-parser';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Row } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { DashboardContentLayout } from '@components/Layout';
import { AntTag } from '@components/Tag';
import { Faculty, Programme } from '@customTypes/courses';
import { InfoDisplayProps } from '@customTypes/general';
import { paths } from '@routes/paths';

type BooleanDisplayType = {
  label: string;
  value?: boolean;
  lg: number;
};

const InfoDisplay = ({ value, label, lg }: InfoDisplayProps) => (
  <Col sm={24} lg={lg} className="px-3 py-2">
    <div className="font-weight-bold">{label}</div>
    <div>{value || <div className="text-color-error">None</div>}</div>
  </Col>
);

const BooleanDisplay = ({ label, value, lg }: BooleanDisplayType) => {
  const boolValue = value === true ? value : false;
  return (
    <Col sm={24} lg={lg}>
      <b>{label}</b>
      <div>
        {boolValue ? <AntTag color="green" text="Yes" /> : <AntTag color="red" text="No" />}
      </div>
    </Col>
  );
};

const ViewProgramme = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: programme } = useSWR(
    `${endpoints.programmes}/${params.id}`,
    async (url: string) => {
      const response = await apiClient.get<Programme>(url);
      return response.data;
    }
  );

  return (
    <DashboardContentLayout title="View Programme" description="Detailed description">
      <div className="d-flex justify-content-end m-2">
        <Button
          type="primary"
          size="large"
          onClick={() => navigate(`${paths.editProgramme}/${params.id}`)}
        >
          Edit
        </Button>
      </div>
      <Card className="mb-2">
        <div className="d-flex flex-direction-column p-1 gap-3">
          <div className="p-2">
            <Row gutter={[24, 24]}>
              <InfoDisplay value={programme?.name} label="Name" lg={6} />
              <InfoDisplay value={(programme?.faculty as Faculty)?.name} label="Faculty" lg={6} />
              <InfoDisplay value={programme?.code} label="Code" lg={6} />
              <InfoDisplay value={programme?.durationInMonths} label="Duration" lg={6} />
            </Row>
          </div>
          <div className="p-2">
            <Row gutter={[24, 24]}>
              <BooleanDisplay label="Certificate" value={programme?.isCertificate} lg={6} />
              <BooleanDisplay label="Diploma" value={programme?.isDiploma} lg={6} />
              <BooleanDisplay label="Degree" value={programme?.isDegree} lg={6} />
              <BooleanDisplay label="Postgraduate" value={programme?.isPostgraduate} lg={6} />
            </Row>
          </div>
          <div className="p-2">
            <Row gutter={[24, 24]}>
              <InfoDisplay value={programme?.description} label="Description" lg={8} />
              <InfoDisplay value={programme?.entryRequirements} label="Requirements" lg={8} />
              <InfoDisplay value={programme?.objectives} label="Objectives" lg={8} />
            </Row>
          </div>
          <div className="p-2">
            <Row gutter={[24, 24]}>
              <Col sm={24} lg={24} className="px-3 py-2">
                <div className="font-weight-bold">Overview</div>
                <div>
                  {programme?.overview ? (
                    parse(programme?.overview)
                  ) : (
                    <div className="text-color-error">None</div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </DashboardContentLayout>
  );
};

export default ViewProgramme;
