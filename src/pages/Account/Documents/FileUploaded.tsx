import React, { useMemo } from 'react';
import { BiSolidFileJpg } from 'react-icons/bi';
import { BsFileEarmarkPdfFill, BsFileEarmarkWordFill, BsFileEarmarkZipFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Alert, Col, Tag } from 'antd';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { SuccessResponse } from '@customTypes/general';
import { DocType, StudentProfile } from '@customTypes/user';
import useAuthStore from '@store/authStore';
import { colorPrimary } from '@styles/theme';
import { bytesToKbOrMb, extractNameFromFileUrl, formatDate } from '@utils/helpers';
import styles from './Documents.module.scss';

const findFileType = (fileName: string) => {
  const fileExtension = fileName?.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'pdf': {
      return <BsFileEarmarkPdfFill size={30} color={colorPrimary} />;
    }
    case 'zip': {
      return <BsFileEarmarkZipFill size={30} color={colorPrimary} />;
    }
    case 'jpeg':
    case 'jpg':
    case 'gif':
    case 'tiff': {
      return <BiSolidFileJpg size={30} />;
    }
    default: {
      return <BsFileEarmarkWordFill size={30} />;
    }
  }
};

const FileUploaded = () => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const { data: profileData, error } = useSWR(
    `${endpoints.students}/${userId}`,
    async (url: string) => {
      const response = await apiClient.get<SuccessResponse<StudentProfile>>(url);
      return response.data.data;
    }
  );

  const documents = useMemo(() => profileData?.document.docs || [], [profileData?.document.docs]);

  return (
    <>
      {error && <Alert type="error" message={error.message} className="width-100" closable />}
      <Col xs={24} lg={8} className={styles.fileUploaded}>
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <strong className="mr-1">Uploaded Files</strong>
            <Tag color="success">{documents.length} File(s)</Tag>
          </span>
        </div>
        <ul className={styles.allFiles}>
          {documents.map((doc: DocType, index: number) => (
            <li key={index} className={styles.file}>
              <div className="d-flex align-items-start gap-1">
                <span>{findFileType(doc?.format)}</span>
                <div className="d-flex flex-direction-column gap-1">
                  <Link
                    to={doc?.url}
                    target="_blank"
                    className="text-color-primary"
                    rel="noopener noreferrer"
                  >
                    {extractNameFromFileUrl(doc?.url)}
                  </Link>
                  <div className="d-flex flex-direction-column">
                    <div>{formatDate(doc.createdAt)}</div>
                    <div>{bytesToKbOrMb(doc?.bytes)}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Col>
    </>
  );
};

export default FileUploaded;
