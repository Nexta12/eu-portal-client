import React from 'react';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { LuMailbox } from 'react-icons/lu';
import {
  RiCake2Line,
  RiCellphoneLine,
  RiFlagLine,
  RiMailLine,
  RiRoadMapLine
} from 'react-icons/ri';
import { PiSuitcaseSimpleLight } from 'react-icons/pi';
import { SiGoogleclassroom } from 'react-icons/si';
import { LiaCitySolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { paths } from '@routes/paths';
import styles from './Profile.module.scss';

interface PersonalInformationProps {
  email?: string;
  birthday?: string;
  telephone?: string;
  gender?: string;
  country?: string;
  postalCode?: string;
  address?: string;
  city?: string;
  employmentStatus?: string;
  level?: string;
}

export const PersonalInformation = ({
  email,
  birthday,
  telephone,
  gender,
  country,
  postalCode,
  address,
  city,
  employmentStatus,
  level
}: PersonalInformationProps) => {
  const navigate = useNavigate();
  const iconSize = 20;

  const infoData = [
    {
      label: 'Email',
      value: email,
      icon: <RiMailLine size={iconSize} />
    },
    {
      label: 'Birthday',
      value: birthday,
      icon: <RiCake2Line size={iconSize} />
    },
    {
      label: 'Telephone',
      value: telephone,
      icon: <RiCellphoneLine size={iconSize} />
    },
    {
      label: 'Gender',
      value: gender,
      icon: <BsGenderAmbiguous size={iconSize} />
    },
    {
      label: 'Country',
      value: country,
      icon: <RiFlagLine size={iconSize} />
    },
    {
      label: 'Postal Code',
      value: postalCode,
      icon: <LuMailbox size={iconSize} />
    },
    {
      label: 'Address',
      value: address,
      icon: <RiRoadMapLine size={iconSize} />
    },
    {
      label: 'City',
      value: city,
      icon: <LiaCitySolid size={iconSize} />
    },
    {
      label: 'Employment Status',
      value: employmentStatus,
      icon: <PiSuitcaseSimpleLight size={iconSize} />
    },
    {
      label: 'Level',
      value: level,
      icon: <SiGoogleclassroom size={iconSize} />
    }
  ];

  return (
    <Card>
      <div className={styles.personalInfoCardHeader}>
        <div className="text-color-white">Personal Info</div>
        <div className="text-link" onClick={() => navigate(paths.editProfile)}>
          Edit
        </div>
      </div>
      <Row className="py-2">
        {infoData.map(({ label, value, icon }, index) => (
          <Col key={index} xs={12} lg={8} className="mb-2">
            <div className="d-flex gap-1">
              {icon}
              <small>{label}</small>
            </div>
            <div className="font-weight-bold ml-3">
              {value || <p className="text-color-error">none</p>}
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
